import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Col';

import axios from 'axios'
import './css/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie';
import SearchCountry from '../component/SearchCountry';
import SearchCity from '../component/search_city/SearchCity';
import Chat from './Chat';


function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Success Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          registrazione andata a buon fine, accedi per usufruire di tutti i servizi
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const Login = (show) => {


  const close = () => {
    setModalShow(false);
    history(0)
  }
  const [modalShow, setModalShow] = useState(show===true ? true:false);
  const [empty,setEmpty] = useState(true)
  const [selectedCountry,setSelectedCountry] = useState(false)
  const [listCity, setListCity] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [cookies, setCookie] = useCookies(['user']);
  const [existed, setExisted] = useState(false);
  const [ password_wrong ,setPassword_wrong] = useState(false)
  const [nutritionist, setNutritionist] = useState(false);

  const [validated, setValidated] = useState(false);
  const [form_Data, set_Form_Data] = useState({
    firstname: "",
    lastname: "",
    password: "",
    confirmPass: "",
    email: "",
    email_login: "",
    password_login: "",
    country: "",
    city: "",
    address: "",
    image: "" 
  });
  
  const expand_form = () => {
    setNutritionist((nutritionist)=>!nutritionist)
  }
  const chngFn = (event) => {
    const { name, value } = event.target;
    set_Form_Data({
      ...form_Data,
      [name]: value,
    });
    if (name == "email") {
      setExisted(false);
    }
  };

  const history = useNavigate();

  var formdata = new FormData();

  const change_pdf = () => {
    if (nutritionist) {
      if (document.getElementById("formFile").files.length == 0 ) {
        setEmpty(true);
      }
      else {
        var arr = document.getElementById("formFile").files[0].name.split(".")
        if (arr[arr.length - 1] === "pdf") {
          setEmpty(false);
        }
        else {
          setEmpty(true);
        }
      }
    }
    else {
      setEmpty(false);
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      
    }
    else {
      var configuration =''
      if (!nutritionist){
        configuration = {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            
            withCredentials: true
        };
        formdata.append("firstname", form_Data.firstname)
        formdata.append("lastname", form_Data.lastname)
        formdata.append("email", form_Data.email)
        formdata.append("password", form_Data.password)
        formdata.append("is_nutritionist", false)

      }
      else{
        configuration = {
          headers: {
            "Content-Type": 'multipart/form-data',
            "Access-Control-Allow-Origin": "http://localhost:4000",
          },
          
          withCredentials: true,
        }
        //alert(document.getElementById("formFile").files[0])
        formdata.append("file",document.getElementById("formFile").files[0])
        formdata.append("firstname", form_Data.firstname)
        formdata.append("lastname", form_Data.lastname)
        formdata.append("email", form_Data.email)
        formdata.append("password", form_Data.password)
        formdata.append("is_nutritionist", true)
        formdata.append("country", country)
        formdata.append("city", city)
        formdata.append("address", form_Data.address)
        formdata.append("image", "")

      }

      try {
        await axios.post("http://localhost:4000/register",formdata,configuration)
          .then(res => {
            console.log(res)
            if (res.data == "user already registered") {
              form_Data.email = "";
              setExisted(true);
              //document.getElementById("feedback_email").innerHTML="An account with this email already exists"

            }
            else if (res.data == "wrong type format") {
              
            }
            else if (res.data == "user registered") {
              setModalShow(true)
            }
          })
          .catch(event => {
            alert("wrong details")
            console.log(event);
          })

      }
      catch (event) {
        console.log(event);

      }

    }
    setValidated(true);

  } 


  async function handleLogin(event){
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
      const configuration = {
        method: "post",
        url: "http://localhost:4000/login",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:4000",
        },
        data: {
          email: form_Data.email_login,
          password: form_Data.password_login,
        },
      };

      try {
        await axios(configuration)
          .then(res => {
            if (res.data == "No account associated to this email!"){
              alert("no account found");
            }
            else if (res.data == "Incorrect password!") {
              setPassword_wrong(true)
              alert("incorrect password");
            }
            else { 
              history('/MyProfile');
            } 
          })
          .catch(event => {
            alert("wrong details")
            console.log(event);
          })

      }
      catch (event) {
        console.log(event);

      }

    }
    setValidated(true);

  }
  return (
    <>
      <div className="home-background"></div>
      <center>
      <Tab.Container className="container_form" id="left-tabs-example" defaultActiveKey="login">
      <Card className="card1">
      <Card.Body >

        <Nav variant="tabs" defaultActiveKey="first" fill>
          <Nav.Item>
            <Nav.Link eventKey="login" className='title'>Login</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="registration" className='title'>Registration</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
            <Tab.Pane eventKey="login"><div className='Reg' >
              <left>
                <Form noValidate onSubmit={handleLogin} href="/MyProfile">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control className='control' type="email" name="email_login" placeholder="name@example.com" onChange={chngFn} required isInvalid={
                    (validated &&
                            !/^\S+@\S+\.\S+$/.test(form_Data.email))} />
                        <Form.Control.Feedback type='invalid'></Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Password</Form.Label>
                        <Form.Control className='control' type="password" name="password_login" placeholder="Password" onChange={chngFn} isInvalid={password_wrong} />
                    <Form.Control.Feedback type='invalid'></Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                        <Form.Check type="checkbox" name="nutritionist" label="Remember me " className='checkbox'/>
                </Form.Group>
                <center><Button type="submit" id="submit">Login</Button></center>

                  </Form>
                  </left>
                  </div>
                  
                </Tab.Pane>
                <Tab.Pane eventKey="registration"> <div className='Reg'>
                
                  <div className="existing_user" >
                    {existed && <h4>This email is already in use!</h4>}
                  </div>
                  <Form id="form_reg" noValidate onSubmit={handleSubmit}>
                  <Col className="mb-3">
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control className='control' required name="firstname" type="firstname" placeholder="First Name" pattern="^[a-zA-Z0-9]+$" value={form_Data.firstname} onChange={chngFn}
                          isInvalid={(validated && !/^[a-zA-Z0-9]+$/.test(form_Data.firstname)) || (validated && form_Data.firstname == "")}
                          isValid={(validated && /^[a-zA-Z0-9]+$/.test(form_Data.firstname))}/>
                      <Form.Control.Feedback type='invalid'>Please enter a valid name</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Last Name</Form.Label>
                        <Form.Control className='control' value={form_Data.lastname} onChange={chngFn} required name="lastname" type="lastname" placeholder="Last Name"
                          isInvalid={(validated && !/^[a-zA-Z0-9]+$/.test(form_Data.lastname)) || (validated && form_Data.lastname == "")}
                          isValid={(validated && /^[a-zA-Z0-9]+$/.test(form_Data.lastname))} />
                      <Form.Control.Feedback type='invalid'>Please enter a valid lastname</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Email address</Form.Label>
                        <Form.Control className='control' id="email" value={form_Data.email} onChange={chngFn} required name="email" type="email" placeholder="name@example.com"
                          isInvalid={(validated && !/^\S+@\S+\.\S+$/.test(form_Data.email))}
                          isValid={(validated && /^\S+@\S+\.\S+$/.test(form_Data.email))}/>
                      <Form.Control.Feedback type="invalid" id="feedback_email">
                        Please enter a valid email address.
                      </Form.Control.Feedback>      </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Password</Form.Label>
                        <Form.Control className='control' minLength={6} value={form_Data.password} onChange={chngFn} id="password" required name="password" type="password" placeholder="Password"
                          isInvalid={validated && form_Data.password.length < 6}
                          isValid={validated && form_Data.password.length >= 6}/>
                      <Form.Control.Feedback type="invalid" >
                        Password must be at least 6 characters long.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control  className='control' type="password" name="confirmPass" placeholder='Confirm Password' value={form_Data.confirmPass} onChange={chngFn} minLength={6} required pattern={form_Data.password}
                          isInvalid={(validated && form_Data.confirmPass !== form_Data.password)||(validated && form_Data.confirmPass==="")}
                          isValid={ (validated && form_Data.confirmPass === form_Data.password) && (validated && form_Data.confirmPass!=="")}
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords do not match.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group id="checkbox_nutritionist" as={Row} className="mb-3">
                      <Form.Check type="checkbox" name="nutritionist" label="Are you a nutritionist? " className='checkbox' onClick={expand_form} onChange={chngFn}/>
                      </Form.Group>
                    </Col>
                    {nutritionist && <Col>
                      <Form.Group id="form_nutritionist" controlId="formFile" className="mb-3" onChange={()=>change_pdf}>
                        <Form.Label >Insert your certificate</Form.Label>
                        <Form.Control className='control' accept=".pdf" isInvalid={empty && validated} isValid={!empty && validated} type="file" />
                        <Form.Control.Feedback type="invalid">
                        You must insert a certification (format pdf)
                      </Form.Control.Feedback>
                      </Form.Group>
                      {validated && country == "" &&
                        <div className="existing_user" >
                          <h4> You must choose a Country</h4>
                          </div>
                          }
                      <SearchCountry  country={country} setCountry={setCountry} listCity={listCity} setListCity={setListCity} setCity={setCity} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}/>
                      {validated && city=="" && <div className="existing_user" ><h4>You must select a city!</h4></div>}
                      <SearchCity country={country} city={city} setCity={setCity} listCity={listCity} setListCity={setListCity} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
                      <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Address</Form.Label>
                          <Form.Control className='control' value={form_Data.address} onChange={chngFn} required name="address" type="address" placeholder="Address"
                            isInvalid={(validated && !/^[a-zA-Z0-9 ]+$/.test(form_Data.address)) || (validated && form_Data.address == "")}
                            isValid={(validated && /^[a-zA-Z0-9 ]+$/.test(form_Data.address))} />
                        <Form.Control.Feedback type='invalid'>Please enter a valid address</Form.Control.Feedback>
                      </Form.Group>
                    </Col>}
                    <center>
                      <Link reloadDocument to="/login" state={show}>
                        <Button type="submit" id="submit" >Registration</Button>
                      </Link>
                    </center>
                    </Form>
                 </div> </Tab.Pane>
          </Tab.Content>
         
      
       
      </Card.Body>
      
    </Card>
    </Tab.Container>
      </center>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => close()}
      />
    
    </>
  )
}

export default Login
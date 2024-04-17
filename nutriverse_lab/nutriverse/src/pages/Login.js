import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Col';

import axios from 'axios'
import './css/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from "react-router-dom"
import { useCookies } from 'react-cookie';
import SearchCountry from '../component/SearchCountry';

const Login = () => {
  const [cookies, setCookie] = useCookies(['user']);
  const [existed, setExisted] = useState(false);
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
  });
  
  const ciao = () => {
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

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
      const configuration = {
        method: "post",
        url: "http://localhost:4000/register",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:4000",
        },
        
        withCredentials: true,
        data: {
          firstname: form_Data.firstname,
          lastname: form_Data.lastname,
          email: form_Data.email,
          password: form_Data.password,
        },
      };

      try {
        await axios(configuration)
          .then(res => {
            if (res.data == "user already registered") {
              form_Data.email = "";
              setExisted(true);
              //document.getElementById("feedback_email").innerHTML="An account with this email already exists"

            }
            else if (res.data == "user registered") {
              history('/',
              {state:{
                firstname: form_Data.firstname,
                lastname: form_Data.lastname,
                }}
                );
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
              alert("incorrect password");
            }
            else { 
              history('/');
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
                <Form noValidate validated={validated} onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name="email_login" placeholder="name@example.com" onChange={chngFn} required isInvalid={
                    (validated &&
                      !/^\S+@\S+\.\S+$/.test(form_Data.email))} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password_login" placeholder="Password" onChange={chngFn} required />
                </Form.Group>
                <Form.Group>

                  {['checkbox'].map((type) => (
                    <div key={`default-${type}`} className="mb-3">
                      <Form.Check // prettier-ignore
                        type={type}
                        id={`default-${type}`}
                        label={`Remember Me`}
                        />


                    </div>
                  ))}
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
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Col className="mb-3">
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control required name="firstname" type="firstname" placeholder="First Name" pattern="^[a-zA-Z0-9]+$" value={form_Data.firstname} onChange={chngFn}
                        isInvalid={validated && !/^[a-zA-Z0-9]+$/.test(form_Data.user)} />
                      <Form.Control.Feedback type='invalid'>Please enter a valid name</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control value={form_Data.lastname} onChange={chngFn} required name="lastname" type="lastname" placeholder="Last Name" isInvalid={validated && !/^[a-zA-Z0-9]+$/.test(form_Data.user)} />
                      <Form.Control.Feedback type='invalid'>Please enter a valid lastname</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control id="email" value={form_Data.email} onChange={chngFn} required name="email" type="email" placeholder="name@example.com" isInvalid={
                        (validated &&
                          !/^\S+@\S+\.\S+$/.test(form_Data.email))
                      } />
                      <Form.Control.Feedback type="invalid" id="feedback_email">
                        Please enter a valid email address.
                      </Form.Control.Feedback>      </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Password</Form.Label>
                      <Form.Control minLength={6} value={form_Data.password} onChange={chngFn} id="password" required name="password" type="password" placeholder="Password" isInvalid={
                        validated && form_Data.password.length < 6
                      } />
                      <Form.Control.Feedback type="invalid" >
                        Password must be at least 6 characters long.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control 
                        type="password"
                        name="confirmPass"
                        placeholder='Confirm Password'
                        value={form_Data.confirmPass}
                        onChange={chngFn}
                        minLength={6}
                        required
                        pattern={form_Data.password}
                        isInvalid={
                          validated &&
                          form_Data.confirmPass !== form_Data.password
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords do not match.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Check type="checkbox" label="Are you a nutritionist? " onClick={ciao}/>
                      </Form.Group>
                    </Col>
                    {nutritionist && <Col>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Insert your certificate</Form.Label>
                        <Form.Control type="file" />
                      </Form.Group>
                      <SearchCountry />
                    </Col>}
                    <center>
                      <Button type="submit" id="submit" >Registration</Button>
                    </center>
                    </Form>
                 </div> </Tab.Pane>
          </Tab.Content>
         
      
       
      </Card.Body>
      
    </Card>
    </Tab.Container>
    </center>
    </>
  )
}

export default Login
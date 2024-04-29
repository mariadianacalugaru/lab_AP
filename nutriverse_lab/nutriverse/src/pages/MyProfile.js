import React, { useState,useEffect }from 'react'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import './css/MyProfile.css';
import axios from 'axios';
import { TabPane } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';


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
          Successful update
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Profile updated successfully.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const MyProfile = () => {
  const [modalShow, setModalShow] = useState(false);
  const [info, setInfo] = useState(false)
  const[firstname,setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const[is_nutritionist,setNutritionist] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [patients, setPatients] = useState([]);
  const [image, setImage] = useState("");
  const [able, setAble] = useState(false);

  const [validated, setValidated] = useState(false);
  const [form_Data, set_Form_Data] = useState({
    password: "",
    confirmPass: "",
    image: "",
    country: "",
    city: "",
    address: "",
  });

  const history = useNavigate();

  const chngFn = (event) => {
    const { name, value } = event.target;
    set_Form_Data({
      ...form_Data,
      [name]: value,
    });
    
    if ((form_Data.password != "" && form_Data.confirmPass != "") || document.getElementById("fileToUpload").files[0] !=""){
        setAble(true);
    }
    else{
      setAble(false);
    }
  };

  

  function convertToBase64(e){
      console.log(e);
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
          setImage(reader.result);
          if (reader.result != ""){
              setAble(true);
          }
      };
      reader.onerror = error => {
          console.log(error);
      }
  }


  const close = () => {
    setModalShow(false);
    history(0)
  }

  async function update(event){
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    else{
      var formdata = new FormData()
      formdata.append('email',email);
      formdata.append('image',JSON.stringify({base64:image}));
      formdata.append('password', form_Data.password)
    
      const configuration = {
          method: "post",
            crossDomain: true,
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
        }
        try {
          await axios.post("http://localhost:4000/update_user",formdata, configuration)
            .then((res) => {
              console.log(res.data)
              if (res.data === "user updated"){
                  setModalShow(true);
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

  useEffect(() => {
    async function get_patients() {
      const configuration = {
        method: "get",
        url: "http://localhost:4000/search_nutritionists",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:4000",
        },
        withCredentials: true,
      };
      try {
        await axios(configuration)
          .then((res) => res.data)
          .then((json) => {
            setInfo(true);
            const results = json.filter((user) => {
              return user && !user.is_nutritionist;
            });
            setPatients(results);
          })
          .catch((event) => {
            console.log(event);
          });
      } catch (event) {
        console.log(event);
      }
    }
    if (!info) {
      get_patients();
    }
  }, []);


  useEffect(() => {
    // Define your async function
    async function get_info() {
      const configuration = {
        method: "post",
        url: "http://localhost:4000/session_info",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:4000",
        },
        withCredentials:true,
        
       
      };
      try {
        await axios(configuration)
          .then(res => {
            console.log(res)
            if (res.data == "No account") {
              return "";
            }
            else {
              setInfo(true);
              setFirstname(res.data.user.firstname + " "+ res.data.user.lastname);
              setEmail(res.data.user.email);
              setNutritionist(res.data.user.is_nutritionist);
              setAvatar(JSON.parse(res.data.user.image).base64);
            }
          })
          .catch(event => {
            console.log(event);
          })
  
      }
      catch (event) {
        console.log(event);
  
      }
    }
    // Call the async function
    get_info();
  },[]);

 
  return (
    <Tab.Container  id="list-group-tabs-example" defaultActiveKey="#link1">
      <Row>
      
        <Col sm={2}>
        <Card className='cont1'>
          <ListGroup>
            <h1>{}</h1>
            <center><div className='label2'>{firstname}</div><Image src={avatar} className='image' ></Image>
            </center>
            <ListGroup.Item className='listgroup' action href="#editprofile">
              Edit Profile
            </ListGroup.Item>
           
            {!is_nutritionist && <ListGroup.Item className='listgroup' action href="#myfoodplan">
              MyFoodPlan
            </ListGroup.Item>}
            {is_nutritionist && <ListGroup.Item className='listgroup' action href="#myfoodplan">
              MyPatients
            </ListGroup.Item>}
          </ListGroup>
          </Card>
        </Col>
        
        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane className='pane' eventKey="#editprofile"><Card>
              <Card.Header as="h5">Edit Profile</Card.Header>
              <Card.Body>
                
                
      <Form noValidate onSubmit={update} >
      <Row className="mb-3">
      <Col sm={4}>
        <center>
        <div style={{witdh: "auto"}}>
        <label for="fileToUpload" className="photo"> 
            {image == "" || image == null ? <img width={170} src={avatar} ></img>: <img width={150}  src={image} />}
            <span>Change Image</span>
        </label>
      
        <input id="fileToUpload"
               accept="image/*"
               type="file"
               onChange={convertToBase64}
        />
        </div>

        </center>
        </Col >
        <Col sm={8}>
        
        <Form.Group   controlId="formGridPassword">
          <Form.Label>Name and surname</Form.Label>
          <Form.Control className='control' type="surname" value={firstname} disabled />
        </Form.Group>
        
        <Row className="mb-3-special">
          <Col>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control className='control' type="email" value={email} disabled />
        </Form.Group>
        </Col>
        
        </Row>

        <Row className="mb-3-special">
          <Col>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Change Password</Form.Label>
          <Form.Control className='control' placeholder="Enter password" minLength={6} value={form_Data.password} onChange={chngFn} id="password" name="password" type="password" 
          isInvalid={validated && form_Data.password != "" && form_Data.password.length < 6}
          isValid={validated && (form_Data.password.length >= 6 || form_Data.password.length == 0)}/>
          <Form.Control.Feedback type="invalid" >
                        Password must be at least 6 characters long.
          </Form.Control.Feedback>
        </Form.Group>
        

        </Col>
        <Col>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm new password</Form.Label>
          <Form.Control className='control' type="password" name="confirmPass" placeholder="Confirm new password" value={form_Data.confirmPass} onChange={chngFn} minLength={6} pattern={form_Data.password} isInvalid={(validated && form_Data.confirmPass !== form_Data.password)}
          isValid={ (validated && form_Data.confirmPass === form_Data.password) }/>
          <Form.Control.Feedback type="invalid">
                        Passwords do not match.
          </Form.Control.Feedback>
        </Form.Group>
        
        </Col>
        </Row>
        
        </Col>
        </Row>
        {is_nutritionist && <Row className="mb-3-special">
          <Col>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Change Address</Form.Label>
          <Form.Control className='control' type="email" placeholder="New address" />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group   controlId="formGridPassword">
          <Form.Label>Change City</Form.Label>
          <Form.Control className='control' type="password" placeholder="New city" />
        </Form.Group>
        
        </Col>
        </Row>}
      <center>
      <Button variant="primary"  className='mybutton' type="submit" id="submit" disabled={!able}>
        Save
      </Button>
      </center>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => close()}
      />
      
    </Form>
                
                
              </Card.Body>
            </Card>
            </Tab.Pane>

            <Tab.Pane className='pane' eventKey="#myfoodplan">
            <Card>
            {!is_nutritionist && <Card.Header as="h5">MyFoodPlan</Card.Header>}
            {is_nutritionist && <Card.Header as="h5">MyPatients</Card.Header>}
            
            {is_nutritionist && <Card.Body>
              <div>
              
            
           <Table responsive bordered variant="dark">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>FoodPlan</th>
          <th>Next Appointments</th>
               
        </tr>
            </thead>
            <tbody>
            {patients.map((item) => (
              <tr>
                <td>{item.firstname}</td>
                  <td>{item.lastname}</td>
                  <td>{item.email}</td>
                <td><a action href="/MyFoodPlan">
                    FoodPlan
                  </a></td>
                <td></td>
                
              
                </tr>
            ))}
              </tbody>
    </Table>
          
              </div>
                
                
                
                
              </Card.Body>}
              {!is_nutritionist && <Card.Body>
                
                
                
                
                
                </Card.Body>}
            </Card>
            </Tab.Pane >
            
            <TabPane className='pane' eventKey="#foodplan">
            <Card>
            {!is_nutritionist && <Card.Header as="h5">MyFoodPlan</Card.Header>}
            {is_nutritionist && <Card.Header as="h5">FoodPlan</Card.Header>}
            
            {is_nutritionist && <Card.Body>
   
              </Card.Body>}
              {!is_nutritionist && <Card.Body>

                </Card.Body>}
            </Card>
            </TabPane>

            
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

export default MyProfile
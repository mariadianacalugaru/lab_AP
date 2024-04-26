import React, { useState,useEffect }from 'react'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Profile_image from '../assets/background.jpg'
import Tab from 'react-bootstrap/Tab';
import './css/MyProfile.css';
import axios from 'axios';
import { TabPane } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from "react-router-dom"

const MyProfile = () => {
  const [info, setInfo] = useState(false)
  const[firstname,setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const[is_nutritionist,setNutritionist] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [patients, setPatients] = useState([]);
  const [image, setImage] = useState("");

  function convertToBase64(e){
      console.log(e);
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
          setImage(reader.result);
      };
      reader.onerror = error => {
          console.log(error);
      }
  }

  const update = async () =>{
    var formdata = new FormData()
    formdata.append('email',email);
    formdata.append('image',JSON.stringify({base64:image}));
    const configuration = {
        method: "post",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
             "Accept": "application/json",
             "Access-Control-Allow-Origin": "http://localhost:4000",
          },
          withCredentials: true,
          responseType:"blob",
      }
      try {
        await axios.post("http://localhost:4000/update_user",formdata, configuration)
          .then(res => {
            console.log(res);
            window.location.reload();
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
            <center><div className='label2'>{firstname}</div><Image src={avatar} className='image' roundedCircle></Image>
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
                
                
      <Form onSubmit={() => update()} >
      <Row className="mb-3">
      <Col sm={4}>
        <center>
        <div style={{witdh: "auto"}}>
            {image == "" || image == null ? <img width={150} src={avatar}></img>: <img width={150}  src={image}/>}
            <input accept="image/*"
                   type="file"
                   onChange={convertToBase64}
            />
            
            
        </div>

        </center>
        </Col >
        <Col sm={8}>
        
        <Form.Group   controlId="formGridPassword">
          <Form.Label>Name and surname</Form.Label>
          <Form.Control className='control' type="surname" placeholder={firstname} disabled/>
        </Form.Group>
        
        
        
       

        <Row className="mb-3-special">
          <Col>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Change Password</Form.Label>
          <Form.Control className='control' type="email" placeholder="Enter password" />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group   controlId="formGridPassword">
          <Form.Label>Confirm new password</Form.Label>
          <Form.Control className='control' type="password" placeholder="Confirm new password" />
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
      <Button variant="primary"  className='mybutton' onClick={() => update()}>
        Save
      </Button>
      </center>
      
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
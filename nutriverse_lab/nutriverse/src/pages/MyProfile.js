import React, { useState,useEffect }from 'react'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Profile_image from '../assets/background.jpg'
import Tab from 'react-bootstrap/Tab';
import './css/MyProfile.css';
import axios from 'axios';

const MyProfile = ({sid,setSid}) => {
  const [info, setInfo] = useState(false)
  const[firstname,setFirstname] = useState("")
  const[lastname,setLastname] = useState("")
 


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
            if (res.data == "No account") {
              return "";
            }
            else {
              setInfo(true);
              setFirstname(res.data);
              setLastname(res.data);
              setSid(res.data);
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
  },);

  return (
    <Tab.Container  id="list-group-tabs-example" defaultActiveKey="#link1">
      <Row>
      
        <Col sm={2}>
        <Card className='cont1'>
          <ListGroup>
            <center><div className='label2'>{firstname}</div><Image src={Profile_image} className='image' roundedCircle></Image>
            </center>
            <ListGroup.Item className='listgroup' action href="#editprofile">
              Edit Profile
            </ListGroup.Item>
            <ListGroup.Item className='listgroup' action href="#myfoodplan">
              MyFoodPlan
            </ListGroup.Item>
          </ListGroup>
          </Card>
        </Col>
        
        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane className='pane' eventKey="#editprofile"><Card>
              <Card.Header as="h5">Edit Profile</Card.Header>
              <Card.Body>
                
                
                <Form>
      <Row className="mb-3">
      <Col sm={4}>
        <center>
        <form  action="upload.php" method="post" enctype="multipart/form-data">
        <label for="fileToUpload">
        <div class="profile-pic" style={{ backgroundImage: {Profile_image} }}>
        <span>Change Image</span>
        </div>
        </label>
        <input type="File" name="fileToUpload" id="fileToUpload"></input>
        </form>
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
          <Form.Label>Change Email</Form.Label>
          <Form.Control className='control' type="email" placeholder="Enter email" />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group   controlId="formGridPassword">
          <Form.Label>Confirm new email</Form.Label>
          <Form.Control className='control' type="password" placeholder="Password" />
        </Form.Group>
        
        </Col>
        </Row>

        <Row className="mb-3-special">
          <Col>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Change Password</Form.Label>
          <Form.Control className='control' type="email" placeholder="Enter email" />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group   controlId="formGridPassword">
          <Form.Label>Confirm new password</Form.Label>
          <Form.Control className='control' type="password" placeholder="Password" />
        </Form.Group>
        
        </Col>
        </Row>
        
        </Col>
        </Row>
      <center>
      <Button variant="primary" type="submit">
        Save
      </Button>
      </center>
    </Form>
                
                
              </Card.Body>
            </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="#myfoodplan">Tab pane content 2</Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

export default MyProfile
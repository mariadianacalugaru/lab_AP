import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Profile_image from '../assets/logo.jpg'
import Tab from 'react-bootstrap/Tab';
import './css/MyProfile.css'

const MyProfile = () => {
  return (
    <Tab.Container  id="list-group-tabs-example" defaultActiveKey="#link1">
      <Row>
      
        <Col sm={2}>
        <Card className='cont1'>
          <ListGroup>
            <center><div className='label2'>Nome Cognome</div><Image src={Profile_image} className='image' roundedCircle></Image>
            </center>
            <ListGroup.Item className='listgroup' action href="#link1">
              Edit Profile
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
              MyFoodPlan
            </ListGroup.Item>
          </ListGroup>
          </Card>
        </Col>
        
        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="#link1">Tab pane content 1</Tab.Pane>
            <Tab.Pane eventKey="#link2">Tab pane content 2</Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

export default MyProfile
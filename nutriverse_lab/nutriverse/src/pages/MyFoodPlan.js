
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
import Nav from 'react-bootstrap/Nav';
import './css/MyProfile.css';
import './css/MyFoodPlan.css';
import axios from 'axios';
import { TabPane } from 'react-bootstrap';

const MyFoodPlan = () => {
  const [info, setInfo] = useState(false)
  const[firstname,setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const[is_nutritionist,setNutritionist] = useState(false)
 
  
  const [patients, setPatients] = useState([]);

  
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
              setNutritionist(res.data.user.is_nutritionist)

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
    <Tab.Container className="container_form" id="left-tabs-example" defaultActiveKey="mon">
    <Card className='cont1'>
    <Card.Header as="h5">FoodPlan</Card.Header>

              Nome e Cognome del Paziente
              <Card.Body>
              <Nav variant="tabs" defaultActiveKey="mon" fill>
              <Nav.Item>
              <Nav.Link eventKey="mon" className='title'>Monday</Nav.Link>
              </Nav.Item>
              <Nav.Item>
              <Nav.Link eventKey="tue" className='title'>Tuesday</Nav.Link>
              </Nav.Item>
              <Nav.Item>
              <Nav.Link eventKey="wed" className='title'>Wednesday</Nav.Link>
              </Nav.Item>
              <Nav.Item>
              <Nav.Link eventKey="thu" className='title'>Thursday</Nav.Link>
              </Nav.Item>
              <Nav.Item>
              <Nav.Link eventKey="fri" className='title'>Friday</Nav.Link>
              </Nav.Item>
              <Nav.Item>
              <Nav.Link eventKey="sat" className='title'>Saturday</Nav.Link>
              </Nav.Item>
              <Nav.Item>
              <Nav.Link eventKey="sun" className='title'>Sunday</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="mon">
                <Table responsive striped bordered hover className="table1">
                    <thead className="head">
                        <tr>
                            <th style={{backgroundColor:'deepskyblue'}}>Breakfast</th>
                            <th style={{backgroundColor:'dodgerblue'}}>Snack1</th>
                            <th style={{backgroundColor:'goldenrod'}}>Lunch</th>
                            <th style={{backgroundColor:'chocolate'}}>Snack2</th>
                            <th style={{backgroundColor:'firebrick'}}>Dinner</th>

                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>


                            </tr>
                        
                    </tbody>
                </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="tue">
                </Tab.Pane>
                <Tab.Pane eventKey="wed">
                </Tab.Pane>
                <Tab.Pane eventKey="thu">
                </Tab.Pane>
                <Tab.Pane eventKey="fri">
                </Tab.Pane>
                <Tab.Pane eventKey="sat">
                </Tab.Pane>
                <Tab.Pane eventKey="sun">
                </Tab.Pane>
            </Tab.Content>
               
                
              </Card.Body>
            </Card>
            </Tab.Container>
  )
}

export default MyFoodPlan
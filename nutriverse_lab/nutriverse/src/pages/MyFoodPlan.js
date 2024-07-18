
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
import './css/Foodplan.css';
import axios from 'axios';
import { TabPane } from 'react-bootstrap';
import NoFoodplan from "../assets/no_foodplan.png";
import { Link } from 'react-router-dom';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBCardLink
} from "mdb-react-ui-kit";


const MyFoodPlan = () => {
  const [info, setInfo] = useState(false)
  const[firstname,setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const[is_nutritionist, setIsNutritionist] = useState(false)

  const [day, setDay] = useState("Monday");
  const [meal, setMeal] = useState("");
  const [nutritionist, setNutritionist] = useState("")
  const [elements, setElements] = useState([]);

  const [existsPlan, setExistsPlan] = useState(false);



  useEffect(() => {
    // Define your async function
    async function get_info() {
      const configuration = {
        method: "get",
        url: "https://localhost/api/get_foodplan",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://localhost",
        },
        withCredentials:true,
        
       
      };
      try {
        await axios(configuration)
          .then(res => {
            console.log(res)
            if (res.data == "no user authenticated") {
              return "";
            }
            else if(res.data == "no foodplan yer"){
              setExistsPlan(false);
              alert("no foodplan");
            }
            else {
              setInfo(true);
              setFirstname(res.data.user.firstname + " "+ res.data.user.lastname);
              setEmail(res.data.user.email);
              setIsNutritionist(res.data.user.is_nutritionist)
              setNutritionist(res.data.foodplan.nutritionist)
              setElements(res.data.foodplan.foodplan)
              setExistsPlan(true);
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
  }, []);


  async function get_recipes(){
      const wanted_elem = elements.filter(element => element.day == "Monday" && element.meal == "Breakfast")
      const wanted_fields = wanted_elem.map(elem => ({ product: elem.product, quantity: elem.quantity }));

      const requestData = {
        "ingr": ["100gr rice", "150 gr chicken"] 
      };
      const configuration = {
        method: "post",
        url: "https://api.edamam.com/api/nutrition-details",

        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          
        },
        params: {
          app_id: '9003ffd0',
          app_key: '9e8cff0f3c7485b39c0fdab1f447a5ac'
        },
        data: requestData
      };

      try {
        await axios(configuration)
          .then(res => {
            console.log(res.data)})
          .catch(event => {
            alert("wrong details")
            console.error(event);
          })

      }
      catch (event) {
        console.log(event);

      }
  }



  return (
    <>
    <div className="home-background">
      {existsPlan && <>
        <Tab.Container className="container_form" id="left-tabs-example" defaultActiveKey="Monday">
          <Card className="cont1">
            <Card.Header as="h5">Foodplan</Card.Header>
            <Card.Body>
              <Nav className='tabs_days' variant="tabs" defaultActiveKey="Monday" fill>
                {["Monday", "Tuesday ", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day, idx) => (
                    <Nav.Item>
                      <Nav.Link eventKey={day} className="title" onClick={() => setDay(day)}>
                        {day}
                      </Nav.Link>
                    </Nav.Item>
                  )
                )}
              </Nav>

              <Tab.Content>
                <div className="multiple_cards">
                  {["Breakfast", "Snack 1 ", "Lunch", "Snack 2", "Dinner"].map(
                    (meal, idx) => (

                      <MDBCard className="meal_card" >
                        <div className="foods">
                          <MDBCardTitle className="meal">{meal}</MDBCardTitle>
                          <hr></hr>

                          <ListGroup>
                            {elements.map((item, index) => {
                              return ( item.day === day && item.meal === meal &&
                                <div className="ingredient">
                                  <ListGroup.Item variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className="ingredient_name">{item.product}</div>
                                    <Form.Control className="quantity" value={item.quantity} disabled/>
                                  </ListGroup.Item>
                                </div>
                              );
                            })}
                          </ListGroup>
                        </div>
                      </MDBCard>
                    )
                  )}
                </div>
              </Tab.Content>
              <Link to="/Search_recipes">
                <Button className="get_recipes">Search for recipes suggestions</Button>
              </Link>
              
            </Card.Body>
            
          </Card> 
        </Tab.Container>
        </>}
     
     

      {!existsPlan && 
       <div className="no_plan">
          <center>
            <Image src={NoFoodplan} className='not_found' ></Image>
            <h3>You have not a foodplan yet ...</h3>
          </center>
       </div>
      }
    </div>
    </>
  );
}

export default MyFoodPlan
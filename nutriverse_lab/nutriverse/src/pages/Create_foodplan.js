import React, {useEffect, useState } from 'react'
import axios from 'axios'
import SearchBarComponentFood from '../component/search_food/SearchBarComponentFood'
import './css/Create_foodplan.css';
import "./css/Home.css";
import "./css/MyFoodPlan.css";
import "bootstrap/dist/css/bootstrap.css"; 
import Container from "react-bootstrap/Container"; 
import Row from "react-bootstrap/Row"; 
import Col from "react-bootstrap/Col"; 
import Button from "react-bootstrap/Button"; 
import InputGroup from "react-bootstrap/InputGroup"; 
import FormControl from "react-bootstrap/FormControl"; 
import ListGroup from "react-bootstrap/ListGroup"; 
import Delete from "../assets/reject.png"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form';

import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.min.css';  

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBCardLink
} from "mdb-react-ui-kit";



const Create_foodplan = ({setSid, setIs_nutritionist}) => {
    const [info, setInfo] = useState(false)
    const[is_nutritionist,setNutritionist] = useState(false);
    const [ingredient, setIngredient] = useState("");
    const [selectedFood,setSelectedFood] = useState(false);
    const [listFoods, setListFoods] = useState([]);

    const [day, setDay] = useState("");
    const [elements, setElements] = useState([]);

    const [modalShow, setModalShow] = useState(false);
    const close = () => {
      setModalShow(false);
    }

    const show = (day, meal) => {
      setModalShow(true);
     
    }

    const addItem = (day, meal, product, quantity) => {
        setElements([...elements, {"day": day, "meal": meal, "product": product, "quantity": quantity}]);
    };

  
    const removeItem = (index) => {
        const newList = [...elements];
        newList.splice(index, 1);
        setElements(newList);
    };

    const updateItem = (event,index, day, meal,product) => {
      const value  = event.target.value;
      const newList = [...elements];
      newList[index] = {"day": day, "meal": meal, "product": product, "quantity": value};
      setElements(newList);
    };

    function MyVerticallyCenteredModal(props, day, meal) {
      return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="search-bar"><SearchBarComponentFood ingredient={ingredient} setIngredient={setIngredient} selectedFood={selectedFood} setSelectedFood={setSelectedFood} listFoods={listFoods} setListFoods={setListFoods} addItem={addItem}/></div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    

    useEffect(() => {
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
                  setNutritionist(res.data.user.is_nutritionist);
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
        get_info();
      },[]);
    




    return (
      <>
        <div className="home-background">
          <Tab.Container
            className="container_form"
            id="left-tabs-example"
            defaultActiveKey="mon"
          >
            <Card className="cont1">
              <Card.Header as="h5">FoodPlan</Card.Header>
              <Card.Body>
                <Nav variant="tabs" defaultActiveKey="mon" fill>
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
                      
                        <MDBCard className="nutritionist_card" >
                         
                          <div className="foods">
                            <MDBCardTitle className="meal">{meal}</MDBCardTitle>
                            <hr></hr>
                            
                              <ListGroup>
                                {elements.map((item, index) => {
                                  return (item.day === day && item.meal === meal &&
                                    <div className="ingredient" key={item}>
                                      <ListGroup.Item variant="light" style={{display: "flex", justifyContent: "space-between"}}>
                                        <div className="ingredient_name">{item.product}</div>
                                        <Form.Control className="quantity" onChange={(event) => updateItem(event, item.day, item.meal, item.product, index)}/>
                                        <span>
                                          <Link onClick={() => removeItem(index)}>
                                            <img src={Delete} id="delete_ingredient" className="Verify"alt="Nutriverse"></img>
                                          </Link>
                                        </span>
                                      </ListGroup.Item>
                                    </div>
                                  );
                                })}
                              </ListGroup>
                               
                              <Button onClick={() => show(day, meal)} >+</Button>
                           </div>
                           
      
                        </MDBCard>
                      
                      )
                    )}
                  </div>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
                                    
        </div>

        <MyVerticallyCenteredModal show={modalShow} onHide={() => close()}/>
        
        </>
    );
}

export default Create_foodplan
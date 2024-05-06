import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import SearchBarComponentFood from '../component/search_food/SearchBarComponentFood'
import './css/Foodplan.css';
import "./css/Home.css";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from '@mui/material/Stack';
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import Delete from "../assets/reject.png"
import { Link, useSearchParams} from "react-router-dom"
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




const Create_foodplan = ({ setSid, setIs_nutritionist }) => {
  const inputRef = useRef(0)
  const [info, setInfo] = useState(false)
  const [is_nutritionist, setNutritionist] = useState(false);
  const [ingredient, setIngredient] = useState("");
  const [selectedFood, setSelectedFood] = useState(false);
  const [listFoods, setListFoods] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  searchParams.get("name");
  
  

  const [day, setDay] = useState("Monday");
  const [meal, setMeal] = useState("");
  const [elements, setElements] = useState([]);
  const [quantity, setQuantity] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const close = () => {
    setQuantity("");
    setIngredient("");
    setSelectedFood(false);
    setModalShow(false);
  }

  async function save_foodplan() {
    var formdata = new FormData();
    var configuration =''
      
      configuration = {
          method:'post',
          url: "http://localhost:4000/save_foodplan",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:4000",
          },
          
          withCredentials: true,
          data: {patient: searchParams.get("patient"), foodplan:JSON.stringify(elements)}
      };
      
      formdata.append("elements",elements)
       

      

      try {
        await axios(configuration)
          .then(res => {
            console.log(res)
            if (res.data == "Food Plan inserted") {
              alert("ok");
              
             
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


  const deleteIngredient = () => {
    setQuantity("");
    setIngredient("");
    setSelectedFood(false);
  }

  const show = async (day, meal) => {
    setMeal(meal);
    setDay(day);
    setModalShow(true);
  }

  const addItem = (day, meal, product, quantity) => {
    setElements([...elements, { "day": day, "meal": meal, "product": product, "quantity": quantity }]);

    close();
  };


  const removeItem = (index) => {
    const newList = [...elements];
    newList.splice(index, 1);
    setElements(newList);
  };

  const updateItem = (event, index, day, meal, product) => {
    const value = event.target.value;
    const newList = [...elements];
    newList[index] = { "day": day, "meal": meal, "product": product, "quantity": value };
    setElements(newList);
  };


  function MyVerticallyCenteredModal(props) {
 
    return (
      <Modal
        animation={false}
        autoFocus={false}
        ref={inputRef}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.day}
            {props.meal}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedFood && <div className="search-bar"><SearchBarComponentFood ingredient={ingredient} setIngredient={setIngredient} selectedFood={selectedFood} setSelectedFood={setSelectedFood} listFoods={listFoods} setListFoods={setListFoods} addItem={addItem} day={props.day} meal={props.meal} /></div>}
          {selectedFood &&
            <div className="ingredient" >
              <ListGroup.Item variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="ingredient_name">{ingredient}</div>
                <Form.Control autoFocus={true} className="quantity" value={quantity} onChange={(event) => setQuantity(event.currentTarget.value)} />
                <span>
                  <Link onClick={deleteIngredient}>
                    <img src={Delete} id="delete_ingredient" className="Verify" alt="Nutriverse"></img>
                  </Link>
                </span>
              </ListGroup.Item>
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Stack direction="row" spacing={2}>
            <Button onClick={props.add} variant="success" disabled={!selectedFood}>
              Add
            </Button>
            <Button onClick={props.onHide} variant="danger">
              Close Window
            </Button>
          </Stack>
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
        withCredentials: true,


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
  }, []);





  return (
    <>
      <div className="home-background">
        <Tab.Container
          className="container_form"
          id="left-tabs-example"
          defaultActiveKey="Monday"
        >
          <Card className="cont1">
            <Card.Header as="h5">Foodplan {searchParams.get("name")} {searchParams.get("lastname")}</Card.Header>
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
                              return (item.day === day && item.meal === meal &&
                                <div className="ingredient" key={item}>
                                  <ListGroup.Item variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className="ingredient_name">{item.product}</div>
                                    <Form.Control className="quantity" value={item.quantity} disabled/>
                                    <span>
                                      <Link onClick={() => removeItem(index)}>
                                        <img src={Delete} id="delete_ingredient" className="Verify" alt="Nutriverse"></img>
                                      </Link>
                                    </span>
                                  </ListGroup.Item>
                                </div>
                              );
                            })}
                          </ListGroup>
                          <center>
                          <Button className="add_ingredient" onClick={() => show(day, meal)} >+</Button>
                          </center>
                        </div>


                      </MDBCard>

                    )
                  )}
                </div>
              </Tab.Content>
              <center>
          <Button className="save_button" onClick={() => save_foodplan()} >Save</Button>
          </center>
            </Card.Body>
          </Card>
         
        </Tab.Container>

      </div>

      <MyVerticallyCenteredModal day={day} meal={meal} show={modalShow} onHide={() => close()} add={() => addItem(day,meal,ingredient,quantity)}  />

    </>
  );
}

export default Create_foodplan
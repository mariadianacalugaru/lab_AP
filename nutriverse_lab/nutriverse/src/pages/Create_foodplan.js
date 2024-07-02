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
import Hide from "../assets/hide.png"
import { Link, useNavigate, useSearchParams} from "react-router-dom"
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

  const navigate = useNavigate()
  const [day, setDay] = useState("Monday");
  const [meal, setMeal] = useState("");
  const [elements, setElements] = useState([]);
  const [quantity, setQuantity] = useState("");
  
  var values = '';
  const [nutritional, setNutritional] = useState([]);

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
          url: "https://nutriverse/api/save_foodplan",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://nutriverse",
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
              navigate("/mypatients")
              
             
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
   // get_nutritional_values();
  }

  const removeItem = (index) => {
    const newList = [...elements];
    newList.splice(index, 1);
    setElements(newList);
    //get_nutritional_values();
  };

  const updateItem = (event, index, day, meal, product) => {
    const value = event.target.value;
    const newList = [...elements];
    newList[index] = { "day": day, "meal": meal, "product": product, "quantity": value };
    setElements(newList);
  };

  const show_nutritional_values = (day) => {
    const table = document.getElementById("nutritional_table")
    table.style.display = "block";
    get_nutritional_values()
  }

  const hide_nutritional_table = (day) =>{
    const table = document.getElementById("nutritional_table")
    table.style.display = "none";
  }


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
            {props.day} {props.meal}
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
            <Button onClick={props.add} variant="success" disabled={!selectedFood} >
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
        url: "https://nutriverse/api/session_info",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://nutriverse",
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


  async function get_nutritional_values(){
    const wanted_elem = elements.filter(element => element.day == "Monday" && element.meal == "Breakfast")
    const wanted_fields = wanted_elem.map(elem => ({ product: elem.product, quantity: elem.quantity }));
    const ingr = wanted_fields.map(elem => (elem.product.toString()+" "+elem.quantity.toString()));

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
      data: {"ingr": ingr}
    };

    try {
      await axios(configuration)
        .then(res => {
          const cal = parseInt(res.data.totalNutrients.ENERC_KCAL.quantity)+" "+res.data.totalNutrients.ENERC_KCAL.unit;
          const fats = parseInt(res.data.totalNutrients.FAT.quantity)+" "+res.data.totalNutrients.FAT.unit;
          const carbs = parseInt(res.data.totalNutrients.CHOCDF.quantity)+" "+res.data.totalNutrients.CHOCDF.unit;
          const chol = parseInt(res.data.totalNutrients.CHOLE.quantity)+" "+res.data.totalNutrients.CHOLE.unit;
          const prot = parseInt(res.data.totalNutrients.PROCNT.quantity)+" "+res.data.totalNutrients.PROCNT.unit;
          const sug = parseInt(res.data.totalNutrients.SUGAR.quantity)+" "+res.data.totalNutrients.SUGAR.unit;
          const fib = parseInt(res.data.totalNutrients.FIBTG.quantity)+" "+res.data.totalNutrients.FIBTG.unit;
          const ca = parseInt(res.data.totalNutrients.CA.quantity)+" "+res.data.totalNutrients.CA.unit;
          const mg = parseInt(res.data.totalNutrients.MG.quantity)+" "+res.data.totalNutrients.MG.unit;
          const po = parseInt(res.data.totalNutrients.K.quantity)+" "+res.data.totalNutrients.K.unit;
        
          setNutritional([cal, fats, carbs, chol, prot, sug, fib, ca, mg, po]);
        })
        .catch(event => {
          alert("wrong details")
          console.error(event);
          console.log("troppe richieste")
        })

    }
    catch (event) {
      console.log(event);

    }
}



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
                            {elements.map((item, index) => {/*get_nutritional_values();*/
                              return (item.day === day && item.meal === meal &&
                                <div className="ingredient">
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
                <div className="nutritional_card" id="nutritional_table">
                  <div className="upper_div">
                    <h3>{day}</h3>
                    <Link onClick={() => hide_nutritional_table()}>
                      <img src={Hide} id="hide_table" className="Verify" alt="Nutriverse"></img>
                    </Link>
                  </div>
                  <hr />
                  {['Calories','Fats','Carbohidrates','Cholesterol', 'Proteins','Sugars', 'Fibers', 'Calcium', 'Magnesium', 'Potassium'].map((item, index) => {
                      return ( 
                          <div className="nutritional_value">
                              <ListGroup.Item variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div >{item}</div>
                                    <Form.Control className="value" value={nutritional[index]} disabled/>
                              </ListGroup.Item>
                          </div>
                      );
                  })}
                </div>
                <Button className="save_button" onClick={() => show_nutritional_values(day)} >Nutritional values {day}</Button>
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
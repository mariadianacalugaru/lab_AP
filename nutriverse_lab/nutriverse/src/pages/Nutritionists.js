//import React from 'react'
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import SearchBarComponent from "../component/SearchBarComponent";
import "./css/Home.css";
import "./css/Nutritionists.css";
import NoAvatar from "../assets/no_avatar.png"
import Search_location from "../assets/search_location.png";
import Image from 'react-bootstrap/Image';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBCardLink
} from "mdb-react-ui-kit";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';


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
          Login required
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Login for booking an appointment
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Send_messageModal(props){
  return(
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Send a message to the nutritionist
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea placeholder="Write your message here..." className="message_text"></textarea>
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Send</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );

}

const Nutritionists = ({ setName, setEmail }) => {
  const [info, setInfo] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [nutrionist_dest, setNutritionist_dest] = useState('');
  const [nutritionists, setNutritionists] = useState([]);
  const [city, setCity] = useState("");
  const [listCities, setListCities] = useState([])
  const navigate = useNavigate()

  const handleBook = async (nutr) => {
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
        .then((res) => {
          if (res.data.authenticated) {
            navigate({
              pathname: '/booking',
              search: createSearchParams({ name: nutr.firstname + " " + nutr.lastname, email: nutr.email }).toString()
            });
          }
          else {
            setModalShow(true);
          }
        })
        .catch((event) => {
          console.log(event);
        });
    } catch (event) {
      console.log(event);
    }
      
  }

  const close = () => {
    setModalShow(false);
    navigate("/login")
  }

  const closeMessage = () => {
    setMessageModalShow(false);
  }
  
  async function get_nutritionists(city) {
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
              return user && user.is_nutritionist && user.verified && user.city == city;
            });
            setNutritionists(results);
           
          })
          .catch((event) => {
            console.log(event);
          });
      } catch (event) {
        console.log(event);
      }
    }
  
  


  return (
    <>
      <div className="home-background">
        <div className="search-bar">
        <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => close()}
      />
      <Send_messageModal
        show={messageModalShow}
        onHide={() => closeMessage()}
      />

        <div className="search_loc">
        <center>
          <h5 className="search_title">Search nutritionists by city ...</h5>
          <SearchBarComponent city={city} setCity={setCity} get_nutritionists={get_nutritionists} listCities={listCities} setListCities={setListCities}/>
          {city == '' && 
            <Image src={Search_location} className='location' ></Image>
          }
          </center>
       </div>
        </div>
        <div className="multiple_cards">
          {nutritionists.map((item) => (
            item.verified &&
            <MDBCard className="nutritionist_card">
              <div className="image_div"><MDBCardImage
                className="picture"
                src={(item.image == undefined || item.image == "")? NoAvatar : JSON.parse(item.image).base64}
                position="top"
                alt="..."
              /></div>
              <MDBCardBody className="card_text">
                <MDBCardTitle className="name">
                  {item.firstname} {item.lastname}
                </MDBCardTitle>
                <MDBCardText className="address">
                  {item.address}
                  <br></br>
                  {item.city}, {item.country}
                </MDBCardText>
                <Button onClick={(e) => handleBook(item)}>Book</Button>
                
                <Button className="sender" onClick={(e)=>{ setMessageModalShow(true); setNutritionist_dest(item._id); }}> Send Message </Button>
              </MDBCardBody>
            </MDBCard>
            
          ))}
        </div>
      </div>
    </>
  );
};

export default Nutritionists;

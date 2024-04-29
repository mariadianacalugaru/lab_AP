//import React from 'react'
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import SearchBarComponent from "../component/SearchBarComponent";
import "./css/Home.css";
import "./css/Nutritionists.css";

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

const Nutritionists = ({ setName, setEmail }) => {
  const [info, setInfo] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [nutritionists, setNutritionists] = useState([]);

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
  useEffect(() => {
    async function get_nutritionists() {
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
              return user && user.is_nutritionist && user.verified;
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
    if (!info) {
      get_nutritionists();
    }
  }, []);


  return (
    <>
      <div className="home-background">
        <div className="search-bar">
        <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => close()}
      />
          <SearchBarComponent />
        </div>
        <div className="multiple_cards">
          {nutritionists.map((item) => (item.verified &&
            <MDBCard className="nutritionist_card">
              <MDBCardImage
                className="picture"
                src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
                position="top"
                alt="..."
              />
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
              </MDBCardBody>
            </MDBCard>
            
          ))}
        </div>
      </div>
    </>
  );
};

export default Nutritionists;

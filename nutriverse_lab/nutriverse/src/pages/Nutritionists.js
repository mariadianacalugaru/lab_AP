//import React from 'react'
import React, { useState, useEffect } from "react";
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
import { Link, useNavigate ,createSearchParams} from "react-router-dom";

const Nutritionists = ({ setName, setEmail }) => {
  const [info, setInfo] = useState(false);
  const [nutritionists, setNutritionists] = useState([]);

  const navigate = useNavigate()

  const handleBook = (nutr) => {
    navigate({ 
      pathname: '/booking', 
      search: createSearchParams({ name: nutr.firstname + " " + nutr.lastname,email: nutr.email}).toString() 
    });  }

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
                  <button onClick={(e)=>handleBook(item)}>Book</button>
                  
                <MDBCardLink href='#' >Contact</MDBCardLink>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      </div>
    </>
  );
};

export default Nutritionists;

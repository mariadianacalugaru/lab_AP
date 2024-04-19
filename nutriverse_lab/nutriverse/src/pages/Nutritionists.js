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
} from "mdb-react-ui-kit";

const Nutritionists = () => {
  const [info, setInfo] = useState(false);
  const [nutritionists, setNutritionists] = useState([]);

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
              return user && user.is_nutritionist;
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

  nutritionists.map((item) => console.log(item.firstname));
  return (
    <>
      <div className="home-background">
        <div className="search-bar">
          <SearchBarComponent />
        </div>
        <div className="multiple_cards">
          {nutritionists.map((item) => (
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
                <MDBBtn href="#">Contact</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      </div>
    </>
  );
};

export default Nutritionists;

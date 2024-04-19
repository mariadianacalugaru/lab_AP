import React, { useState, useEffect } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import Verify from "../assets/verify.png"
import { CiLogout } from "react-icons/ci";


import axios from "axios";
import SearchBarComponent from "../component/SearchBarComponent";
import "./css/Home.css";
import "./css/Nutritionists.css";
import Table from 'react-bootstrap/Table';
import { MdVerified } from "react-icons/md";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";

const Admin = () => {
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
              return user && user.is_nutritionist && !user.verified;
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

  async function approve(email) {
    const configurations = {
      headers: {
        "Content-Type": "appplication/json",
        "Access-Control-Allow-Origin": "http://localhost:4000",
      },
      withCredentials: true,
      "email": email
    };
    try {
      axios
        .post("http://localhost:4000/approve_nutritionist", configurations)
        .then((response) => {
          if (response.data == "verified") {
            window.location.reload();
          };
        })
    } catch (event) {
      console.log(event);
    }
  }

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
                <button onClick={() => approve(item.email)}>Approve</button>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
        
            <center>
           <Table bordered variant="dark">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>email</th>
          <th>Country of the study</th>
          <th>City of the study</th>
                <th>Address of the study</th>
                <th>Certificate</th>
                <th>Verify</th>
        </tr>
            </thead>
            <tbody>
            {nutritionists.map((item) => (
                <tr>
                <td>{item.firstname}</td>
                  <td>{item.lastname}</td>
                  <td>{item.email}</td>
                <td>{item.country}</td>
                <td>{item.city}</td>
                <td>{item.address}</td>
                <td><a href="/">{item.filename}</a></td>
                <td>
                <Link onClick={() => approve(item.email)} >
                <img src={Verify} className="Logo" alt="Nutriverse" ></img>
                  </Link>
                </td>
                </tr>
            ))}
              </tbody>
    </Table>
          </center>
      </div>
    </>
  );
};

export default Admin;

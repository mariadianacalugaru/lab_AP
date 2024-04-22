import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import Verify from "../assets/verify.png"
import Reject from "../assets/reject.png"
import Button from '@mui/material/Button';


import axios from "axios";
import "./css/Home.css";
import "./css/Nutritionists.css";
import Table from 'react-bootstrap/Table';
import { FaDownload } from "react-icons/fa";


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

  async function reject(email) {
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
        .post("http://localhost:4000/reject_nutritionist", configurations)
        .then((response) => {
          if (response.data == "rejected") {
            window.location.reload();
          };
        })
    } catch (event) {
      console.log(event);
    }
  }

  const onButtonClick = async (filename,firstname,lastname) => {
    const configurations = {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "http://localhost:4000",
        'Accept': 'blob'
      },
      withCredentials: true,
      responseType:"blob"
    }
    var formdata = new FormData()
    formdata.append("filename",filename)
    try {
      await axios.post('http://localhost:4000/get_certificate', formdata, configurations)
      .then((response) => {
         
            // Creating new object of PDF file
            const fileURL =
                window.URL.createObjectURL(response.data);
                 
            // Setting various property values
            let alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = firstname+"_"+lastname+"_certificate.pdf";
            alink.click();
        });
    }
    catch (event) {
      console.log(event);
    }
};
  return (
    <>
      <div className="home-background">
        <div className="container_table">

            <center>
           <Table responsive bordered variant="dark">
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
                <th>Reject</th>
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
                <td>
                  <Button onClick={() => onButtonClick(item.filename,item.firstname,item.lastname)} variant="contained" startIcon={<FaDownload />}>Certificate</Button>
                </td>
                <td>
                  <center>

                <Link onClick={() => approve(item.email)} >
                <img src={Verify} className="Verify" alt="Nutriverse" ></img>
                  </Link>
                  </center>
                </td>
                <td>
                  <center>
                <Link onClick={() => reject(item.email)} >
                <img src={Reject} className="Verify" alt="Nutriverse" ></img>

                  </Link>
                  </center>
                </td>
                </tr>
            ))}
              </tbody>
    </Table>
          </center>
      </div>
    </div>
    </>
  );
};

export default Admin;

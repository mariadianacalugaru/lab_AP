
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
import './css/MyProfile.css';
import axios from 'axios';
import { TabPane } from 'react-bootstrap';

const MyFoodPlan = () => {
  const [info, setInfo] = useState(false)
  const[firstname,setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const[is_nutritionist,setNutritionist] = useState(false)
 
  
  const [patients, setPatients] = useState([]);

  
  useEffect(() => {
    async function get_patients() {
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
              return user && !user.is_nutritionist;
            });
            setPatients(results);
          })
          .catch((event) => {
            console.log(event);
          });
      } catch (event) {
        console.log(event);
      }
    }
    if (!info) {
      get_patients();
    }
  }, []);


  useEffect(() => {
    // Define your async function
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
              setFirstname(res.data.user.firstname + " "+ res.data.user.lastname);
              setEmail(res.data.user.email);
              setNutritionist(res.data.user.is_nutritionist)

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
  },);

  return (
    <Card className='cont1'>
    <Card.Header as="h5">FoodPlan</Card.Header>
              <Card.Body>
                
                
               
                
              </Card.Body>
            </Card>
  )
}

export default MyFoodPlan
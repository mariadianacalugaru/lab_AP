
import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';

import Table from 'react-bootstrap/Table';

import './css/MyProfile.css';
import axios from 'axios';
import { useNavigate, createSearchParams } from 'react-router-dom';


const MyPatients = ({is_nut}) => {
    const [info, setInfo] = useState(false)
    const [firstname, setFirstname] = useState("")
    const [email, setEmail] = useState("")
    const [is_nutritionist, setNutritionist] = useState(false)


    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function get_patients() {
            const configuration = {
                method: "post",
                url: "http://localhost:4000/get_patients",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:4000",
                },
                withCredentials: true,
            };
            try {
                await axios(configuration)
                    .then((res) => {
                        console.log(res.data[0].list_patients)
                        setPatients(res.data[0].list_patients)
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

 
    const create_foodplan = (name,lastname,patient) => {
        navigate({
            pathname: "/Create_foodplan",
            search: createSearchParams({
                name: name, 
                lastname: lastname,
                patient: patient
            }).toString()
        });}
        
    

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
                withCredentials: true,


            };
            try {
                await axios(configuration)
                    .then(res => {
                        if (res.data == "No account") {
                            return "";
                        }
                        else {
                            setInfo(true);
                            setFirstname(res.data.user.firstname + " " + res.data.user.lastname);
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
            <Card.Header as="h5">My patients</Card.Header>
            <Card.Body>

                <Table responsive bordered variant="dark">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>FoodPlan</th>
                            <th>Next Appointments</th>

                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((item) => (
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.lastname}</td>
                                <td>{item.patient}</td>
                                <td><button onClick={ () =>create_foodplan(item.name,item.lastname,item.patient)}>Food Plan</button>
                                    
                                </td>
                                <td></td>


                            </tr>
                        ))}
                    </tbody>
                </Table>


            </Card.Body>
        </Card>
    )
}

export default MyPatients
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios'
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../pages/css/See_progress.css"
import Button from '@mui/material/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const Progress = () => {

    const [info, setGetInfo] = useState(false);
    const [dates, setDates] = useState([])
    const [mynutr, setNutritionists] = useState([])
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const navigate = useNavigate()
    const [patient, setPatient] = useSearchParams()
    const [date_of_visit, setDate_of_visit] = useState([])
    const [weights, setWeights] = useState([])
    const [body_fat_list, setList_body_fat] = useState([])
    const [lean_mass_list, setListlean_mass] = useState([])

    useEffect(() => {
        const configuration = {
            method: "GET",
            url: "https://nginx_reverse_proxy/api/myappointments",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://nginx_reverse_proxy/api/",
            },
            withCredentials: true,
        };

        const get_appointments = () => {
            setGetInfo(true)
            try {
                axios(configuration)
                    .then((res) => {
                        if (res.data === "not logged") {
                            navigate("/")
                        }
                        else {
                            const results = res.data.map((date) => {
                                return new Date(date.date);
                            });
                            results.sort(function (a, b) {
                                return a - b;
                            });

                            var time = []
                            for (var i = 0; i < results.length; i++) {
                                var data = {
                                    year: results[i].getFullYear(),
                                    month: results[i].getMonth(),
                                    day: results[i].getDate()
                                }
                                time.push(data)
                            }
                            const nutritionists = res.data.map((item) => {
                                return item.nutritionist;
                            })
                            setDates(results)
                            setNutritionists(nutritionists)
                        }
                    })
                    .catch((event) => {
                        console.log(event);
                    });
            } catch (error) {
                console.log(error);
            }

        }
        if (!info) {
            get_appointments()
        }
        else {
            console.log(dates)
        }

    });

    function createData(date, weight, waist, hips, right_tight, left_tight, chest) {
        return { date, weight, waist, hips, right_tight, left_tight, chest };
    }

    const [rows, setRows] = useState([])

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "https://nginx_reverse_proxy/api/measurements",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://nginx_reverse_proxy/api/",
            },
            withCredentials: true,
        };

        async function get_measurements() {
            setGetInfo(true)
            try {
                axios(configuration)
                    .then((res) => {
                        if (res.data === "not logged") {
                            navigate("/")
                        }
                        else if (res.data === "no measurements") {
                            console.log("ciao")
                        }
                        else {
                            var result = res.data
                            var length = res.data.date.length
                            var list = []
                            var list_dates = []
                            var list_body_fat = []
                            var list_lean_mass = []
                            for (var i = 0; i < length; i++) {
                                var date = new Date(result.date[i])
                                list_dates.push(date)
                                var index = length;
                                for (var j = 0; j < list_dates.length; j++) {
                                    if (list_dates[j].getTime() > date.getTime()) {
                                        index = j
                                        break;
                                    }
                                }
                                console.log(index)
                                list.splice(index, 0, createData(
                                    date.getDate().toString() + "-" + month[date.getMonth()] + "-" + date.getFullYear().toString(),
                                    result.weight[i],
                                    result.waist[i],
                                    result.hips[i],
                                    result.right_tight[i],
                                    result.left_tight[i],
                                    result.chest[i]))
                                list_body_fat.splice(index, 0, result.body_fat[i])
                                list_lean_mass.splice(index, 0, result.lean_mass[i])

                            }
                            setRows(list)
                            list_dates.sort(function (a, b) {
                                return a - b;
                            });
                            setDate_of_visit(list_dates)
                            setWeights(result.weight)
                            setList_body_fat(list_body_fat)
                            setListlean_mass(list_lean_mass)
                        }
                    })
                    .catch((event) => {
                        console.log(event);
                    });
            } catch (error) {
                console.log(error);
            }

        }
        if (!info) {
            get_measurements()
        }
        else {
            console.log(date_of_visit)
        }

    });


    const add_row = async () => {
        var date = new Date(document.getElementById("date").value);
        var weight = document.getElementById("weight").value;
        var waist = document.getElementById("waist").value
        var hips = document.getElementById("hips").value
        var right_tight = document.getElementById("right_tight").value
        var left_tight = document.getElementById("left_tight").value
        var chest = document.getElementById("chest").value

        const configuration = {
            method: "post",
            url: "https://nginx_reverse_proxy/api/add_measurements",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://nginx_reverse_proxy/api/",
            },
            withCredentials: true,
            data: {
                patient: patient.get("patient"),
                date: date,
                weight: weight,
                waist: waist,
                hips: hips,
                right_tight: right_tight,
                left_tight: left_tight,
                chest: chest
            }
        };
        try {
            await axios(configuration)
                .then((res) => {
                    if (res.data == "not logged") {
                        navigate("/")
                    }
                    else {
                        window.location.reload()
                    }

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
            <center>
                <Card className="progress_card">
                    <Card.Header as="h5">My Progress {patient.get("name")} {patient.get("surname")}
                    </Card.Header>
                    <Card.Body>
                        <center>

                            <div className='charts'>
                            <Container>
                            <Row>
                                <Col>
                                <LineChart
                                    xAxis={[{ scaleType: 'time', data: date_of_visit, label: "date of visit", valueFormatter: (value) => value.getDate().toString() + "-" + month[value.getMonth()] + "-" + value.getFullYear().toString() }]}
                                    series={[
                                        {
                                            data: weights, label: "weight"
                                        },
                                    ]}
                                    width={500}
                                    height={300}
                                />
                                            </Col>
                                            <Col>

                                <LineChart
                                    xAxis={[{ scaleType: 'time', data: date_of_visit, label: "date of visit", valueFormatter: (value) => value.getDate().toString() + "-" + month[value.getMonth()] + "-" + value.getFullYear().toString() }]}
                                    series={[
                                        {
                                            data: body_fat_list, label: "body_fat", curve: "linear"
                                        },
                                        {
                                            data: lean_mass_list, label: "lean_mass", curve: "linear"
                                        },
                                    ]}
                                    width={500}
                                    height={300}
                                />
                                </Col>
                                </Row>
                                </Container>
                            </div>
                        </center>
                        <div className='table_progress_user'>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date of visit</TableCell>
                                            <TableCell align="right">Weight (Kg)</TableCell>
                                            <TableCell align="right">waist (cm)</TableCell>
                                            <TableCell align="right">hips (cm)</TableCell>
                                            <TableCell align="right">Right Tight (cm)</TableCell>
                                            <TableCell align="right">Left Tight (cm)</TableCell>
                                            <TableCell align="right">Chest (cm)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.date}
                                                </TableCell>
                                                <TableCell align="right">{row.weight}</TableCell>
                                                <TableCell align="right">{row.waist}</TableCell>
                                                <TableCell align="right">{row.hips}</TableCell>
                                                <TableCell align="right">{row.right_tight}</TableCell>
                                                <TableCell align="right">{row.left_tight}</TableCell>
                                                <TableCell align="right">{row.chest}</TableCell>
                                            </TableRow>
                                        ))}
                            

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Card.Body>
                </Card>

            </center>
        </div>
        </>

    )

}

export default Progress
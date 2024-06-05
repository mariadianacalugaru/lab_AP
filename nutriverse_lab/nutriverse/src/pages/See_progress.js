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
    const [disabled, setDisabled] = useState(true);
    const [weights, setWeights] = useState([])
    const [body_fat_list, setList_body_fat] = useState([])
    const [lean_mass_list, setListlean_mass] = useState([])


    const handleChange = () => {
        var date = new Date(document.getElementById("date").value);
        var weight = document.getElementById("weight").value;
        var body_fat = document.getElementById("body_fat").value;
        var lean_mass = document.getElementById("lean_mass").value;
        var Waist = document.getElementById("Waist").value
        var fianchi = document.getElementById("fianchi").value
        var right_tight = document.getElementById("right_tight").value
        var left_tight = document.getElementById("left_tight").value
        var chest = document.getElementById("chest").value
        if (document.getElementById("date").value == "invalid" || weight == "" || body_fat == "" || lean_mass == "" || Waist == "" || fianchi == "" || right_tight == "" || left_tight == "" || chest == "") {
            setDisabled(true);
        }
        else {
            setDisabled(false)
        }
    }

    useEffect(() => {
        const configuration = {
            method: "GET",
            url: "http://localhost:4000/myappointments?patient=" + patient.get("patient"),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
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

    function createData(date, weight, body_fat, lean_mass, Waist, fianchi, right_tight, left_tight, chest) {
        return { date, weight, body_fat, lean_mass, Waist, fianchi, right_tight, left_tight, chest };
    }

    const [rows, setRows] = useState([])

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:4000/measurements?patient=" + patient.get("patient"),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
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
                            var list_weights = []
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
                                list.splice(index, 0, createData(
                                    date.getDate().toString() + "-" + month[date.getMonth()] + "-" + date.getFullYear().toString(),
                                    result.weight[i],
                                    result.body_fat[i],
                                    result.lean_mass[i],
                                    result.Waist[i],
                                    result.fianchi[i],
                                    result.right_tight[i],
                                    result.left_tight[i],
                                    result.chest[i]))

                                list_weights.splice(index, 0, result.weight[i])
                                list_body_fat.splice(index, 0, result.body_fat[i])
                                list_lean_mass.splice(index, 0, result.lean_mass[i])

                            }
                            setRows(list)
                            list_dates.sort(function (a, b) {
                                return a - b;
                            });
                            setDate_of_visit(list_dates)
                            setWeights(list_weights)
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
        var body_fat = document.getElementById("body_fat").value;
        var lean_mass = document.getElementById("lean_mass").value;
        var Waist = document.getElementById("Waist").value
        var fianchi = document.getElementById("fianchi").value
        var right_tight = document.getElementById("right_tight").value
        var left_tight = document.getElementById("left_tight").value
        var chest = document.getElementById("chest").value

        const configuration = {
            method: "post",
            url: "http://localhost:4000/add_measurements",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
            data: {
                patient: patient.get("patient"),
                date: date,
                weight: weight,
                body_fat: body_fat,
                lean_mass: lean_mass,
                Waist: Waist,
                fianchi: fianchi,
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

            <center>
                <Card className="progress_card">
                    <Card.Header as="h5">Progress of {patient.get("name")} {patient.get("surname")}
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
                                            <TableCell align="right"> % body fat </TableCell>
                                            <TableCell align="right"> % lean mass </TableCell>
                                            <TableCell align="right">Waist (cm)</TableCell>
                                            <TableCell align="right">Hips (cm)</TableCell>
                                            <TableCell align="right">Right Tight (cm)</TableCell>
                                            <TableCell align="right">Left Tight (cm)</TableCell>
                                            <TableCell align="right">chest (cm)</TableCell>
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
                                                <TableCell align="right">{row.body_fat}</TableCell>
                                                <TableCell align="right">{row.lean_mass}</TableCell>
                                                <TableCell align="right">{row.Waist}</TableCell>
                                                <TableCell align="right">{row.fianchi}</TableCell>
                                                <TableCell align="right">{row.right_tight}</TableCell>
                                                <TableCell align="right">{row.left_tight}</TableCell>
                                                <TableCell align="right">{row.chest}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >


                                            <Form.Select aria-label="Default select example" id="date">
                                                <option value={"invalid"}>date</option>
                                                {dates.map((date) => (
                                                    (!date_of_visit.find(item => {
                                                        return item.getTime() == date.getTime()
                                                    })) && date.getTime() < new Date().getTime() && <option value={date.toString()}>{date.getDate().toString() + "-" + month[date.getMonth()] + "-" + date.getFullYear().toString()}</option>
                                                ))}
                                            </Form.Select>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='weight' id="weight" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='weight' id="body_fat" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='weight' id="lean_mass" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='Waist' id="Waist" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='fianchi' id="fianchi" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='right_tight' id="right_tight" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='left_tight' id="left_tight" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='chest' id="chest" onChange={handleChange}></input></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <center>
                            <div>

                                <Button disabled={disabled} variant="contained" className='button_measurements' onClick={add_row}>Add measurements</Button>
                            </div>
                        </center>
                    </Card.Body>


                </Card>
            </center>

        </>

    )

}

export default Progress
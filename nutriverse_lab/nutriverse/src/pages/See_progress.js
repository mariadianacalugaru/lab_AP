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


    const handleChange = () => {
        var date = new Date(document.getElementById("date").value);
        var weight = document.getElementById("weight").value;
        var vita = document.getElementById("vita").value
        var fianchi = document.getElementById("fianchi").value
        var coscia_dx = document.getElementById("coscia_dx").value
        var coscia_sx = document.getElementById("coscia_sx").value
        var torace = document.getElementById("torace").value
        if (document.getElementById("date").value == "invalid" || weight == "" || vita == "" || fianchi == "" || coscia_dx == "" || coscia_sx == "" || torace == "") {
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

    function createData(date, weight, vita, fianchi, coscia_dx, coscia_sx, torace) {
        return { date, weight, vita, fianchi, coscia_dx, coscia_sx, torace };
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
                                    result.vita[i],
                                    result.fianchi[i],
                                    result.coscia_dx[i],
                                    result.coscia_sx[i],
                                    result.torace[i]))

                            }
                            setRows(list)
                            list_dates.sort(function (a, b) {
                                return a - b;
                            });
                            setDate_of_visit(list_dates)
                            setWeights(result.weight)
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
        var vita = document.getElementById("vita").value
        var fianchi = document.getElementById("fianchi").value
        var coscia_dx = document.getElementById("coscia_dx").value
        var coscia_sx = document.getElementById("coscia_sx").value
        var torace = document.getElementById("torace").value

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
                vita: vita,
                fianchi: fianchi,
                coscia_dx: coscia_dx,
                coscia_sx: coscia_sx,
                torace: torace
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
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: 10, label: 'Carbos' },
                                                { id: 1, value: 15, label: 'Proteins' },
                                                { id: 2, value: 20, label: 'Fats' },
                                            ],
                                        },
                                    ]}
                                    width={400}
                                    height={200}
                                />
                            </div>
                        </center>
                        <div className='table_progress_user'>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date of visit</TableCell>
                                            <TableCell align="right">Weight (Kg)</TableCell>
                                            <TableCell align="right">Vita (cm)</TableCell>
                                            <TableCell align="right">Fianchi (cm)</TableCell>
                                            <TableCell align="right">Coscia dx (cm)</TableCell>
                                            <TableCell align="right">Coscia sx (cm)</TableCell>
                                            <TableCell align="right">Torace (cm)</TableCell>
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
                                                <TableCell align="right">{row.vita}</TableCell>
                                                <TableCell align="right">{row.fianchi}</TableCell>
                                                <TableCell align="right">{row.coscia_dx}</TableCell>
                                                <TableCell align="right">{row.coscia_sx}</TableCell>
                                                <TableCell align="right">{row.torace}</TableCell>
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
                                                    })) && <option value={date.toString()}>{date.getDate().toString() + "-" + month[date.getMonth()] + "-" + date.getFullYear().toString()}</option>
                                                ))}
                                            </Form.Select>


                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='weight' id="weight" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='vita' id="vita" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='fianchi' id="fianchi" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='coscia_dx' id="coscia_dx" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='coscia_sx' id="coscia_sx" onChange={handleChange}></input></TableCell>
                                            <TableCell align="right"><input type='number' className='input_progress' placeholder='torace' id="torace" onChange={handleChange}></input></TableCell>
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
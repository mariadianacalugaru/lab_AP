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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dropdown from 'react-bootstrap/Dropdown';

const Progress = () => {

    const [info, setGetInfo] = useState(false);
    const [dates, setDates] = useState([])
    const [mynutr, setNutritionists] = useState([])
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const navigate = useNavigate()
    const [lastVisit, setLastVisit] = useState(Object)
    const [patient, setPatient] = useSearchParams()
    const [date_of_visit, setDate_of_visit] = useState([])
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

                            setDate_of_visit(results)

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
                            setDates(time)
                            setNutritionists(nutritionists)
                            setLastVisit(time[time.length - 1])
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
                torace:torace
            }
        };
        try {
            await axios(configuration)
                .then((res) => {
                    if (res.data == "not logged") {
                        navigate("/")
                    }
                    console.log(res.data)
                })
                .catch((event) => {
                    console.log(event);
                });
        } catch (event) {
            console.log(event);
        }

    }
    function createData(date, weight, vita, fianchi, coscia_dx, coscia_sx, torace) {
        return { date, weight, vita, fianchi, coscia_dx, coscia_sx, torace };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 5, 6)
    ];
    return (
        <>
            <h1>last visit was: {lastVisit.day} {month[lastVisit.month]} {lastVisit.year}</h1>
            <center>

                <div className='charts'>

                    <LineChart
                        xAxis={[{ scaleType: 'time', data: date_of_visit, label: "date of visit", valueFormatter: (value) => value.getDate().toString() + "-" + month[value.getMonth()] + "-" + value.getFullYear().toString() }]}
                        series={[
                            {
                                data: date_of_visit, label: "weight"
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
            <center>
                <div className='table_progress_user'>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date of visit</TableCell>
                                    <TableCell align="right">Weight</TableCell>
                                    <TableCell align="right">Vita</TableCell>
                                    <TableCell align="right">Fianchi</TableCell>
                                    <TableCell align="right">Coscia dx</TableCell>
                                    <TableCell align="right">Coscia sx</TableCell>
                                    <TableCell align="right">Torace</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <>
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
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <input type='date' id="date"></input>
                                            </TableCell>
                                            <TableCell align="right"><input type='text' className='input_progress' placeholder='weight' id="weight"></input></TableCell>
                                            <TableCell align="right"><input type='text' className='input_progress' placeholder='vita' id="vita"></input></TableCell>
                                            <TableCell align="right"><input type='text' className='input_progress' placeholder='fianchi' id="fianchi"></input></TableCell>
                                            <TableCell align="right"><input type='text' className='input_progress' placeholder='coscia_dx' id="coscia_dx"></input></TableCell>
                                            <TableCell align="right"><input type='text' className='input_progress' placeholder='coscia_sx' id="coscia_sx"></input></TableCell>
                                            <TableCell align="right"><input type='text' className='input_progress' placeholder='torace' id="torace"></input></TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </center>
            <center>
                <div>

                    <Button variant="contained" className='button_measurements' onClick={add_row}>Add measurements</Button>
                </div>
            </center>
        </>

    )

}

export default Progress
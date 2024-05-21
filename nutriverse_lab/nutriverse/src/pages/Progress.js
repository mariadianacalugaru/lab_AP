import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
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

const Progress = () => {

    const [info, setGetInfo] = useState(false);
    const [dates, setDates] = useState([])
    const [mynutr, setNutritionists] = useState([])
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const navigate = useNavigate()
    const [lastVisit, setLastVisit] = useState(Object)

    
    useEffect(() => {
        const configuration = {
            method: "GET",
            url: "http://localhost:4000/myappointments",
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
    function createData(date, weight, vita, fianchi, coscia_dx, coscia_sx, torace) {
        return { date, weight, vita, fianchi, coscia_dx, coscia_sx, torace };
      }
      
      const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0,5,6)
      ];
    return (
        <>
            <h1>last visit was: {lastVisit.day} {month[lastVisit.month]} {lastVisit.year}</h1>
            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
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
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    )
}

export default Progress
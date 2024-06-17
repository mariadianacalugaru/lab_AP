import Calendar from 'react-awesome-calendar';
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import "../pages/css/Appointment.css"

console.log(new Date().getTime())
const event = [{
    id: 1,
    color: '#fd3153',
    from: new Date().getTime()+120*60000,
    to: new Date(new Date().getTime()+180*60000),
    title: 'This is an event'
}]

const Appointment = () => {
    const [dates, setDates] = useState([])
    const [get_info, setGetInfo] = useState(false)
    const [bookings, setbookings] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const configuration = {
            method: "GET",
            url: "http://localhost:4000/get_appointments",
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
                    .then((res) => res.data)
                    .then((json) => {
                        if (json == "not logged") {
                            navigate("/")
                        }
                        const results = json.map((date) => {
                            return new Date(date.date);
                        });
                        const patients = json.map((item) => {
                            return item.name_user + " " + item.lastname_user;
                        })
                        var events = []
                        for (var i = 0; i < results.length; i++) {
                            var data = {
                                id: i,
                                color: '#9bb150',
                                from: results[i].getTime()+120*60000,
                                to: results[i].getTime()+180*60000,
                                title: 'Visit with '+ patients[i]
                            }
                            events.push(data)
                        }
                        setbookings(events)

                    })
                    .catch((event) => {
                        console.log(event);
                    });
            } catch (error) {
                console.log(error);
            }

        }
        if (!get_info) {
            get_appointments()
        }
        else {
            console.log(bookings)
        }

    });


    return (
        <div className="home-background">
            <center >
            <div className='calendar'>
                <Calendar
                    events={bookings}
                />
            </div>
        </center>
        </div>
    );
}

export default Appointment
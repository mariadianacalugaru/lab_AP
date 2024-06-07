import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DayTimePicker from '@mooncake-dev/react-day-time-picker';
import "./css/Booking.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import NoAvatar from "../assets/no_avatar.png";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';


import {
    MDBCardTitle,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBTextArea,
    MDBBtn,
} from 'mdb-react-ui-kit';


function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Successful appointment!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    You have successfully booked an appointment.
                </p>
                <p>
                    You will find details about the booking in your personal area.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

const Booking = () => {

    const [modalShow, setModalShow] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [name, setName] = useState(searchParams.get("name"))
    const [email, setEmail] = useState(searchParams.get("email"))
    const navigate = useNavigate()
    const [dates, setDates] = useState([])
    const [info, setInfo] = useState(false)
    const [firstname, set_firstname] = useState("")
    const [lastname, set_lastname] = useState("")
    const [country, set_country] = useState("")
    const [city, set_city] = useState("")
    const [address, set_address] = useState("")
    const [image, set_image] = useState("")
    const [get_info, setGetInfo] = useState(false)

    useEffect(() => {
        const configuration = {
            method: "GET",
            url: "http://localhost:4000/info_nutritionist?email=" + email,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
        };

        const get_info_nutritionist = () => {
            setGetInfo(true)
            try {
                axios(configuration)
                    .then((res) => {
                        set_firstname(res.data.firstname);
                        set_lastname(res.data.lastname);
                        set_country(res.data.country);
                        set_city(res.data.city);
                        set_address(res.data.address);
                        set_image(JSON.parse(res.data.image).base64)
                    })
                    .catch((event) => {
                        console.log(event);
                    });
            } catch (error) {
                console.log(error);
            }

        }
        if (!get_info) {
            get_info_nutritionist()
        }
    });


    useEffect(() => {
        var formdata = new FormData()
        formdata.append("nutritionist", email)
        const get_reservations = async () => {
            const configuration = {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:4000",
                },
                withCredentials: true,
            };
            try {
                await axios.post("http://localhost:4000/get_reservations", formdata, configuration)
                    .then((res) => {
                        if (res.data == "not logged") {
                            navigate("/login")
                        }
                        else {
                            setDates(res.data)
                        }
                    }
                    )
                    .catch((event) => {
                        console.log(event);
                    });
            } catch (event) {
                console.log(event);
            }
        }
        if (name == null || email == null) {
            navigate("/nutritionists")
        }
        if (!info) {
            get_reservations()
        }

    }, [dates.current])

    const history = useNavigate()

    const close = () => {
        setModalShow(false);
        history("/MyProfile#appointments");
        //history(0)
    }

    function timeSlotValidator(slotTime) {
        var booked = false;
        for (var i = 0; i < dates.length; i++) {
            if (dates[i].date == slotTime) {
                booked = true
            }
        }
        const start = new Date(
            slotTime.getFullYear(),
            slotTime.getMonth(),
            slotTime.getDate(),
            9,
            0,
            0
        );

        const end = new Date(
            slotTime.getFullYear(),
            slotTime.getMonth(),
            slotTime.getDate(),
            19,
            0,
            0
        );
        const isValid = !booked && slotTime.getTime() >= start.getTime() && slotTime.getTime() <= end.getTime();

        return isValid;

    }
    const handleScheduled = async (dateTime) => {
        var formdata = new FormData()
        formdata.append("email_nutritionist", email);
        formdata.append("date", dateTime)
        formdata.append("name_nutritionist", firstname)
        formdata.append("surname_nutritionist", lastname)
        formdata.append("address_nutritionist", address)
        formdata.append("city_nutritionist", city)
        formdata.append("country_nutritionist", country)
        const configuration = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
        };
        try {
            await axios.post("http://localhost:4000/add_reservation", formdata, configuration)
                .then((res) => {
                    if (res.data == "booking accepted") {
                        setModalShow(true)
                    }
                })
        }
        catch (event) {
            console.log(event);
        }
    };

    return (
        <div className="home-background">
            <center>

                <div className='booking'>
                    <div className='card_nutritionist'>

                        <MDBCard className="mb-10">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src={image == "" ? NoAvatar : image}
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '200px' }}
                                    fluid />
                                <p className="text-muted mb-1">Nutritionist</p>
                                <p className="text-muted mb-2">{firstname} {lastname}</p>
                                <p className="text-muted mb-2">{email}</p>
                                <p className="text-muted mb-2">{country}, {city}, {address}</p>
                                <Typography component="legend">Rating</Typography>
                                <Rating precision={0.5} name="read-only" value={3.5} readOnly />
                                <Link to={{
                                    pathname: "/reviews",
                                    search: "?nutr="+email,
                                }}>
                                    <MDBCardText>
                                        See reviews
                                    </MDBCardText>
                                </Link>
                            </MDBCardBody>
                        </MDBCard>


                    </div>
                    <div className='Calendar_timeslot'>
                        <DayTimePicker
                            timeSlotSizeMinutes={60}
                            timeSlotValidator={timeSlotValidator}
                            onConfirm={handleScheduled}
                        />
                    </div>
                    <MyVerticallyCenteredModal
                        show={modalShow}
                        onHide={() => close()}
                    />
                </div>

            </center>
        </div>
    )
}

export default Booking
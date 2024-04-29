import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DayTimePicker from '@mooncake-dev/react-day-time-picker';
import "./css/Booking.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


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
            Success Reservation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            La prenotazione è andata a buon fine
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
    const [info,setInfo] = useState(false)

    
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
        history(0)
    }
    
    function timeSlotValidator(slotTime) {
        var booked = false;
        for (var i = 0; i < dates.length; i++){
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
        formdata.append("email_nutritionist", email)
        formdata.append("date",dateTime)
        const configuration = {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
          };
        try {
            await axios.post("http://localhost:4000/add_reservation",formdata,configuration)
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
        <>
            <h1>{name}</h1>
            <h2>{email}</h2>
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
        </>
    )
}

export default Booking
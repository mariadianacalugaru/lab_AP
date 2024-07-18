import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import './css/MyProfile.css';
import axios from 'axios';
import { TabPane } from 'react-bootstrap';
import { useNavigate, Link, useLocation, createSearchParams, useSearchParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import NoAvatar from "../assets/no_avatar.png"
import Chat from './Chat'
import Rating from '@mui/material/Rating';




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
          Successful update
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Profile updated successfully.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}



const MyProfile = ({ setSid, setIs_nutritionist }) => {
  const [info, setInfo] = useState(false)
  const [firstname, setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const [is_nutritionist, setNutritionist] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [patients, setPatients] = useState([]);
  const [image, setImage] = useState("");
  const [able, setAble] = useState(false);
  const [modalShow, setModalShow1] = useState(false)
  const [validated, setValidated] = useState(false);
  const [form_Data, set_Form_Data] = useState({
    password: "",
    confirmPass: "",
    image: "",
    country: "",
    city: "",
    address: "",
  });
  const [appointment_list, change_appointment_list] = useState([]);
  const [appointment, setAppointment] = useState('');

  const history = useNavigate();
  const navigate = useNavigate()

  const [get_info, setGetInfo] = useState(false)
  const [list_reviews, setListReviews] = useState([])

  
  async function delete_appointment(appointment_id) {
    console.log(appointment_id);
    const configuration = {
      method: "post",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "https://localhost",
      },
      withCredentials: true,
      params: {
        id: appointment_id,
      }
    }
    try {
      await axios.get("https://localhost/api/delete_appointment/", configuration)
        .then((res) => {
          console.log(res.data)
        })
        .catch(event => {
          console.log(event);
        })

    }
    catch (event) {
      console.log(event);

    }
  }

  const chngFn = (event) => {
    const { name, value } = event.target;
    set_Form_Data({
      ...form_Data,
      [name]: value,
    });

    if ((form_Data.password != "" && form_Data.confirmPass != "") || document.getElementById("fileToUpload").files[0] != "" || form_Data.city != "" || form_Data.address != "") {
      setAble(true);
    }
    else {
      setAble(false);
    }
  };



  function convertToBase64(e) {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
      if (reader.result != "") {
        setAble(true);
      }
    };
    reader.onerror = error => {
      console.log(error);
    }
  }

  useEffect(() => {
    async function get_user_appointments() {
      const configuration = {
        method: "post",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "https://nutriverse",
        },
        withCredentials: true,
      }
      try {
        axios.get("https://nutriverse/api/fetch_appointments", configuration)
          .then((res) => {
            if (res.data === "not logged") {
              console.log("fetch appointments")
              history("/")
            }
            else {
              change_appointment_list(res.data);
            }
          })
          .catch((event) => {
            console.log(event);
          });
      } catch (event) {
        console.log(event);
      }

      
    }
    async function get_patients() {
      const configuration = {
        method: "get",
        url: "https://localhost/api/search_nutritionists",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://localhost",
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
    async function get_info() {
      const configuration = {
        method: "post",
        url: "https://localhost/api/session_info",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://localhost",
        },
        withCredentials: true,


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
              setSid(res.data.user.firstname + " " + res.data.user.lastname)
              setFirstname(res.data.user.firstname + " " + res.data.user.lastname);
              setEmail(res.data.user.email);
              setNutritionist(res.data.user.is_nutritionist);
              setIs_nutritionist(res.data.user.is_nutritionist)
              setAvatar(res.data.user.image !== "" ? (JSON.parse(res.data.user.image).base64) :"");

              
          

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
    if (!info) {
      get_user_appointments();
      get_patients();
      get_info();
    }
  }, [])


  const close = () => {
    setModalShow1(false);
    history(0)
  }

  async function update(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    else {
      var formdata = new FormData()
      formdata.append('email', email);
      formdata.append('image', JSON.stringify({ base64: image }));
      formdata.append('password', form_Data.password)
      formdata.append('city', form_Data.city)
      formdata.append('address', form_Data.address)

      const configuration = {
        method: "post",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "https://localhost",
        },
        withCredentials: true,
      }
      try {
        await axios.post("https://localhost/api/update_user", formdata, configuration)
          .then((res) => {
            console.log(res.data)
            if (res.data === "user updated") {
              setModalShow1(true);
            }
          })
          .catch(event => {
            alert("wrong details")
            console.log(event);
          })

      }
      catch (event) {
        console.log(event);

      }
    }
    setValidated(true);
  }

  

  
    

  const get_reviews = () => {
      const configuration_reviews = {
        method: "GET",
        url: "https://localhost/api/get_reviews?email=" + email,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://localhost",
        },
        withCredentials: true,
    };
      try {
          axios(configuration_reviews)
              .then((res) => {
                if (res.data == "not logged") {
                      navigate("/")
                  }
                  setListReviews(res.data)
                  console.log(res.data)
              })
              .catch((event) => {
                  console.log(event);
              });
      } catch (error) {
          console.log(error);
      }

  }
  



  return (
    <div>
    <div className="home-background">
    <Tab.Container id="list-group-tabs-example" defaultActiveKey="#editprofile">
      <Row>

        <Col sm={2}>
          <Card className='cont1'>
            <ListGroup>
              <center><div className='label2'>{firstname}</div><Image src={avatar == "" ? NoAvatar : avatar} className='image' ></Image>
              </center>
              <ListGroup.Item className='listgroup2' action href="#editprofile">
                Edit Profile
              </ListGroup.Item>
              {!is_nutritionist && <ListGroup.Item className='listgroup2' action href="#appointments">
                Appointments
              </ListGroup.Item>}
                  {is_nutritionist && <ListGroup.Item className='listgroup2' action href="#reviews" onClick={(e)=>get_reviews()}>
                Reviews
              </ListGroup.Item>}


            </ListGroup>
          </Card>
        </Col>

        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane className='pane' eventKey="#editprofile"><Card>
              <Card.Header as="h5">Edit Profile</Card.Header>
              <Card.Body>


                <Form noValidate onSubmit={update} >
                  <Row className="mb-3">
                    <Col sm={4}>
                      <center>
                        <div style={{ witdh: "auto" }}>
                          <label for="fileToUpload" className="photo">
                            {image == "" || image == null ? <img width={170} src={avatar == "" ? NoAvatar : avatar} ></img> : <img width={150} src={image} />}
                            <span>Change Image</span>
                          </label>

                          <input id="fileToUpload"
                            accept="image/*"
                            type="file"
                            onChange={convertToBase64}
                          />
                        </div>

                      </center>
                    </Col >
                    <Col sm={8}>

                      <Form.Group controlId="formGridPassword">
                        <Form.Label>Name and surname</Form.Label>
                        <Form.Control className='control' type="surname" value={firstname} disabled />
                      </Form.Group>

                      <Row className="mb-3-special">
                        <Col>
                          <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className='control' type="email" value={email} disabled />
                          </Form.Group>
                        </Col>

                      </Row>

                      <Row className="mb-3-special">
                        <Col>
                          <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>New password</Form.Label>
                            <Form.Control className='control' placeholder="Enter password" minLength={6} value={form_Data.password} onChange={chngFn} id="password" name="password" type="password"
                              isInvalid={validated && form_Data.password != "" && form_Data.password.length < 6}
                              isValid={validated && (form_Data.password.length >= 6 || form_Data.password.length == 0)} />
                            <Form.Control.Feedback type="invalid" >
                              Password must be at least 6 characters long.
                            </Form.Control.Feedback>
                          </Form.Group>


                        </Col>
                        <Col>
                          <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm new password</Form.Label>
                            <Form.Control className='control' type="password" name="confirmPass" placeholder="Confirm new password" value={form_Data.confirmPass} onChange={chngFn} minLength={6} pattern={form_Data.password} isInvalid={(validated && form_Data.confirmPass !== form_Data.password)}
                              isValid={(validated && form_Data.confirmPass === form_Data.password)} />
                            <Form.Control.Feedback type="invalid">
                              Passwords do not match.
                            </Form.Control.Feedback>
                          </Form.Group>

                        </Col>
                      </Row>

                    </Col>
                  </Row>
                  {is_nutritionist && <Row className="mb-3-special">
                    <Col>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>New address</Form.Label>
                        <Form.Control className='control' placeholder="New address" name="address" value={form_Data.address} onChange={chngFn}
                          isInvalid={false}
                          isValid={(validated)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formGridPassword">
                        <Form.Label>New city</Form.Label>
                        <Form.Control className='control' placeholder="New city" name="city" value={form_Data.city} onChange={chngFn}
                          isInvalid={false}
                          isValid={(validated)} />
                      </Form.Group>

                    </Col>
                  </Row>}
                  <center>
                    <Button variant="primary" className='mybutton' type="submit" id="submit" disabled={!able}>
                      Save
                    </Button>
                  </center>

                  <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => close()}
                  />

                </Form>


              </Card.Body>
            </Card>
            </Tab.Pane>
            <Tab.Pane className='pane' eventKey="#appointments">
              <Card>
                <Card.Header as="h5">Appointments</Card.Header>
                <Card.Body>
                   {
                appointment_list.map((item) => (
                  <div>
                    <Card className='appo'>
                      
                      <Card.Body>
                        <Card.Title>Nutritionist: {item.name_nutr + ' ' + item.lastname_nutr}</Card.Title>
                        <Card.Text>
                          When: {new Date(item.date).getDate()}/{new Date(item.date).getMonth()+1}/{ new Date(item.date).getFullYear()} {new Date(item.date).getHours() + ':00'}
                        </Card.Text>
                        <Card.Text>
                          Where: {item.address_nutr + ', ' + item.city_nutr + ', ' + item.country_nutr}
                        </Card.Text>
                        {(new Date(item.date) > new Date()) && <Button onClick={()=>{delete_appointment(item._id)}}>Cancel Appointment</Button>}
                      </Card.Body>
                    </Card>
                  </div>
                ))
              } 

                </Card.Body>
              </Card>
            </Tab.Pane>

            <Tab.Pane className='pane' eventKey="#reviews">
              <Card>
                <Card.Header as="h5">Reviews</Card.Header>
                <Card.Body>
                <div className = "old_reviews">
                 
                {list_reviews.map((user) => (
                    <Card className="review">
                        <Card.Title className="reviewer_name">{user.firstname} {user.lastname}</Card.Title>
                        <hr />
                        <Card.Body className="review_body">
                            <Card.Text>
                                {user.comment}
                            </Card.Text>
                            <Rating value={user.star}/>
                            
                        </Card.Body>
                    </Card>
                ))}
            </div>
                </Card.Body>
              </Card>
            </Tab.Pane>



          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </div>
    <Chat></Chat>
    </div>
  )
}

export default MyProfile
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import './css/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';



const Login = () => {

  const [validated, setValidated] = useState(false);
  const [form_Data, set_Form_Data] = useState({
    firstname: "",
    lastname: "",
    password: "",
    confirmPass: "",
    email: "",
  });
  const chngFn = (event) => {
    const { name, value } = event.target;
    set_Form_Data({
      ...form_Data,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true)


  };

  return (
    <div className="home-background">
      <center>
        <Card xs className="card1">
          <Card.Body>

            <Tabs
              defaultActiveKey="profile"
              id="fill-tab-example"
              className="mb-3"
              fill
            >
              <Tab eventKey="home" title="Login">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group>

                  {['checkbox'].map((type) => (
                    <div key={`default-${type}`} className="mb-3">
                      <Form.Check // prettier-ignore
                        type={type}
                        id={`default-${type}`}
                        label={`Remember Me`}
                      />


                    </div>
                  ))}
                </Form.Group>
                <center><Button type="submit" id="submit">Login</Button></center>

              </Tab>
              <Tab eventKey="profile" title="Registrazione">
                <div className='Reg' >
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control required name="firstname" type="firstname" placeholder="First Name" pattern="^[a-zA-Z0-9]+$" value={form_Data.firstname} onChange={chngFn}
                        isInvalid={validated && !/^[a-zA-Z0-9]+$/.test(form_Data.user)} />
                      <Form.Control.Feedback type='invalid'>Please enter a valid name</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control value={form_Data.lastname} onChange={chngFn} required name="lastname" type="lastname" placeholder="Last Name" isInvalid={validated && !/^[a-zA-Z0-9]+$/.test(form_Data.user)} />
                      <Form.Control.Feedback type='invalid'>Please enter a valid lastname</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control value={form_Data.email} onChange={chngFn} required name="email" type="email" placeholder="name@example.com" isInvalid={
                        validated &&
                        !/^\S+@\S+\.\S+$/.test(form_Data.email)
                      } />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>      </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Password</Form.Label>
                      <Form.Control minLength={6} value={form_Data.password} onChange={chngFn} id="password" required name="password" type="password" placeholder="Password" isInvalid={
                        validated && form_Data.password.length < 6
                      } />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters long.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPass"
                        placeholder='Confirm Password'
                        value={form_Data.confirmPass}
                        onChange={chngFn}
                        minLength={6}
                        required
                        pattern={form_Data.password}
                        isInvalid={
                          validated &&
                          form_Data.confirmPass !== form_Data.password
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords do not match.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <input // prettier-ignore
                      type="switch"
                      id="custom-switch"
                      label="Are you a nutritionist?"

                    />
                    <center><Button type="submit" id="submit" >Registration</Button></center>
                  </Form>
                </div>
              </Tab>

            </Tabs>
          </Card.Body>
        </Card>
      </center>
    </div>
  )
}

export default Login
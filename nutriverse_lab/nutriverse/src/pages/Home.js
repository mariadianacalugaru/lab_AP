import React, {useEffect, useState } from 'react'
import './css/Home.css'
import SearchBarComponent from '../component/SearchBarComponent'
import Logo_home from '../assets/scritta.png'
import axios from 'axios'
import Chat from './Chat'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nut from "../assets/nut.png";
import Client from "../assets/client.png";

const Home = ({sid, setSid}) => {

  
 
    return (
      <>
        <div className="home-background">      
        <center>
          <div className='logo-home'><img src={Logo_home} alt="Nutriverse"></img></div>

          <div className='home-cards'>
            <Card className='nutritionist_card'>
              <div className='nutritionist_header'>
                <Card.Img variant="top" src={Nut} className="nut_icon" />
                <h3 className="nut_title"> Are you a <br/> nutritionist?</h3>
              </div>
              <Card.Body>
                <Card.Text><h5>
                    This application is what you need!
                    </h5>
                </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>Create personalized foodplans.</ListGroup.Item>
                <ListGroup.Item>Keep track of your patient's progress.</ListGroup.Item>
                <ListGroup.Item>Manage your appointments.</ListGroup.Item>
                <ListGroup.Item>Keep in touch with your patients.</ListGroup.Item>
                <ListGroup.Item></ListGroup.Item>
              </ListGroup>
            </Card>

            <Card className='nutritionist_card'>
              <div className='nutritionist_header'>
                <Card.Img variant="top" src={Client} className="nut_icon" />
                <h3 className="nut_title"> Do you want a<br/> healthy lifestyle?</h3>
              </div>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>Search for a nutritionist in your city.</ListGroup.Item>
                <ListGroup.Item>Book a check-up.</ListGroup.Item>
                <ListGroup.Item>Access you personalized foodplan.</ListGroup.Item>
                <ListGroup.Item>Keep track of your progress.</ListGroup.Item>
                <ListGroup.Item>Search for receipes inspirations.</ListGroup.Item>
                <ListGroup.Item></ListGroup.Item>
              </ListGroup>
            </Card>

          </div>
          <Chat></Chat>

        </center>
        </div> 
        {(sid != "") && <Chat></Chat>}
      </>
  )
}

export default Home
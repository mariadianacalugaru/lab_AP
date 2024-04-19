import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
const Admin = () => {
  async function send_file() {
      const configurations = {
        headers: {
          'Content-Type': 'appplication/json',
          "Access-Control-Allow-Origin": "http://localhost:4000",
        },
        withCredentials: true,
      }
    try {
      axios.get("http://localhost:4000/receiver", configurations)
        .then(response => console.log(response))
    }
    catch (event) {
      console.log(event);
    }
    }
    

    

    return (
      <>
      <div>Admin</div>
            <button onClick={send_file}>Invia file</button>
            
      </>
  )
}

export default Admin
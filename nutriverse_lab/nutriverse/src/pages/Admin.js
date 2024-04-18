import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    var formdata = new FormData();
            // Define your async function
    async function send_file() {
        for (const value of formdata.values()) {
            console.log(value);
          }
        axios.post('http://localhost:4000/file', formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
          });
    }
    

    const handleChange = (value) => {
        formdata.append("file",value[0])
    }

    return (
      <>
      <div>Admin</div>
            <button onClick={send_file}>Invia file</button>
            <input name="file" onChange={(e) => handleChange(e.target.files)} type='file' id="file"></input>
      </>
  )
}

export default Admin
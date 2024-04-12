

// Importing express module
const express = require('express');
const app = express();
app.use(express.json());       
app.use(express.urlencoded({ extended: true })); 

const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
app.use(express.json());
 
app.get('/',
    (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
 
app.post('/register',
    (req, res) => {
        const name = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
        console.log(name)
        console.log(lastname)
        console.log(email)

        console.log(email)
        const nutriverse = client.db("nutriverse");
        const users = nutriverse.collection("utenti_nutriverse");
        var data = {
            "name": name,
            "lastname": lastname,
            "email": email,
            "password": password
        }
        users.insertOne(data, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            client.close();
        });
        res.redirect('http://localhost:3000/');
    });



        

    

 
app.listen(4000,
    () => {
        console.log(
            'Our express server is up on port 4000'
        );
    });






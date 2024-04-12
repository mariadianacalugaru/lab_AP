

// Importing express module
const express = require('express');
const app = express();
app.use(express.json());       
app.use(express.urlencoded({ extended: true })); 

const { MongoClient } = require('mongodb');
const uri = "mongodb://root:example@localhost:27016";
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
        const users = nutriverse.collection("users");
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
        res.redirect('https://localhost');
    });



        

    

 
app.listen(3000,
    () => {
        console.log(
            'Our express server is up on port 3000'
        );
    });






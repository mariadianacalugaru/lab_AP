
// Importing express module
const express = require('express');
const app = express();
app.use(express.json());       
app.use(express.urlencoded({ extended: true })); 

const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
 
app.get('/',
    (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
 
app.post('/register', async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    const exist = await check(users, email).catch(console.dir);
    if (exist < 1) {
        var data = {
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "password": password
        }
        users.insertOne(data, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            client.close();
        });
        res.redirect('http://localhost:3000/');
    }
    else {
        res.send("user already registered");
    }
});



        

    

 
app.listen(4000,
    () => {
        console.log(
            'Our express server is up on port 4000'
        );
    });


async function check(users,email) {
    try {
        
        // Get the database and collection on which to run the operation
        
        // Query for a movie that has the title 'The Room'
        const query = { "email": email };
        // Execute query
        const len = await users.countDocuments(query);
        // Print the document returned by findOne()
        return len;
    } catch {
        console.log("errore")
    }
    }




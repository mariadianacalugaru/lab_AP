
// Importing express module
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    
    
    // exposedHeaders: \['Set-Cookie', 'Date', 'ETag'\]
  };
const bcrypt = require('bcrypt'); 
const session = require('express-session')
const saltRounds = 10;
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/nutriverse',
    collection: 'mySessions'
  });

// Catch errors
store.on('error', function(error) {
    console.log(error);
  });

app.use(
    session({
      secret: "some secret",
      cookie: { maxAge: 60000 * 20},
      saveUninitialized: false,
      store: store,
      resave: true
    })
  );

app.use(cors(corsOptions));
app.use(express.json());       
app.use(express.urlencoded({ extended: true })); 
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
 
app.get('/',
    (req, res) => {
        res.sendFile("ciao");
    });

    app.post('/user_informations', (req, res) => {
        console.log(req.body._id)
        const nutriverse = client.db("nutriverse");
        const users = nutriverse.collection("users");
        var ObjectId = require('mongodb').ObjectId;
        users.findOne({ _id: new ObjectId(req.body._id)}).then(user => {
            if (user){
                res.send(user.firstname)
            }
            else {
                res.send("No account")
            }
        })
    
    });
        
app.post('/login', async (req, res) => {
 
    if (req.session.authenticated) {
        res.json(session);
    }
    else {
        
        const email = req.body.email;
        const password = req.body.password
    
        const nutriverse = client.db("nutriverse");
        const users = nutriverse.collection("users");
       
        users.findOne({email: email}).then(user => {
            if (user){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(result==true){
                        req.session.authenticated = true;
                        req.session.user = {
                            _id:user._id,
                            firstname: user.firstname,
                            lastname:user.lastname
                        };
                        res.cookie("sid","ciao")
                        res.send("logged in")
                    }
                    else{
                        res.send("Incorrect password!")
                    }
            })
            }
            else {
                res.send("No account associated to this email!")
            }
        })
    }
});


app.post("/session_info", (req, res) => {
    if (req.session.authenticated) {
        res.send(req.session.user.firstname+" "+req.session.user.lastname);
    }
    else {
        res.send("")
    }
})


app.post('/register', async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, saltRounds);
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
        res.send('user registered');
    }
    else {
        res.send("user already registered");
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("connect.sid").status(200).send('Ok.');
})

app.get('/search_nutritionists', async (req, res) => {  
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    const result =  await users.find({}).toArray();
    //const all_users = JSON.stringify(result);
    //console.log(all_users);
    res.send(result)
    //res.send("ciao")     
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




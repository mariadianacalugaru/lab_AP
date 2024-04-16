
// Importing express module
const express = require('express');
const app = express();
const cors = require('cors');
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

app.use(cors());
app.use(express.json());       
app.use(express.urlencoded({ extended: true })); 
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
 
app.get('/',
    (req, res) => {
        res.sendFile(__dirname + '/index.html');
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
    const email = req.body.email;
    const password = req.body.password

    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
   
    users.findOne({email: email}).then(user => {
        if (user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(result==true){
                    res.send(user._id.toString());
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
});

app.post("/login_sessione", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      if (req.session.authenticated) {
        res.json(session);
      } else {
        if (password === "123") {
          req.session.authenticated = true;
          req.session.user = 
          { username ,
            "role": "user",
            "birthday": "01-01-2010",
            "email":"user@email.com",
            "nino frassica":"il mio albero genealogico"
        };
          res.send("logged in");
        } else {
          res.status(403).json({ msg: "Bad credentials" });
        }
      }
    } else {
      res.status(403).json({ msg: "Bad credentials" });
    }
  });

app.post("/session_info",(req,res)=>{
    res.send(req.session.authenticated);
})


app.post('/register', async (req, res) => {
    console.log("ciao")
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, saltRounds);
    console.log(firstname)
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




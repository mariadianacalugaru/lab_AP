// Importing express module
const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'triviastack@gmail.com',
	    pass: 'oceq atgs lajc hmfp'
    }
});

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,


    // exposedHeaders: \['Set-Cookie', 'Date', 'ETag'\]
};
const whitelist = [
    'file/pdf'
]

const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
    fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            return cb(new Error('file is not allowed'))
        }
        cb(null, true)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    }
})

const bcrypt = require('bcrypt');
const session = require('express-session')
const saltRounds = 10;
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/nutriverse',
    collection: 'mySessions'
});

// Catch errors
store.on('error', function (error) {
    console.log(error);
});

app.use(
    session({
        secret: "some secret",
        cookie: { maxAge: 60000 * 20 },
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

app.post('/login', async (req, res) => {

    if (req.session.authenticated) {
        res.json(session);
    }
    else {

        const email = req.body.email;
        const password = req.body.password

        const nutriverse = client.db("nutriverse");
        const users = nutriverse.collection("users");

        users.findOne({ email: email }).then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result == true) {
                        req.session.authenticated = true;
                        req.session.user = {
                            _id: user._id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            is_nutritionist: user.is_nutritionist
                        };
                        res.cookie("sid", "ciao")
                        res.send("logged in")
                    }
                    else {
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
        res.send(req.session);
    }
    else {
        res.send("")
    }
})



app.post("/register", upload.any(), async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, saltRounds);
    const is_nutritionist = req.body.is_nutritionist === "false" ? false : true;
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    const exist = await check(users, email).catch(console.dir);
    var error = false;
    if (exist < 1) {
        var data = ""
        if (!is_nutritionist) {
            data = {
                "firstname": firstname,
                "lastname": lastname,
                "email": email,
                "password": password,
                "is_nutritionist": false
            }
        }
        else {
            if (req.files[0].mimetype !== "application/pdf") {
                error = true;
            }
            else {
                data = {
                    "firstname": firstname,
                    "lastname": lastname,
                    "email": email,
                    "password": password,
                    "is_nutritionist": true,
                    "country": req.body.country,
                    "city": req.body.city,
                    "address": req.body.address,
                    "filename": req.files[0].filename,
                    "verified": false
                }
            }
        }
        if (!error) {
            users.insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                client.close();
                });
                const mailOptions = {
                    from: '"Nutriverse" <nutriverse@gmail.com>',
                    to: email,
                    subject: 'Welcome to Nutriverse!',
                    text: 'Your registration has been completed successfully!',
                    html: '<img src="cid:logo" style="width:300px; margin:10px;"/></br><b>Your registration has been completed successfully!</b></br><b>You can now login and search for a nutritionist near you!</b>',
                    attachments: [{
                        filename: 'logo-removebg-preview.png',
                        path: '../src/assets/logo-removebg-preview.png',
                        cid: 'logo' //same cid value as in the html img src
                    }]
                };
                const sendMail = async (transporter, mailOptions) => {
                    try {
                        await transporter.sendMail(mailOptions);
                        console.log('email inviata');
                    }catch(error){
                        console.log(error)
                    } 
                };
                sendMail(transporter, mailOptions);
        
            res.send("user registered");
        }
       else {
           res.send("wrong type format")
        }
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
    const result = await users.find({}).toArray();
    res.send(result);
});

app.post('/approve_nutritionist', async (req, res) => {
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    var myquery = { email: req.body.email };
    var newvalues = { $set: { verified: true } };
    users.updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        nutriverse.close();
    });
    res.send("verified");

})

app.post('/reject_nutritionist', async (req, res) => {
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    var myquery = { email: req.body.email };
    var newvalues = { $set: { verified: true } };
    users.deleteOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        nutriverse.close();
    });
    res.send("rejected");

})


app.post('/get_certificate', upload.any(), async (req, res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.download(__dirname + "/files/" + req.body.filename);
})




app.listen(4000,
    () => {
        console.log(
            'Our express server is up on port 4000'
        );
    });


async function check(users, email) {
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




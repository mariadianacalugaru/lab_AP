// Importing express module
const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
var amqp = require('amqplib/callback_api');
var mongoose = require('mongoose');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb' }));
app.set('trust proxy', 1);
app.enable('trust proxy')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'triviastack@gmail.com',
	    pass: 'oceq atgs lajc hmfp'
    }
});

const corsOptions = {
    origin: ["https://localhost:443","http://localhost:5174","http://localhost:3000", "https://nutriverse"],
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

function compute_chat_id(user1,user2){
    var array_of_users = [user1,user2];
    array_of_users.sort();
    var chat_id = array_of_users[0]+'/'+array_of_users[2]
    return chat_id;
}

const bcrypt = require('bcrypt');
const session = require('express-session')
var ObjectId = require('mongodb').ObjectId; 
const saltRounds = 10;
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: 'mongodb://root:example@mongodb:27017/nutriverse?authSource=admin',
    collection: 'mySessions'
});

// Catch errors
store.on('error', function (error) {
    console.log(error);
});

app.use(
    session({
        secret: "some secret",
        cookie: { maxAge: 60000 * 200, sameSite:"none", secure: true},
        saveUninitialized: false,
        store: store,
        resave: true
    })
);


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { MongoClient } = require('mongodb');
const uri = "mongodb://root:example@mongodb:27017/nutriverse?authSource=admin";
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
                console.log("user trovato")
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result == true) {
                        req.session.authenticated = true;
                        req.session.user = {
                            _id: user._id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            is_nutritionist: user.is_nutritionist,
                            image: user.image
                        };
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
        res.send("No account")
    }
})



app.post('/get_reservations', upload.any(), async (req, res) => {
    if (!req.session.authenticated) {
        res.send("not logged")
    }
    else {
        const nutriverse = client.db("nutriverse");
        const users = nutriverse.collection("bookings");
        const result = await users.find({ nutritionist: req.body.nutritionist }, { projection: { _id: 0, date: 1 } }).toArray();
        console.log(result)
        res.send(result);
    }
});

app.post('/get_patients', upload.any(), async (req, res) => {
    if (req.session.authenticated) {
        const email = req.session.user.email;
        const nutriverse = client.db("nutriverse");
        const users = nutriverse.collection("users");
        const result = await users.find({ email: email }, { projection: { list_patients: 1 } }).toArray();
        console.log(result)
        res.send(result);
    }
    else {
        res.send("not logged")
    }
});

app.get("/measurements", async (req, res) => {
    if (req.session.authenticated) {
        const nutriverse = client.db("nutriverse");
        const measurements = nutriverse.collection("measurements");
        var query;
        if (req.session.user.is_nutritionist) {
            query = { nutritionist: req.session.user.email, patient: req.query.patient }
            const result = await measurements.find(query, {}).toArray();
            if (result.length == 0) {
                res.send("no measurements")
            }
            else {
                res.send(result[0])
            }
        }
        else {
            query = { patient: req.session.user.email}
            const result = await measurements.find(query, {}).toArray();
            if (result.length == 0) {
                res.send("no measurements")
            }
            else {
                res.send(result[0])
            }
        }
    }
    else {
        res.send("not logged")
    }


});

app.post('/add_measurements', async (req, res) => {
    if (req.session.authenticated) {
        const nutriverse = client.db("nutriverse");
        const measurements = nutriverse.collection("measurements");
        var email_nutr = req.session.user.email;
        const exist = await check_measurements(measurements, email_nutr, req.body.patient)
        console.log(exist)
        if (exist >= 1) {
            var query = {
                nutritionist: email_nutr,
                patient: req.body.patient
            
            };
            var new_value = {
                $push: {
                        date: req.body.date,
                    weight: req.body.weight,
                    body_fat: req.body.body_fat,
                        lean_mass: req.body.lean_mass,
                        waist: req.body.waist,
                        hips: req.body.hips,
                        right_tight: req.body.right_tight,
                        left_tight: req.body.left_tight,
                        chest: req.body.chest
                }
            };
            measurements.updateOne(query, new_value, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                nutriverse.close();
            });
        }
        else {
            var value = {
                nutritionist: email_nutr,
                patient: req.body.patient,
                date: [req.body.date],
                weight: [req.body.weight],
                body_fat: [req.body.body_fat],
                lean_mass: [req.body.lean_mass],
                waist: [req.body.waist],
                hips: [req.body.hips],
                right_tight: [req.body.right_tight],
                left_tight: [req.body.left_tight],
                chest: [req.body.chest]
            }
            measurements.insertOne(value, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                nutriverse.close();
            });
        }
        res.send("done")
    }
    else {
        res.send("not logged")
    }
});

app.post('/add_review', async (req, res) => {
    if (req.session.authenticated) {
        const star = Number(req.body.star);
        const review = req.body.review;
        const nutritionist = req.body.nutritionist;
        var data = {
            firstname: req.session.user.firstname,
            lastname: req.session.user.lastname,
            image: req.session.user.image,
            email_user: req.session.user.email,
            nutritionist: req.body.nutritionist,
            star: star,
            comment: review
        }
        const nutriverse = client.db("nutriverse");
        const reviews = nutriverse.collection("reviews");
        reviews.insertOne(data, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            nutriverse.close();
        });
        res.send("review inserted")
    }
    else {
        res.send("not logged");
    }

});

app.get('/get_reviews', async (req, res) => {
    if (req.session.authenticated) {
        const nutriverse = client.db("nutriverse");
        const reviews = nutriverse.collection("reviews");
        console.log("ciaooooooooo")
        console.log(req.query)
        var query = { nutritionist: req.query.email };
        const result = await reviews.find(query, {}).toArray();
        console.log(result)
        res.send(result)
    }
    else {
        res.send("not logged");
    }
});




app.post("/add_reservation", upload.any(), (req, res) => {
    
    if (req.session.authenticated) {
        console.log(req.body)
        const email_user = req.session.user.email;
        const name_user = req.session.user.firstname;
        const lastname_user = req.session.user.lastname;
        const email_nutr = req.body.email_nutritionist;
        const date = req.body.date;
        const nutriverse = client.db("nutriverse");
        const bookings = nutriverse.collection("bookings");
        var reservation = { "user":email_user,
        "nutritionist": email_nutr,
        "date":date,
        "name_user": name_user,
        "lastname_user": lastname_user,
        "name_nutr": req.body.name_nutritionist,
        "lastname_nutr": req.body.surname_nutritionist,
        "address_nutr": req.body.address_nutritionist,
        "city_nutr": req.body.city_nutritionist,
        "country_nutr": req.body.country_nutritionist
    };
        bookings.insertOne(reservation, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            nutriverse.close();
        });
        const users = nutriverse.collection("users");
        var query_user = { email: email_user };
        var new_value_user = { $set: { nutritionist: email_nutr } };
        users.updateOne(query_user, new_value_user, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            nutriverse.close();
          });
        var query_nutr = { email: email_nutr };
        var new_value_nutr = { $addToSet: { list_patients: { patient: email_user, name: name_user, lastname: lastname_user } } };
        users.updateOne(query_nutr, new_value_nutr, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            nutriverse.close();
          });
    };
    res.send("booking accepted")
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
                    "verified": false,
                    "image":  ""
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

app.post("/update_user", async (req,res) => {
    console.log("richiesta arrivata");
    console.log(req.body)
    const email = req.body.email;
    const image = req.body.image;
    const password = req.body.password;
    const city = req.body.city;
    const address = req.body.address;
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    var query_user = { email: email};
    
    if (JSON.parse(req.body.image).base64 !== ""){
        req.session.user.image = image;
        var new_value_user = { $set: { image: image} };
        users.updateOne(query_user, new_value_user, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");
                nutriverse.close();
            });
    }
    if(password != ""){
        const hashed_password = await bcrypt.hash(password, saltRounds);
        var new_value_user = { $set: { password: hashed_password} };
        users.updateOne(query_user, new_value_user, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");
                nutriverse.close();
            });
    }
    if(city != ""){
        var new_value_user = { $set: { city: city} };
        users.updateOne(query_user, new_value_user, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");
                nutriverse.close();
            });
    }
    if(address != ""){
        var new_value_user = { $set: { address: address} };
        users.updateOne(query_user, new_value_user, function(err, res) {
            if (err) throw err;
                console.log("1 document updated");
                nutriverse.close();
            });
    }
    res.send("user updated")
});



app.post("/logout", (req, res) => {
    res.clearCookie("connect.sid")
    req.session.destroy();
    res.send('Ok.');
});

app.get('/search_nutritionists', async (req, res) => {
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    const result = await users.find().toArray();
    res.send(result);
});

app.get('/search_nutritionists_cities', async (req, res) => {
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    const query = { is_nutritionist: true, verified: true}
    const cities = await users.find(query, { projection: {_id:0, city:1} }).toArray();

    let result = [];
    cities.forEach(element => {
        if (!result.includes(element.city)) {
            result.push(element.city);
        }
    });
    
    console.log(result)
    console.log(typeof(result))
    res.send(result)
});


app.get('/info_nutritionist', async (req, res) => {
    const nutr = { email: req.query.email }
    const nutriverse = client.db("nutriverse");
    const users = nutriverse.collection("users");
    const result = await users.find(nutr, { projection: { _id: 0, firstname: 1, lastname:1, email:1,country:1,city:1, address:1,image:1 } }).toArray();
    console.log(result[0])
    res.send(result[0])
});


app.get('/get_appointments', async (req, res) => {
    if (req.session.authenticated) {
        const nutriverse = client.db("nutriverse");
        const bookings = nutriverse.collection("bookings");
        var query;
        query = { nutritionist: req.session.user.email }
        const result = await bookings.find(query, { projection: { _id: 0} }).toArray();
        console.log(result)
        res.send(result)
    }
    else {
        res.send("not logged");
    }
});

app.get('/get_rating', async (req, res) => {
    if (req.session.authenticated) {
        const nutriverse = client.db("nutriverse");
        const bookings = nutriverse.collection("reviews");
        var query;
        query = { nutritionist: req.query.email }
        const result = await bookings.find(query, { projection: { _id: 0, star: 1 } }).toArray();
        var rating = 0
        if (result.length != 0) {
            
            for (var i = 0; i < result.length; i++){
                rating += result[i].star;
            }
            let x = (rating / (result.length)).toString()
            res.send(x)
        }
        else {
            res.send("no rating")
        }
    }
    else {
        res.send("not logged");
    }
});

app.get('/fetch_appointments', async (req, res) => {
    if (req.session.authenticated) {
        const nutriverse = client.db("nutriverse");
        const bookings = nutriverse.collection("bookings");
        var query;
        query = { user: req.session.user.email }
        const result = await bookings.find(query).toArray();
        res.send(result)
    }
    else {
        res.send("not logged");
    }
})
app.get('/delete_appointment/',async (req,res)=>{
    if(req.session.authenticated){
        const nutriverse = client.db("nutriverse");
        const bookings = nutriverse.collection("bookings");
        console.log(req.query.id);
        var o_id = new ObjectId(req.query.id);
        var query = { _id: o_id }
        console.log(query)
        bookings.deleteOne(query, function (err, res) {
            if (err) throw err;
            console.log("1 document deleted");
            nutriverse.close();
        });
        console.log("appointment deleted")
        res.send("appointment deleted")
    }
    else{
        res.send("not logged")
    }
})
app.get('/myappointments', async (req, res) => {
    if (req.session.authenticated) {
        const nutriverse = client.db("nutriverse");
        const bookings = nutriverse.collection("bookings");
        var query;
        if (req.session.user.is_nutritionist) {
            query = { user: req.query.patient }
            const result = await bookings.find(query, { projection: { _id: 0, date: 1, nutritionist: 1 } }).toArray();
            res.send(result)
        }
        else {
            query = { user: req.session.user.email }
            const result = await bookings.find(query, { projection: { _id: 0, date: 1, nutritionist: 1 } }).toArray();
            res.send(result)
        }
    }
    else {
        console.log("not logged")
        res.send("not logged");
    }
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

app.post('/send_message/:destination', async (req,res)=>{
    // Not yet implemented 
})



app.get('/fetch_messages/:destination',async (req,res)=>{
    if(req.session.authenticated){
        var from_string = JSON.stringify(req.session.user._id);
        from_string = from_string.substring(1,from_string.length-1);
        var destination = req.params.destination;
        
        amqp.connect('amqp://localhost',(error0,connection)=>{
                if (error0) throw error0;
                connection.createChannel((error1,channel)=>{
                    if(error1) throw error1;
                    var queue = compute_chat_id(from_string,destination);
                    channel.assertQueue(queue,{
                        durable:true,
                    });
                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
                    channel.consume(queue,(msg)=>{
                        console.log("Received %s",msg.content.toString());
                    },{
                        noAck: false
                    });
                });
            }
        )
    }
    else{
        res.send("not authenticated!");
    }
    
})

app.get("/chat_history", async(req,res)=>{
    if(req.session.authenticated){
        const nutriverse = client.db("nutriverse");
        const chat_history = nutriverse.collection("chat_history");
        var from_string = JSON.stringify(req.session.user._id);
        from_string = from_string.substring(1,from_string.length-1);

        var selector = {from:from_string};
        var options = {};
        var result = await chat_history.findOne(selector,options);
        res.send(result);
    }
    else{
        res.send("Not Authenticated!")
    }
})

app.post("/add_user_to_hystory/:destination", async(req,res)=>{

    if(req.session.authenticated){
        const nutriverse = client.db("nutriverse");
        const chat_history = nutriverse.collection("chat_history");
        var from_string = JSON.stringify(req.session.user._id);
        from_string = from_string.substring(1,from_string.length-1);
        var selector = {from:from_string};
        var options={}
        var result = await chat_history.findOne(selector,options);
        var response = {error:"an unexpected error happened"}
        
        if(result==null){
            var to_insert = {from:from_string, history_list:[req.params.destination]}
            chat_history.insertOne(to_insert,(err,result)=>{
                if(err) throw err;
                
            })
            response = {OK:"userlist created"}
        }
        else{
            var des_searched = result.history_list.find((element)=>element === req.params.destination);
            if (des_searched ==null){
                to_insert = result;
                to_insert.history_list.push(req.params.destination);

                await chat_history.replaceOne(selector,to_insert);
                
            }
            response = {OK:"user appended to userlist"}
        }
        res.send(response);
        
        //res.send("something gone wrong")

    }
    else{res.send("user not authenticated!")}
    

})

app.post('/get_certificate', upload.any(), async (req, res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.download(__dirname + "/files/" + req.body.filename);
})


app.get('/search_food', async (req, res) => {
    const nutriverse = client.db("nutriverse");
    const food = nutriverse.collection("food");
    const result = await food.find({}).toArray();
    res.send(result);
});

app.post('/save_foodplan', upload.any(), async (req,res) => {
    
    if (req.session.authenticated){
        const nutritionist = req.session.user.email;
        const patient = req.body.patient;
        const foodplan = JSON.parse(req.body.foodplan);
        const date = new Date();
        
        console.log(foodplan);
        const nutriverse = client.db("nutriverse");
        const foodplans = nutriverse.collection("foodplans");
        var data = {
            "nutritionist" : nutritionist,
            "patient" : patient,
            "foodplan" : foodplan,
            "date": date
        }
        foodplans.insertOne(data,function(err,res){
            if (err) throw err;

            client.close();
        })
        res.send("Food Plan inserted");
    }
    else{
        res.send("Not logged");
    }
});

app.get('/userId', (req, res) => {
    if (req.session.authenticated) {
        res.send(req.session.user);
    }
    else {
        res.send("no user authenticated")
    }
})



app.get("/get_foodplan", async (req, res) => {
    if (req.session.authenticated) {
        const email = req.session.user.email;
        const nutriverse = client.db("nutriverse");
        const foodplans = nutriverse.collection("foodplans");
        const my_plans = await foodplans.find({ patient: email }).toArray();
        console.log(my_plans)
        if (my_plans.length > 0) {
            const most_recent = my_plans.reduce(function(doc1, doc2) {
                return doc1.data > doc2.data ? doc1 : doc2;
            });
            const result = {
                    "user": req.session.user,
                    "foodplan": most_recent
            }
            res.send(result);
            }
        else{
            res.send("no foodplan yet")
        }
        
    }
    else {
        res.send("no user authenticated")
    }
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


async function check_measurements(measurements, nutritionist,patient) {
    try {

        // Get the database and collection on which to run the operation

        // Query for a movie that has the title 'The Room'
        const query = {
            "nutritionist": nutritionist,
            "patient": patient
         };
        // Execute query
        const len = await measurements.countDocuments(query);
        // Print the document returned by findOne()
        return len;
    } catch {
        console.log("errore")
    }
}



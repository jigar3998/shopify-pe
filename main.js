require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { route } = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 4000

// Configuring mongoDB
mongoose.connect(process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

//Connecting to Database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(express.urlencoded({extended: false}));
app.use(express.json())

// Initializing Session
app.use(session({
    secret:"My secret key",
    saveUninitialized:true,
    resave:false
}))

app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

app.use(express.static('uploads'))

//Using template engine
app.set("view engine","ejs")

app.use("",require("./routes/routes"))

app.listen(PORT,()=>{
    console.log(`Server started at Port: ${PORT}`)
})
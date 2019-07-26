const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./api/routes/user');
const homeRoutes = require('./api/routes/home');

let PORT = process.env.PORT || 3000;

//Dotenv config
require('dotenv').config();

//Connection to the database
mongoose.connect(process.env.CON_STRING,{useNewUrlParser : true})
        .then(() => console.log("connected to the database"))
        .catch(err => console.log(err));

//Setting up Express body parser
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//Handling CORS Errors
app.use(cors());

//Setting uploads static folder
app.use("/uploads",express.static("uploads"));

//Setting Routes
app.use("/api/user",userRoutes);
app.use("/api/home",homeRoutes);

//Setting angular client static folder
app.use(express.static("client"));

app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(PORT , () => console.log(`Now listening to port ${PORT}`));
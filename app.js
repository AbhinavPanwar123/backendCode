var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const authRouter = require ('./controller/auth')
var app = express();
const cors = require('cors');
require('./config/database');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/uploads', express.static(path.join(__dirname,'uploads'))); 


module.exports = app;

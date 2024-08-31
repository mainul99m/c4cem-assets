const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');


const port = process.env.PORT || 5002;


const server = app.listen(port, () => {
    console.log(' Server is up on port ' + port + '...');
})
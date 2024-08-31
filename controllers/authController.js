const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/customError');
const util = require('util');
const axios = require('axios');

exports.protect = asyncErrorHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization;
    }

    if(!token){
        return next(new CustomError('You are not logged in! Please log in to get access', 401));
    }

    const url = `${process.env.AUTH_SERVICE_URL}/users`;


    axios.get(url, {
        headers: {
            Authorization: token
        }
    }).then(response => {
        if(response.data.status === 'success'){
            return next();
        } else{
            next(new CustomError('You are not logged in! Please log in to get access', 401));
        }
    }).catch(error => {
        console.log(error);
        return next(new CustomError('Something went wrong', 500));
    });
});
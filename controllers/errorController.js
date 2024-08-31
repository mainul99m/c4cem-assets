const { error } = require('console');
const CustomError = require('./../utils/customError');

const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
}

const prodError = (err, res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }else{
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
}

const castErrorHandler = (err) => {
    const message = `Invalid value for ${err.path}: ${err.value}`;
    return new CustomError(message, 400);
}

const duplicateKeyErrorHandler = (err) => {
    const message = `Duplicate field value entered: ${err.keyValue.name}`;
    return new CustomError(message, 400);
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new CustomError(message, 400);
}

const jwtWebtokenErrorHandler = (err) => {
    const message = `Invalid token. Please Login again`;
    return new CustomError(message, 401);
}

const expiredJWTErrorHandler = (err) => {
    const message = `Your token has expired! Please log in again.`;
    return new CustomError(message, 401);
}


module.exports = (error, req, res, next) => {
    
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devError(error, res);
    }else if(process.env.NODE_ENV === 'production'){
       
        if(error.name === 'CastError') error = castErrorHandler(error);
        if(error.code === 11000) error = duplicateKeyErrorHandler(error);
        if(error.name === 'ValidationError') error = validationErrorHandler(error);
        if(error.name === 'JsonWebTokenError') error = jwtWebtokenErrorHandler(error);
        if(error.name === 'TokenExpiredError') error = expiredJWTErrorHandler(error);

        prodError(error, res);
    }
}
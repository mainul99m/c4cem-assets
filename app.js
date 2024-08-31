const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const imageRouter = require('./routes/imageRouter');
const mapRouter = require('./routes/mapRouter');
const fileUpload = require('express-fileupload');

let app = express();

app.use(express.json());
app.use(fileUpload({
    createParentPath: true
}));

app.use('', imageRouter);
app.use('/maps', mapRouter);

app.all('/*' , (req, res, next) => {
    console.log('Hello from the middleware');
    res.status(404).sendFile(`${__dirname}/public/404.html`);
});

app.use(globalErrorHandler);


module.exports = app;
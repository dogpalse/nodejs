const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.set('port', PORT);

// Logger Middleware
// [HTTP Method] [URL] [HTTP Status] [Response Rate] - [Response Byte]
app.use(logger('dev'));

// Sample Middleware
app.use((req, res, next) => {
    console.log('Middleware at all request');
    next();
});

// Static Files Supply Middleware
app.use('/', express.static(path.join(__dirname, 'public')));

// Body-Parser Middleware
// Form Data or AJAX Request to req.body Object
app.use(express.json());                                // JSON 형식으로 데이터 전달
// extended가 false = node의 querystring 모듈 사용
// extended가 true = qs 모듈 사용
app.use(express.urlencoded({ extended: false }));       // 주소 형식(Ex. Form Data)으로 데이터 전달

// Cookie-Parser Middleware
app.use(cookieParser(process.env.COOKIE_SECRET));

// Express-Session Middleware
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'song'
}));

app.get('/', (req, res, next) => {
    // res.send('Welcome Node Server...!');
    console.log('Middleware at GET "/" requset');
    res.sendFile(path.join(__dirname, 'public/index.html'));
//     next();
// }, (res, req) => {
//     throw new Error("Happen Error...!");
});


// Error Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
})

app.listen(app.get('port'), () => {
    console.log(`${PORT}에 연결되었습니다.`);
});
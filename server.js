const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('port', PORT);

// Sample Middleware
app.use((req, res, next) => {
    console.log('Middleware at all request');
    next();
});

app.get('/', (req, res, next) => {
    // res.send('Welcome Node Server...!');
    console.log('Middleware at GET "/" requset');
    res.sendFile(path.join(__dirname, 'index.html'));
    next();
}, (res, req) => {
    throw new Error("Happen Error...!");
});


// Error Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
})

app.listen(app.get('port'), () => {
    console.log(`${PORT}에 연결되었습니다.`);
});
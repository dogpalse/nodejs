const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('port', PORT);

app.get('/', (req, res) => {
    // res.send('Welcome Node Server...!');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`${PORT}에 연결되었습니다.`);
});
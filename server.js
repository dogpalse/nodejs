const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('port', PORT);

app.get('/', (req, res) => {
    res.send('Welcome Node Server...!');
});

app.listen(app.get('port'), () => {
    console.log(`${PORT}에 연결되었습니다.`);
});
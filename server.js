const express = require('express');
const app = express();

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/public/index.html');
});

app.post('/',(req,res) => {
    res.send('Request has been successful in receiving.');
});

app.listen(8000, () => {
    console.log('Server has started');
});
// IMPORTING PACKAGES
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const items = ['Buy a hat', 'Sell the cat'];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));

const port = 8000;
const unit = "metric";

app.get('/', (req, res) => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US',options);
    res.render('index', { date: formattedDate, items: items });
});

app.post('/', (req, res) => {
    const newTodo = req.body.newTodo;
    items.push(newTodo);
    res.redirect('/');
});

app.listen(process.env.PORT || port, () => {
    console.log('Server has started');
});
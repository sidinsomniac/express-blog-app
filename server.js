const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get('/bmiCalculator', (req,res) => {
    res.sendFile(__dirname+'/public/bmiCalculator.html');
});

app.post('/bmiCalculator',(req,res) => {
    console.log(req.body);
    let weight = +req.body.weight;
    let height = (+req.body.height)/100;
    let sqheight = height**2;
    let bmi = weight/sqheight;
    res.send('Your BMI is '+ Math.round(bmi));
});

app.listen(8000, () => {
    console.log('Server has started');
});
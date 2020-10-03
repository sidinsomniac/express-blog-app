// IMPORTING PACKAGES
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const port = 8000;
const unit = "metric";
const apiKey = "9e7092e0dd7af0b3b8a05e1839333fd1";
const endPoint = "https://api.openweathermap.org/data/2.5/weather";
let queryParams;
let weatherUrl;

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/', (req, res) => {
    // RECEIVING PARAM ENTERED BY CLIENT
    let cityName = req.body.cityName;

    // SETTING UP DATA TO SEND TO OPENWEATHER API
    queryParams = "?q=" + cityName + "&units=" + unit + "&appid=" + apiKey;
    weatherUrl = endPoint + queryParams;

    // FETCHING DATA FROM OPEN WEATHER API
    https.get(weatherUrl, response => {
        response.on("data", data => {
            res.write("<h1>The weather is currently in a " + JSON.parse(data).weather[0].main + " condition</h1>");
            res.write("<h2>Temperature at " + cityName + " is " + JSON.parse(data).main.temp + " degrees Celcius</h2>");
            res.write(`<img src="http://openweathermap.org/img/wn/${JSON.parse(data).weather[0].icon}@2x.png">`);
            res.send();
        })
    })
});

app.listen(port || process.env.port, () => {
    console.log('Server has started');
});
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){

    const zip = req.body.zipCode;
    const apiKey = "20481e5fa4aec968a8bd103e3fc55fde";
    const unit = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data)
            console.log(weatherData)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            var weatherEmoji = ""

            if (temp < 60) {
                weatherEmoji = "<img src='https://em-content.zobj.net/thumbs/120/apple/354/cold-face_1f976.png'>";
            }
            else if (temp >= 60 && temp <= 80) {
                weatherEmoji = "<img src='https://em-content.zobj.net/thumbs/120/apple/354/smiling-face-with-sunglasses_1f60e.png'>";
            }
            else {
                weatherEmoji = "<img src='https://em-content.zobj.net/thumbs/120/apple/354/hot-face_1f975.png'>";
            }

            res.write("<h1>The temperature for your area is " + temp + " degrees. " + weatherEmoji + "</h1>");
            res.write("<p>The weater is currently " + weatherDescription + "</p>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        })
    });

});


app.listen(6001, function() {
    console.log("Server is running on port 6001."); 
})
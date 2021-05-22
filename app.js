require("dotenv").config();
const express = require("express");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log("Post request received for " + req.body.cityName);

  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=metric";
  https.get(url, function (response) {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const icon = weatherData.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        res.write(
          "<h1>Temperature in " +
            query +
            " is " +
            weatherData.main.temp +
            " degree Celcius</h1>"
        );
        res.write(
          "<h1>Weather condition: " +
            weatherData.weather[0].description +
            "</h1>"
        );
        res.write("<img src=" + iconURL + "></img>");
        res.send();
      });
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT, function () {
  console.log("Server is running on port " + process.env.PORT);
});

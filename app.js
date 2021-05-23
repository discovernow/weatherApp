require("dotenv").config();
const express = require("express");
const https = require("https");
const app = express();

//Using EJS
app.set("view engine", "ejs");

//CSS files
app.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//Home/Main Page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//Function to capitalize first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

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
        res.render("index", {
          cityName: capitalize(query),
          tempCity: weatherData.main.temp,
          weatherCity: capitalize(weatherData.weather[0].description),
          weatherImg: iconURL,
        });
      });
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

//Error page redirecting to retry-home page
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT, function () {
  console.log("Server is running on port " + process.env.PORT);
});

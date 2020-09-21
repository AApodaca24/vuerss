const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require('./config/db')
const { parseRss, storeRss, getRss } = require('./controllers/rss')

dotenv.config();

connectDB();

// INit Apvariable
const app = express();

//COnfigure middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/rss', (req, res) => {
    parseRss(req, res)
})

app.get('/rss', (req, res) => {
  getRss(req, res)
})

app.post('/rss/store', (req, res) => {
  storeRss(req,res)
})

//Serve vue app
if (process.env.NODE_ENV === "prod") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
}

//Routes



const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
  )
);

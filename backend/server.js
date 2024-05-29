const express = require("express");
const cors = require("cors");
const connectDB = require('./connection');
const userRouter = require("./routes/userRoute");
const recipesRouter = require("./routes/recipeRoute");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4001;

app.use(cors({
  origin: [`http://localhost:${process.env.PORT || 4001}`, "https://recipe-app-1-8uxq.onrender.com"], // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
  credentials: true // If you need to allow cookies and other credentials
}));


app.use(express.json());


app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


connectDB();


app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

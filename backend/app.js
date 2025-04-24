import express from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js"
import connectDB from "./config/database.js";
import logger from "./middleware/logger.js";
import cors from 'cors';




dotenv.config();

const app = express();

connectDB();
// logger le chai request ko information haru lai console ma print garxa
app.use(logger); // hamile yaha logger middleware lai global level ma use gareko xau but yeslai hamile specific route ma ni use garna sakinxa
app.use(cors());
// yesle chai hamile json data lai parse garera req.body ma store garxa
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.get("/", (_, res) => {
  res.json({
    status: "OK",
    version: "1.0.0",
    port: port,
  });
});


app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`Server started at port ${port}...`);
});

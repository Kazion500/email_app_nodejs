const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const { validate, sendEmail } = require("./helper");
const PORT = process.env.PORT || 4000;
require("dotenv").config();
const app = express();

// Middleware
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

// Requests and Response
app.get("/api", async (req, res) => {
  res.send("welcome");
});

app.post("/api", async (req, res) => {
  const { email, message, fullname } = req.body;

  const error = validate({
    email,
    message,
    fullname,
  });

  if (Object.keys(error.errors).length) {
    return res.status(400).send(error);
  }

  const subject = `SHARED PROPZI LISTING`;
  let templateBody = `${message}`;

  try {
    const response = await sendEmail(
      templateBody,
      subject,
      "Shared The Link!!"
    );

    return res.status(200).send({ message: response.message, success: true });
  } catch (error) {
    res.status(500).send({ error: error.message, success: false });
  }
});

app.listen(PORT, () => {
  console.log("Connected on port " + PORT);
});

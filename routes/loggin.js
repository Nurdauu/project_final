// routes/login.js

const express = require("express");
const db = require("../data/database");
const loginRouter = express.Router();

loginRouter.post("/getdata", async function (req, res) {
  const { gmaildata, passworddata } = req.body;
console.log("Executing query:", "SELECT * FROM register WHERE gmail = ? AND password = ?", [req.body.gmaildata, req.body.passworddata]);
  try {
    const dbConnection=db.getPool();
    const user = await dbConnection.query(
      "SELECT *FROM register WHERE gmail = ? AND password = ?",
      [req.body.gmaildata, req.body.passworddata]
    );
    if (user[0].length > 0) {
      // Authentication successful
      req.session.user = user[0]; // Save user information in session
      res.redirect("/1"); // Redirect to the dashboard or wherever appropriate
      console.log(user.length);

    } else {
      // Authentication failed
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during user authentication:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = loginRouter;

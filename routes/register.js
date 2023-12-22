// Assuming you have a separate router for user registration, e.g., userRouter

const express = require("express");
const db = require("../data/database");
const userRouter = express.Router();

userRouter.post("/retrieve", async function (req, res) {
  const { username, gmail, password } = req.body;

  try {
    // Assuming id is auto-incremented and doesn't need to be specified in the query
    const dbConnection=db.getPool();
    await dbConnection.query(
      "INSERT INTO register (username, gmail, password) VALUES (?, ?, ?)",
      [req.body.username, req.body.gmail, req.body.password]
    );

    // Assuming you want to redirect after registration
    res.redirect("/login"); // Redirect to the login page or wherever appropriate
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = userRouter;

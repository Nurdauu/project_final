const fs = require("fs");
const path = require("path");
const http = require("http");
const session = require("express-session");
const express = require("express");
const socketio = require("socket.io");
const uuid = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const observers = [];

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("WebSocket connection established.");
  socket.emit("new-restaurant", message);

  // Add the new WebSocket connection to the observers array
  observers.push(socket);

  // Listen for messages from the client
  socket.on("message", (message) => {
    console.log("Received message:", message);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket connection closed.");

    // Remove the closed WebSocket connection from the observers array
    const index = observers.indexOf(socket);
    if (index !== -1) {
      observers.splice(index, 1);
    }
  });
});

const blogRoutes = require("./routes/register");
const AuthRoutes = require("./routes/loggin");
const { message } = require("statuses");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "your-secret-key", // Change this to a strong, secret key
    resave: true,
    saveUninitialized: true,
  })
);

app.use(blogRoutes);
app.use(AuthRoutes);

app.locals.io = io;

app.get("/", function (req, res) {
  res.render("index");
});
app.get("/1", function (req, res) {
  res.render("indexcopy");
});

app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  for (const restaurant of storedRestaurants) {
    if (restaurant.id == restaurantId) {
      return res.render("restaurants-detail", { restaurant: restaurant });
    }
  }
  res.render("404");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  // Add the new restaurant to the array of stored restaurants
  storedRestaurants.push(restaurant);

  // Write the updated array back to the file
  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));

  // Notify observers about the new restaurant
  const message = JSON.stringify({ type: "new-restaurant", data: restaurant });
  const observers = req.app.locals.io.sockets.sockets;
  for (const observer of Object.values(observers)) {
    observer.emit("new-restaurant", message);
  }

  console.log("New restaurant is added!");
  res.redirect("/confirm");
});

// Serve static files (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, "public")));

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/logging", function (req, res) {
  res.render("logging");
});
app.get("/profile",function(req,res){
  res.render("profile");
})
app.get("/places",function(req,res){
  res.render("places");
})


app.use(function (req, res) {
  res.render("404");
});

app.use(function (error, req, res, next) {
  res.render("500");
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

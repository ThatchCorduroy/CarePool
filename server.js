const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dbConnection = require("./models"); // loads our connection to the mongo database
const passport = require("./passport");
const app = express();
const http = require('http')
const socket = require('socket.io')();
const PORT = process.env.PORT || 8080;
const path = require("path")


// ===== Middleware ====
app.use(morgan('dev'))
// app.use(
// 	bodyParser.urlencoded({
// 		extended: false
// 	})
// )
// app.use(bodyParser.json())
app.use(
	session({
		secret: process.env.APP_SECRET || 'this is the default passphrase',
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false,
		saveUninitialized: false
	})
)

// ===== Passport ====
app.use(passport.initialize())
app.use(passport.session()) // will call the deserializeUser

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: true, limit: '3mb', parameterLimit: 3000 }));
app.use(bodyParser.json({ limit: '3mb' }));
// Serve up static assets
//app.use(express.static("client/public"));
// ... other imports
//const path = require("path")

// ... other app.use middleware setups
app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {  
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/carpoolGuardian");
// console.log("DIRNAME", __dirname);
// app.get("/*", function (req, res) {
//   console.log("DIRNAME", __dirname);
//   res.sendFile(path.join(__dirname, "client/public/index.html"));
// });

// app.post("/createFaceSet", function (req, res) {
//   console.log(req.body);
// });

// Socket.io
// const server = http.createServer(app)
// const io = socketIO(server)

// io.on('connection', socket => {
// 	console.log("User connected")

// 	socket.on('disconnect', () => {

// 	})
// })
app.get("*", (req, res) => {  
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

//Socket.io
io = socket(server);

io.on('connection'), (socket) => {
	console.log("SOCKET ID", socket.id);

	socket.on("SEND_MESSAGE", function(data) {
		io.emit("RECEIVE_MESSAGE", data);
	})
}



// Start the API server
server = app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

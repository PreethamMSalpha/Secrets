//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require('md5');

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
	username: String,
	password: String
});



const User = mongoose.model("User", userSchema);

app.get("/",function(req,res){
	res.render("home");
});

app.get("/login",function(req,res){
	res.render("login");
});

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register", function(req, res){
	const newUser = new User({
		username: req.body.username,
		password: md5(req.body.password)
	});
	newUser.save(function(err){
		if (!err) {
			console.log("register successfully");
			res.render("secrets");
		} else {
			console.log(err);
		}
	});
});

app.post("/login", function(req, res){
	User.findOne({username: req.body.username}, function(err, foundUser){
		if (!err) {
			if (foundUser.password === md5(req.body.password)) {
				console.log("Login successful");
				res.render("secrets");
			} else {
				console.log("password incorrect");
			}
		} else {
			console.log("username not found");
		}
	});
});


app.listen(3000, function(){
   console.log("Server running on port 3000");
});

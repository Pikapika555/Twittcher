////////////////////
//GLOBAL VARIABLES//
////////////////////

var mongo = require('../routes/mongoR');
var fs = require('fs');
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = require('mongodb').pure().BSON,
	ObjectID = require('mongodb').ObjectID,	
	MongoClient = require('mongodb').MongoClient,
    ReplSetServers = require('mongodb').ReplSetServers,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    assert = require('assert');


/////////////////
//GET HOMEPAGE//
////////////////

//Render Index
exports.index = function(req, res){
RIndex(req, res, 0, 0);
};

//Render Profil
exports.profil = function(req, res){
	res.redirect('/profil/'+req.params.urlName+'/wall');
	// REDIRECT AUF WALL // OBERES STREICHEN ///////////
	///////////////////////////////////////////////////
};

//Render Wall
exports.wall = function(req, res){
	console.log("render Wall");
	CreateProfil(req, res, function(req, res, item){
		CreateWall(req, res, item, function(req, res, item, posts){
			RWall(req, res, item, posts);
		});
	});
};

//Render Search
exports.search = function(req, res){
res.render('Tabs/search', { title: 'search', username: req.session.username });
//url.resolve('http://example.com/', '/one')
};

//Render ProfilOverview
exports.profiles = function(req, res){
	CreateProfil(req, res, function(req, res, item){
		CreateProfiles(req, res, item, function(req, res, item, profiles){
			RProfiles(req, res, item, profiles);
		});
	});
};


/////////////////
//POST HOMEPAGE//
/////////////////

exports.home_post_handler = function(req, res, data) {

	if(req.body.username){
		logIn(res, req, data);
	}
	else if(req.body.R_username){
		regIt(res, req, data);
	}
	else{
		console.log("error");
		RIndex(req, res, 0, 0);
		//res.send("bla")
	}

    
};

exports.Register = function(req, res, data){

		if(req.files.R_picture.type == "image/jpeg"){
			var tmp_path = req.files.R_picture.path;
			var target_path = './public/pictures/' + req.files.R_picture.name;
			fs.rename(tmp_path, target_path, function(err) {
				if (err) throw err;
				fs.unlink(tmp_path, function() {
					if (err) throw err;
					///////////BILD UMBENENNEN IN USERNAME
				});
			});
			var profil = {name: req.body.R_username
				, pass: req.body.R_password
				, email: req.body.R_email
				, picture: req.files.R_picture.name };
		}	
		else{ var profil = {name: req.body.R_username
				, pass: req.body.R_password
				, email: req.body.R_email
				, picture: "http://placehold.it/200x250" }; 
		}
		
		regIt(res, req, profil);
};

exports.Posting = function(req, res, data){
	var time = new Date();
	time.toISOString();
	var message = {author: req.session.username
				, reciepient: req.params.urlName
				, time: time
				, message: req.body.postbox
				, likes: 0 };
	
	if(req.body.postbox){
		db.collection('postings', function(err, collection) {
			collection.insert(message, function(err, result) {
				if (err) {
					res.send({'error':'An error has occurred'});
				}
				else {
					console.log('Success: ' + JSON.stringify(result[0]));
				}
			});
		});
	}
	res.redirect('/profil/'+ message.reciepient + '/wall');
}

exports.Delete = function(req, res){
	switch(req.params.itemType){
		case "post":
			console.log(req.params.id);
			DeletePost(req, res, req.params.id);
	}
}

exports.logout = function(req, res){
	session.destroy();
	res.redirect('/');
}

//////////////////////
// Helper Functions //
//////////////////////

// Register at Server
function regIt(res, req, profil){

	if(profil.pass = req.body.R_password2){
		if(!userExist(profil.name)){
			db.collection('profiles', function(err, collection) {
				collection.insert(profil, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'An error has occurred'});
					} else {
						console.log('Success');
					}
				});
			});
		}
		else{
			console.log("Username Taken");
			RIndex(req, res, 0, "Username Taken");
		}
	}
	else{
		console.log("passwords dont match");
		RIndex(req, res, 0, "passwords dont match");
	}
};

// Check if User Exists
function userExist(name){
	db.collection('profiles', function(err, collection) {
		collection.findOne({'name': name}, function(err, item) {
			if(item){ return true; }
			else{ return false; }
		});
	});
}

// Logs in
function logIn(res, req, data){
	var name = req.body.username;
	var pass = req.body.password;
	console.log("checker");
	db.collection('profiles', function(err, collection) {
		collection.findOne({'name': name}, function(err, item) {
			if(item){
				console.log(item.pass);
				if(item.pass == pass){
					req.session.Pid = item._id;
					req.session.username = name;
					req.session.password = pass;
					console.log("Logged: "+req.body.username);
					console.log("rly: "+ name);
					res.redirect('/profil/'+ name);
				}
				else{
					console.log("wrong Pass");
					RIndex(req, res, "wrong Password", 0);
				}
			}
			else{
				console.log("username doesnt exist");
				RIndex(req, res, "username does NOT exist", 0);
			}
		});
	});
}

function CreateProfil(req, res, callback){
	db.collection('profiles', function(err, collection) {
		collection.findOne({'name': req.params.urlName}, function(err, item) {
			if(item){
				callback(req, res, item);
			}
			else{
			}
		});
	});
}

function CreateWall(req, res, item, callback){
	var actProfil = req.params.urlName;
	db.collection('postings', function(err, collection) {
		if(!err){
			collection.find({'reciepient': actProfil}).toArray( function(err, items) {
				if(!err){
					callback(req, res, item, items);
					
				}
				else{
					console.log("ERROR: "+err);
				}
			});
		}
		else{
			console.log("error")
		}
	});
}



function CreateProfiles(req, res, item, callback){
	db.collection('profiles', function(err, collection) {
		collection.find().toArray(function(err, profiles) {
			console.log(profiles);
			callback(req, res, item, profiles);
		});
	});
}

function DeletePost(req, res, id){
	var id = new ObjectID(id);
	db.collection('postings', function(err, collection) {
	
		collection.find({'_id': id}).toArray( function(err, items) {
			
			var item = items[0];
			if(item.reciepient == req.session.username || item.author == req.session.username){
				collection.remove({'_id': id}, {safe:true}, function(err, result){
					if(!err){
						console.log("Post Removed");
						res.redirect('/profil/'+req.params.currentProfil+'/wall');
					}
				}); 
			}
		});
	});
}




///////////////////////
// RENDER FUNCTIONS //
//////////////////////

//Render Index
function RIndex(req, res, lErr, rErr){
	res.render("index", {
		title: "Twittcher",
		username: req.session.username,
		_id: req.session.Pid,
		logError: lErr,
		regError: rErr
	});
}

//Render Profil

//Render Wall
function RWall(req, res, item, posts){
	res.render("Tabs/wall", {
		title: "Twittcher",
		username: req.session.username,
		_id: req.session.Pid,
		logError: 0,
		regError: 0,
		item: item,
		posts: posts
	});
}

//Render All Profiles Overview
function RProfiles(req, res, item, profiles){
	res.render("Tabs/profiles", {
		title: "Twittcher",
		username: req.session.username,
		_id: req.session.Pid,
		logError: 0,
		regError: 0,
		item: item,
		profiles: profiles
	});
}

function Safety(req,res){
	if(!req.session.username){res.redirect("/");}
}

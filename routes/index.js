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
	CreateSearch(req, res);
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
			var target_path = './public/pictures/p_' + req.body.R_username + '.jpg'; //   req.files.R_picture.name;
			fs.rename(tmp_path, target_path, function(err) {
				if (err) throw err;
				fs.unlink(tmp_path, function() {
					if (err) throw err;
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

exports.p_search = function(req, res){
	CreateSearch(req, res);
}

exports.Delete = function(req, res){
	var type = req.params.itemType;
	switch(type){
		case "post":
			DeletePost(req, res);
			break;
		case "profil":
			console.log("profil: "+type)
			console.log("deleting Profil: "+req.params.id)
			DeleteProfil(req, res);
			break;
	}
}

exports.Update = function(req, res){
	if(req.files.R_picture.type == "image/jpeg"){
		var tmp_path = req.files.R_picture.path;
		var target_path = './public/pictures/p_' + req.session.username + '.jpg'; //   req.files.R_picture.name;
		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			fs.unlink(tmp_path, function() {
				if (err) throw err;
				else{
					console.log("else "+target_path);
					UpdateData(req, res);
				}
			});
		});
		
	}
	else{
		console.log("else");
		UpdateData(req, res);
	}
	
	
}

exports.logout = function(req, res){
	req.session.destroy();
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
						req.session.username = profil.name;
						req.session.password = profil.pass;
						res.redirect('/profil/'+req.body.R_username);
						
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

function CreateSearch(req, res){ //aufrufbar durch post und get
	//console.log(searVal);
	CreateProfil(req, res, function(req, res, item){
		var searVal = req.body.searchit;
		if(searVal){
			db.collection("profiles", function(err, collection) {
				collection.find({"name": new RegExp(req.body.searchit, "i")}).toArray(function(err, searProf) {
					console.log(searProf[0])
					console.log(req.body.searchit);
					db.collection("postings", function(err, collection) {
						collection.find({"message": new RegExp(req.body.searchit, "i")}).toArray(function(err, searPosts) {
							if(!searPosts){ searPosts = 0; }
							console.log(searProf)
							RSearch(req, res, item, searProf, searPosts);
						});
					});
						
				});
			});
		}
		else{ RSearch(req, res, item, 0, 0); console.log("blah"); }
	});
}

function DeletePost(req, res){
	var id = new ObjectID(req.params.id);
	db.collection('postings', function(err, collection) {
		collection.findOne({'_id': id}, function(err, item) {
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

function UpdateData(req, res){
	var name = req.session.username;
	var profil = req.body;
	for (var i in profil) {
		if (!profil[i]) {
			console.log(profil[i]);
			delete profil[i];
		}
		else{
		console.log("a");
		}
	}
	console.log(profil);
	
	if(name == req.params.urlName){
		db.collection('profiles', function(err, collection){
			collection.update({'name': name },{$set:  profil} , {safe:true}, function(err, result){
				res.redirect("/profil/"+name);
			});
		});
	}
}

function DeleteProfil(req, res){
	var id = new ObjectID(req.params.id);
	db.collection('profiles', function(err, collection) {
		collection.findOne({'_id': id}, function(err, item) {
			if(req.session.username == item.name){
				collection.remove({'_id': id}, {safe:true}, function(err, result){
					db.collection('postings', function(err, posts) {
						posts.remove({'author': item.name}, {safe:true}, function(err, result){
							console.log("profil "+item.name+" removed.");
							req.session.destroy();
							res.redirect('/');
						});
					});
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

//Render Search Function
function RSearch(req, res, item, foundProfiles, foundPosts){
	res.render("Tabs/search", {
		title: "Twittcher",
		username: req.session.username,
		_id: req.session.Pid,
		logError: 0,
		regError: 0,
		item: item,
		fProf: foundProfiles,
		fPosts: foundPosts
	});
}

function Safety(req,res){
	if(!req.session.username){res.redirect("/");}
}

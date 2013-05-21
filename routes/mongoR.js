var mongo = require('mongodb');

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

var server = new Server('localhost', 27017, {auto_reconnect: true});
//var server = new Server('alex.mongohq.com', 10060, {user: 'nodejitsu', pass: 'af44fa0312328fc68782796bcacab0c1'}, {auto_reconnect: true});
//var server = new Server('alex.mongohq.com', 10060, {auto_reconnect: true});
db = new Db('twittDB', server);
//db.authenticate({dbUser: "nodejitsu"}, {dbPass: "af44fa0312328fc68782796bcacab0c1"}, {authdb: "admin"});

db.open(function(err,db){
	if(!err) {
		console.log("Connected to database");
		db.collection('profiles', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});
exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving profil: ' + id);
	db.collection('profiles', function(err, collection) {
		collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.findAll = function(req, res) {
	db.collection('profiles', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.addProfil = function(req, res) {
	var profil = req.body;
	console.log('Adding Profile: ' + JSON.stringify(profil));
	db.collection('profiles', function(err, collection) {
		collection.insert(profil, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateProfil = function(req, res) {
	var id = req.params.id;
	var profil = req.body;
	console.log('Updating profil: ' + id);
	console.log(JSON.stringify(profil));
	db.collection('profiles', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, profil, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error updating profil: ' + err);
				res.send({'error':'An error has occurred'});
			} 
			else {
				console.log('' + result + ' document(s) updated');
				res.send(profil);
			}
		});
	});
}


exports.deleteWine = function(req, res) {
	var id = req.params.id;
	console.log('Deleting profil: ' + id);
	db.collection('profiles', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred - ' + err});
			} 
			else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
}





var populateDB = function() {
 
	var profil = [
	{
		name: "Pika",
		pass: "pika",
		email: "pika@pi.com",
		picture: "saint_cosme.jpg"
	}];

	 db.collection('profiles', function(err, collection) {
		collection.insert(profil, {safe:true}, function(err, result) {});
	});
};
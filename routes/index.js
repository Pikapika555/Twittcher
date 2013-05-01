/*
* GET home page.
*/


exports.index = function(req, res){
//res.render('index', { title: 'Express', loggedIn: 0, username: "penis"});
Render(req, res, "index");
};

exports.profil = function(req, res){

res.render('profil', { title: 'Express', username: req.session.username });
//res.get(profilname)
};


exports.wall = function(req, res){
res.render('Tabs/wall', { title: 'wall', username: req.session.username });
};

exports.search = function(req, res){
res.render('Tabs/search', { title: 'search', username: req.session.username });
//url.resolve('http://example.com/', '/one')
};

exports.profiles = function(req, res){
res.render('Tabs/profiles', { title: 'profiles', username: req.session.username });
};




// handler for form submitted from homepage
exports.home_post_handler = function(req, res, data) {

	// get vars out of form
	var username = req.body.username;
	var password = req.body.password;
    
	if(loginCheck(username, password)){
		// store the username as a session variable
		req.session.username = username;
		req.session.password = password;
		console.log("Logged: "+req.body.username);
		res.redirect('/profil/'+req.session.username);
	}
	else{
		res.render('index', {
			title: 'Twittcher',
			logError: 1,
			username: req.session.username
			})
	}
	

    // redirect the user to homepage
    
};

function loginCheck(name, pass){
	if(name == "pika" && pass == "bla"){return true;}
	else{ return false };
}

function Render(req, res, sUrl){
	res.render(sUrl, {
		title: "Twittcher",
		username: req.session.username,
		logError: 0
	
	});
}

function Safety(req,res){
	if(!req.session.username){res.redirect("/");}
}

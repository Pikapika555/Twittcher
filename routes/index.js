/*
* GET home page.
*/


exports.index = function(req, res){
//res.render('index', { title: 'Express', loggedIn: 0, username: "penis"});
Render(req, res, "index");
};

exports.profil = function(req, res){

res.render('profil', { title: 'Express', layout: !req.xhr, username: "bla" });
//res.get(profilname)
};


exports.wall = function(req, res){
res.render('Tabs/wall', { title: 'wall', loggedvariable: 1 });
};

exports.search = function(req, res){
res.render('Tabs/search', { title: 'search' });
//url.resolve('http://example.com/', '/one')
};

exports.profiles = function(req, res){
res.render('Tabs/profiles', { title: 'profiles' });
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
		res.redirect('/profil/'+username);
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

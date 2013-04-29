/*
* GET home page.
*/

exports.index = function(req, res){
res.render('index', { title: 'Express' });
};

exports.profil = function(req, res){

res.send(req.body.username);
res.render('profil', { title: 'Express', penis: 1 });

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
    
	var data = new Array();
		data[0] = 0;
		data[1] = username;
	if(loginCheck(username, password)){
		// store the username as a session variable
		req.session.username = username;
		req.session.password = password;
		console.log("Logged: "+req.body.username);
		data[0] = 1;
	}		
	res.send(data);
	


    // redirect the user to homepage
    //res.redirect('/profil/'+username);
};

function loginCheck(name, pass){
	if(name == "pika" && pass == "bla"){return true;}
	else{ return false };
}

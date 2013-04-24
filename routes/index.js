/*
* GET home page.
*/

exports.index = function(req, res){
res.render('index', { title: 'Express' });
};

exports.wall = function(req, res){
res.render('Tabs/wall', { title: 'wall' });
};

exports.search = function(req, res){
res.render('Tabs/search', { title: 'search' });
//url.resolve('http://example.com/', '/one')
};



// handler for form submitted from homepage
exports.home_post_handler = function(req, res) {

	// get vars out of form
	var username = req.body.username;
	var password = req.body.password;
    // store the username as a session variable
	//if(loginChecker(username, password)){
		req.session.username = username;
		req.session.password = password;
		console.log("Logged");
	
	
		
	//}
	//req.session.password = password;
	//console.log(username+"  "+password);
    // redirect the user to homepage
    res.redirect('/');
};

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.bla = function(req, res){
	res.render('index', { title: "blabla"});
};

// handler for form submitted from homepage
exports.home_post_handler = function(req, res) {
    // if the username is not submitted, give it a default of "Anonymous"
    //console.log("bla");
	var username = req.body.username;
	var password = req.body.password;
    // store the username as a session variable
    req.session.username = username;
	req.session.password = password;
    // redirect the user to homepage
    res.redirect('/');
};
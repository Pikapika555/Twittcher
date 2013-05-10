
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , mongo = require('./routes/mongoR')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Enviroments
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes 
app.get('/', routes.index);
app.get('/users', user.list);

//own route plan
////get
app.get('/profil/:urlName', routes.profil);
app.get('/profil/:urlName/wall', routes.wall);
app.get('/profil/:urlName/search', routes.search);
app.get('/profil/:urlName/profiles', routes.profiles);

////post
app.post('/', routes.home_post_handler);
app.post('/regIT', routes.Register);
app.post('/profil/:urlName/postWall', routes.Posting);
app.post('/profil/:currentProfil/delete/:itemType/:id', routes.Delete);
app.post('*/logout', routes.logout);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

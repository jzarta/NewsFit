//Express, bodyparser and handlebars area 
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');


var app = express();
//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

require('./controllers/news_controller.js')(app);


app.listen(8080, function() {
  console.log('App running on port 8080!');
});
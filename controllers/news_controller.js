// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

// Database configuration
var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

module.exports = function(app){
	//home page
	app.get('/', function(req, res) {
		//load google news into request
	request('https://news.google.com/', function (error, response, html) {
			if (error) throw error;
			//save the html into Cheerio
			var $ = cheerio.load(html);
			//for each article
			$('.esc-layout-article-cell').each(function(i, element){
				var entry = [];
				//push the title and link into aray for 
				$(this).find('.esc-lead-article-title').each(function(i, element){
					entry.push($(this).children('a').text()); //title
					entry.push($(this).children('a').attr('href')); //link
				});
				//create article object
				var articleInfo = {
					title : entry[0],
					link : entry[1],
					comments: []
				};
				//See if article already exists in database
				db.scrapedData.find(articleInfo, function(err,data)
				{
					//if it doesnt insert new article into DB
					if (Object.keys(data).length == 0)
					{
						db.scrapedData.insert(articleInfo, function(err, data){
							if (err) throw err;
						});
						console.log("Article Added!");
					}
					//Else console log that article already exists
					else
						console.log("This article exists already!");
				});


			});
		});
		//after everything is finished reload page with DB information
		db.scrapedData.find({}, function(err,data)
		{
			res.render('index', {data});

		})
	});

	app.post('/delete', function(req, res){
		
		var id = req.body.commID;
		var comment = req.body.comment;

	

		db.scrapedData.update({_id: mongojs.ObjectId(id)}, { $pull: { comments: { $in: [ comment ] }}});

		db.scrapedData.find({}, function(err,data)
		{
			res.render('index', {data});

		});

	});

	app.post('/update/:id', function(req, res) {

		var id = req.params.id;
		db.scrapedData.update({_id: mongojs.ObjectId(id)}, {$push: {'comments': req.body.comment}}, function(err)
		{
			if(err) throw err;
		});
		db.scrapedData.find({}, function(err,data)
		{
			res.render('index', {data});

		});
	});



}
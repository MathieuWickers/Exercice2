/** @author Wickers Mathieu
*/

// tutorial on
// http://fr.openclassrooms.com/informatique/cours/des-applications-ultra-rapides-avec-node-js/le-framework-express-js 

var express   = require('express');
var app       = express();
var scraper   = require ('./public/js/scraper');
var DBManager = require('./public/js/mongoose').DBManager;
 
 
/* Show the welcome page  */
app.use(express.bodyParser())

.get('/scraper', function(req, res) {
  res.render('scraper.ejs');
})


.use('/public/css', express.static(__dirname + '/public/css'))

// collect all url from a page */
.post('/scraper/url/', function(req, res) {
  if (req.body.scraper !== '') {
    scraper.get_page(req.body.scraper);
  }
  res.redirect('/scraper');
})

/* Show all data of the database */
.get('/scraper/showDatabse', function(req, res) {
  DBManager.showAllData();
  res.redirect('/scraper');
})

/* Remove all data of the database */
.get('/scraper/removeDatabase', function(req, res) {
  DBManager.deleteAllData();
  res.redirect('/scraper');
})

/* Show some data */
.post('/scraper/findData', function(req, res) {
  if (req.body.keyWord !== '') {
    DBManager.findData(req.body.keyWord);
  }
  res.redirect('/scraper');
})

/* Remove some data of the database */
.post('/scraper/deleteData', function(req, res) {
  if (req.body.word !== '') {
    DBManager.deleteData(req.body.word);
  }
  res.redirect('/scraper');
})
 
 
.listen(8080);
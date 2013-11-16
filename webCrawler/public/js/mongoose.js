// tutorial on 
// http://www.atinux.fr/2011/10/15/tutoriel-sur-mongoose-mongodb-avec-node-js/

var mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb://localhost/webCrawler', function (err) {
  if (err) {
    throw err;
  }
});

var DBUrlSchema = new mongoose.Schema({
  url: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

var DBUrlModel = mongoose.model('commentaires', DBUrlSchema);

var DBManager = {};

//delete all data on the database
DBManager.deleteEntries = function (err, comms) {
  if (err) {
    throw err;
  }
  console.log('------------------------------');
  console.log('Supression en cours ...');
  console.log('------------------------------');
  var comm;
  for (var i = 0, l = comms.length; i < l; i++) {
    comm = comms[i];
    comm.remove();
  }
  console.log('------------------------------');
  console.log('Fin de la supression');
  console.log('------------------------------');
};

DBManager.deleteDatabase = function (err, comms) {
  DBUrlModel.find(null, DBManager.deleteEntries);
};

//show all data on the database
DBManager.showEntries = function (err, comms) {
  if (err) {
    throw err;
  }
  var comm;
  for (var i = 0, l = comms.length; i < l; i++) {
    comm = comms[i];
    console.log('------------------------------');
    console.log('url : ' + comm.url);
    console.log('Date : ' + comm.date);
    console.log('ID : ' + comm._id);
    console.log('------------------------------');
  }
};

DBManager.showDatabase = function (err, comms) {
  DBUrlModel.find(null, DBManager.showEntries);
};

exports.DBManager = DBManager;
exports.DBUrlModel = DBUrlModel;
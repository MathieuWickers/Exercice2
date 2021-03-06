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
DBManager.deleteAllData = function () {
  DBUrlModel.find(null, function (err,comms) {
    if (err) {
      throw err;
    }
    console.log('------------------------------');
    console.log('Suppression en cours ...');
    console.log('------------------------------');
    var comm;
    for (var i = 0, l = comms.length; i < l; i++) {
      comm = comms[i];
      console.log('url : ' + comm.url);
      comm.remove();
    }
    console.log('------------------------------');
    console.log('Suppression de '+i+' éléments');
    console.log('------------------------------');
  });
};

//show all data on the database
DBManager.showAllData = function () {
  DBUrlModel.find(null, function (err, comms) {
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
  });
};

//find each data which contain the keyword 
DBManager.findData = function (word) {
  var query = DBUrlModel.find(null);
  var search = word;
  query.where('url', new RegExp(search));
  query.exec(function (err, comms) {
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
  });
};

//delete each data which contain the keyword 
DBManager.deleteData = function (word) {
  var query = DBUrlModel.find(null);
  var search = word;
  query.where('url', new RegExp(search));
  query.exec(function (err, comms) {
    if (err) {
      throw err;
    }
    console.log('------------------------------');
    console.log('Suppression en cours ...');
    console.log('------------------------------');
    var comm;
    for (var i = 0, l = comms.length; i < l; i++) {
      comm = comms[i];
      console.log('url : ' + comm.url);
      comm.remove();
    }
    console.log('------------------------------');
    console.log('Suppression de '+i+' éléments');
    console.log('------------------------------');
  });
};


exports.DBManager = DBManager;
exports.DBUrlModel = DBUrlModel;
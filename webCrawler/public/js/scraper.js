'use strict';

/**
 * Web Scraper
 */


var console         = require('./console');
// Url regexp from http://daringfireball.net/2010/07/improved_regex_for_matching_urls
var EXTRACT_URL_REG = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
var PORT            = 3000;
var request         = require('request');

var api             = require('./api');
api.listen(PORT);

var EventEmitter    = require('events').EventEmitter;
// We create a global EventEmitter (Mediator pattern: http://en.wikipedia.org/wiki/Mediator_pattern )
var em              = new EventEmitter();
var queue           = [];

var mongoose        = require('mongoose');
var DBUrlModel      = require('./mongoose').DBUrlModel;
var i = -1;


// This object will be use for the export
var scraper = {};

/**
 * Get the page from `page_url`
 * @param  {String} page_url String page url to get
 *
 * `get_page` will emit
 */

scraper.get_page = function(page_url) {
  i++;
  em.emit('page:scraping', page_url);

  // See: https://github.com/mikeal/request
  request({
    url: page_url,
  }, function (error, http_client_response, html_str) {
    /**
     * The callback argument gets 3 arguments.
     * The first is an error when applicable (usually from the http.Client option not the http.ClientRequest object).
     * The second is an http.ClientResponse object.
     * The third is the response body String or Buffer.
     */

    if (error) {
      em.emit('page:error', page_url, error);
      return;
    }
   
    //Show some header informations 
    //console.log(http_client_response.headers) show all the informations
    if (typeof http_client_response.headers['content-length'] !== 'undefined') {
      console.header('Content length : ' + http_client_response.headers['content-length']);
    }
    console.header('Server behind the web page : ' + http_client_response.headers.server);
    console.header('Content-Type : ' + http_client_response.headers['content-type']);

    em.emit('page', page_url, html_str);
  });

};

/**
 * Extract links from the web page
 * @param  {String} html_str String that represents the HTML page
 *
 * `extract_links` should emit an `link(` event each
 */

scraper.extract_links = function(page_url, html_str) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  // "match" can return "null" instead of an array of url
  // So here I do "(match() || []) in order to always work on an array (and yes, that's another pattern).
  (html_str.match(EXTRACT_URL_REG) || []).forEach(function(url) {
    // see: http://nodejs.org/api/all.html#all_emitter_emit_event_arg1_arg2
    // if the array don't contain the url (indexOf return -1)
    if (queue.indexOf(url) === -1) {
      em.emit('url', page_url, html_str, url);
    }
  });
  em.emit('exit');
};

scraper.handle_new_url = function(from_page_url, from_page_str, url) {
  // Add the url to the queue
  queue.push(url);

  // We create a new CommentaireUrlModel
  var data = new DBUrlModel();
  data.url = url;

  // Save the Commentaire on the DB
  data.save(function (err) {
    if (err) {
      throw err;
    }
  });

};


em.on('page:scraping', function (page_url) {
  console.info('Loading... ', page_url);
});

// Listen to events, see: http://nodejs.org/api/all.html#all_emitter_on_event_listener
em.on('page', function (page_url, html_str) {
  console.log('We got a new page!', page_url);
});

em.on('page:error', function (page_url, error) {
  console.error('Oops an error occured on', page_url, ' : ', error);
  em.emit('exit');
});

em.on('page', scraper.extract_links);

em.on('url', function (page_url, html_str, url) {
  console.log('We got a link! ', url);
});

em.on('url', scraper.handle_new_url);

em.on('exit', function () {
  if (i < queue.length) {
    scraper.get_page(queue[i]);
  }
  else {
    console.log('No more links');
  }
});

console.info('Web UI Listening on port ' + PORT);

module.exports = scraper;
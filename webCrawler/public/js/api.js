// See: http://expressjs.com/guide.html
var express = require('express');
var app     = express();

app.get('/',
  function (req, res) {
    // See: http://expressjs.com/api.html#res.json
    res.json(200, {
      title: 'YOHMC - Your Own Home Made Crawler',
      endpoints: [{
        url: 'http://127.0.0.1:' + PORT + '/queue/size',
        details: 'the current crawler queue size'
      }, {
        url: 'http://127.0.0.1:' + PORT + '/queue/add?url=http%3A//voila.fr',
        details: 'immediately start a `get_page` on voila.fr.'
      }, {
        url: 'http://127.0.0.1:' + PORT + '/queue/list',
        details: 'the current crawler queue list.'
      }]
    });
  });

app.get('/queue/size',
  function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.json(200, {
      queue: {
        length: queue.length
      }
    });
  });

app.get('/queue/add',
  function (req, res) {
    var url = req.param('url');
    get_page(url);
    res.json(200, {
      queue: {
        added: url,
        length: queue.length
      }
    });
  });

app.get('/queue/list',
  function (req, res) {
    res.json(200, {
      queue: {
        length: queue.length,
        urls: queue
      }
    });
  });

module.exports = app;
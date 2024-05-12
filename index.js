
const express = require('express');
// const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
require('dotenv').config();

// Basic Configuration
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204



const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint



// Database setup (in-memory store for this example)
const urlDatabase = {}; 
let nextShortUrlId = 1;

// The extended option allows to choose between parsing the URL-encoded data with the querystring library
//  (when false) or the qs library (when true).
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoint to shorten URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;



  // 1. URL Validation
  dns.lookup(new URL(originalUrl).hostname, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // 2. Generate short URL ID
    const shortUrlId = nextShortUrlId++;
    urlDatabase[shortUrlId] = originalUrl;

    // 3. Send response
    res.json({ original_url: originalUrl, short_url: shortUrlId });
  });
});

// Redirect from short URL to original URL
app.get('/api/shorturl/:shortUrlId', (req, res) => {
  const shortUrlId = parseInt(req.params.shortUrlId);
  const originalUrl = urlDatabase[shortUrlId];

  if (originalUrl) {
    res.redirect(301, originalUrl); 
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });


//
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API shortener' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
  console.log(`Servidor en ejecución en http://localhost:${process.env.PORT}`);
});

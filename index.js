require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('node:dns') 
const bodyParser = require('body-parser')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended : false}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let linkKeys = {}

app.post('/api/shorturl', (req, res) => {
  let uneditedURL =  req.body.url
  let url = uneditedURL
  url = url.replace(/^https?:\/\//,'')
  url = url.slice(0,url.indexOf('/'))

  console.log( "URL : " + url)
  
  dns.lookup(url, (err, addresses,family) => {
    console.log(err)
      console.log(addresses)
      console.log(family)
    if(err !== null){
      
      res.json({
        error : 'invalid url'
      })
     
    }
else{
  linkKeys[Math.floor(Math.random() * 10009)] = uneditedURL

    res.json({
      original_url : uneditedURL,
      short_url : linkKeys[uneditedURL] ?  linkKeys[uneditedURL] : "Does not exist" 
    })
}
    
  })
})

app.get('api/shorturl/:url')

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

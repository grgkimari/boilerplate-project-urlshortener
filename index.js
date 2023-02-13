require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("node:dns");
const bodyParser = require("body-parser");
const open = require("open");
const URL = require('url').URL

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//Links

let linkStore = []


// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});


app.post('/api/shorturl', (req, res) => {
let invalidObj = {
  "error" : "invalid url"
}

  let originalURL = req.body.url
try{
  new URL(originalURL)
  }
  catch(err) {
    return res.json(invalidObj)
  }

  console.log("original url : " + originalURL)
  let editedURL = originalURL.replace(/^(https?|ftp):\/\/?/,'')
  editedURL= editedURL.slice(0, editedURL.indexOf('/'))
  console.log("edited url : " + editedURL)

  dns.lookup(editedURL, (err) => {
    if(err){
      console.log("Invalid domain")
      return res.json(invalidObj)
    }
    else{
      let obj
      if(linkStore.indexOf(originalURL) === -1){
        linkStore.push(originalURL)
        
      }
      obj = {
        "original_url" : `${originalURL}`,
        "short_url" : `${linkStore.indexOf(originalURL)}`
      }
      console.log("Returning : " + JSON.stringify(obj))
      return res.json(obj)
    }
  })


})

app.get('/api/shorturl/:index', (req, res) => {
  let index = req.params.index

  if(linkStore[index]){
    return res.redirect(linkStore[index])
}
else{
  res.json({
    error : "short url not found"
  })
}
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
  let shorran = Math.random().toString(36).substring(2, 8);
  return shorran;
}

app.get('/',(req, res)=>{
  res.send('<html><body>Hello! <b> World</body><html>\n');
});

app.get('/urls.json',(req,res)=>{
  res.json(urlDatabase);
});
app.get('/urls/new',(req,res)=>{
  
  res.render('urls_new');

});
app.get('/urls',(req,res)=>{
  const templateVars = {urls:urlDatabase};
  res.render('urls_index',templateVars);
});

app.post('/urls/',(req,res) =>{
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  //console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
  //res.send('ok');
});
///////////////Delete/////////////
app.post('/urls/:shortURL/delete',(req,res)=>{
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});
//////////////Edit/////////////
app.post('/urls/:shortURL',(req,res)=>{
  let longURL = req.body.newURL;
  urlDatabase[req.params.shortURL] = longURL;
  res.redirect('/urls');
});
app.get('/urls/:shortURL',(req,res)=>{
  const templateVars = {shortURL: req.params.shortURL,longURL:urlDatabase[req.params.shortURL]};
  res.render('urls_show',templateVars);
});

app.get('/u/:shortURL',(req,res)=>{
  let longURL = urlDatabase[req.params.shortURL];
  //console.log(longURL);
  res.redirect(longURL);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

////////////////require midware and port ////////////////
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const index = bcrypt.genSaltSync(10); // the lentgh the scabbme password
const app = express();
const PORT = 8080;
/////////////helper function/////////////////////
const {generateRandomString , getUserByEmail, usercheck , urlsForUser} = require('./helperfunction');

////////////// set and use for middware////////////////
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
///////////urlDatabase to use as test///////////
const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca" , id:"id1" } ,

  "9sm5xK": {longURL:"http://www.google.com" ,id:"id2"}
};

//////////hashing the user password//////////////
let hashPw1 = bcrypt.hashSync("1234", index);
let hashPw2 = bcrypt.hashSync("0000", index);
//////// users objs used to test ////////////
const users = { "id1":{
  id : "id1",
  email:"name1@email.com",
  password:hashPw1
},
"id2":{
  id : "id2",
  email:"name2@email.com",
  password:hashPw2
}
};

///////////////////////home page /////////////////
app.get('/',(req, res)=>{
  for (let user in users) {
    if (users[user].id === req.session['userID']) {
      return res.redirect('/urls');
    }
  }
  res.redirect('/login');
});
///////////////////// create new url /////////////////////
app.get('/urls/new',(req,res)=>{
  console.log(req.body);
  for (let user in users) {
    if (users[user].id === req.session['userID']) {
      const templateVars = { user: users[req.session["userID"]] };
      return res.render("urls_new", templateVars);
    }
  }
  res.redirect('/login');

});
////////////////////////creating short urls///////////////
app.post('/urls',(req,res) =>{
  
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL:req.body.longURL, id:req.session['userID']};
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
 
});
///////////////////////////////// user urls//////////////////
app.get('/urls',(req,res)=>{
  for (let user in users) {
    if (users[user].id === req.session['userID']) {
      let userID = req.session["userID"];
      let userURL = urlsForUser(urlDatabase,userID);
      const templateVars = {urls:userURL,
        user:users[userID] };
      return  res.render('urls_index',templateVars);
    }
  }
  res.redirect('/login');
});

////////////////////////////Delete urls///////////////////////

app.post('/urls/:shortURL/delete',(req,res)=>{
  for (let user in users) {
    if (users[user].id === req.session['userID']) {
      delete urlDatabase[req.params.shortURL];
  
      return res.redirect('/urls');
    }
  }
  res.redirect('/login');
});

/////////////////////////////Edit urls//////////////////////
app.post('/urls/:shortURL',(req,res)=>{
  
  let longURL = req.body.newURL;
  urlDatabase[req.params.shortURL].longURL = longURL;
  res.redirect('/urls');
  
  
});

//////////////////////////////short url page/////////////////////
app.get('/urls/:shortURL',(req,res)=>{
  for (let user in users) {
    if (users[user].id === req.session['userID']) {
      let userID = req.session['userID'];
      console.log(req.params.shortURL);
      
      const templateVars = {shortURL: req.params.shortURL,longURL: urlDatabase[req.params.shortURL].longURL,user:users[userID]};
      return res.render('urls_show',templateVars);
    }
  }
  res.redirect('/login');
});


////////////////////Redirect to long urls///////////////////////
app.get('/u/:shortURL',(req,res)=>{
  let longURL = urlDatabase[req.params.shortURL].longURL;
  
  res.redirect(longURL);
});

///////////////////////////////LogIn//////////////////////////
app.post('/login',(req,res)=>{
  let checkUs = usercheck(users,req.body.email,req.body.password);
  console.log(checkUs.obj);
  if (checkUs.error) {
    res.status(400).send('Incorrect email or password');
  } else {
    req.session['userID'] = checkUs.obj;
    res.redirect('/urls');
  }
  
});

app.get('/login',(req,res)=>{
  
  let templateVars = {user:users[req.session['userID']]};
  res.render('urls_login',templateVars);
});

///////////////////////////////////LogOut////////////////////////////

app.post('/logout',(req,res)=>{
  req.session = null;
  res.redirect('/urls');
});
//////////////////////////register rendering page/////////////////
app.get('/register', (req,res) =>{
 
  let templateVars = {user:users[req.session['userID']]};
  res.render('urls_user', templateVars);
});
//////////////////posting register user//////////////////////
app.post('/register', (req,res)=>{
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password,index);
  let id = generateRandomString();
  
  let checkemail = getUserByEmail(email,users);
  if (email === '' || password === '') {
    res.status(404).send('Please input email and password');
  } else if (checkemail) {
    res.status(404).send('Please login');
  } else {
    users[id] = {
      id,
      email,
      password
    };
    req.session['userID'] = id;
    res.redirect('/urls');
  }
  
  
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
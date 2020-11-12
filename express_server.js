const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {generateRandomString , checkmail, usercheck , urlsForUser} = require('./helperfunction');
const bcrypt = require('bcryptjs');
const index = bcrypt.genSaltSync(10); // the lentgh the scabbme password
const app = express();
const PORT = 8080;

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca" , id:"id1" } ,

  "9sm5xK": {longURL:"http://www.google.com" ,id:"id2"}
};
let hashPw1 = bcrypt.hashSync("1234", index);
let hashPw2 = bcrypt.hashSync("0000", index);
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


app.get('/',(req, res)=>{
  res.send('<html><body>Hello! <b> World</body><html>\n');
});

app.get('/urls.json',(req,res)=>{
  res.json(urlDatabase);
});
////////// create new url //////////////
app.get('/urls/new',(req,res)=>{
  console.log(req.body);
  for (let user in users) {
    if (users[user].id === req.cookies['userID']) {
      const templateVars = { user: users[req.cookies["userID"]] };
      return res.render("urls_new", templateVars);
    }
  }
  res.redirect('/login');

});
///////////creating short urls/////////
app.post('/urls',(req,res) =>{
  
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL:req.body.longURL, id:req.cookies['userID']};
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
 
});
//////////// user urls////////////
app.get('/urls',(req,res)=>{
  for (let user in users) {
    if (users[user].id === req.cookies['userID']) {
      let userID = req.cookies["userID"];
      let userURL = urlsForUser(urlDatabase,userID);
      
      const templateVars = {urls:userURL,
        user:users[userID] };
      //console.log(templateVars);
      return  res.render('urls_index',templateVars);
    }
  }
  res.redirect('/login');
});

///////////////Delete/////////////

app.post('/urls/:shortURL/delete',(req,res)=>{
  for (let user in users) {
    if (users[user].id === req.cookies['userID']) {
      delete urlDatabase[req.params.shortURL];
  
      return res.redirect('/urls');
    }
  }
  res.redirect('/login');
});

//////////////Edit/////////////
app.post('/urls/:shortURL',(req,res)=>{
  
  let longURL = req.body.newURL;
  urlDatabase[req.params.shortURL].longURL = longURL;
  res.redirect('/urls');
  
  
});

//////////////short url page//////////
app.get('/urls/:shortURL',(req,res)=>{
  for (let user in users) {
    if (users[user].id === req.cookies['userID']) {
      let userID = req.cookies.userID;
      console.log(req.params.shortURL);
      
      const templateVars = {shortURL: req.params.shortURL,longURL: urlDatabase[req.params.shortURL].longURL,user:users[userID]};
      return res.render('urls_show',templateVars);
    }
  }
  res.redirect('/login');
});


///////////Redirect to long urls//////////
app.get('/u/:shortURL',(req,res)=>{
  let longURL = urlDatabase[req.params.shortURL].longURL;
  
  res.redirect(longURL);
});

//////////////LogIn///////////////
app.post('/login',(req,res)=>{
  // let user = req.body;

  let checkUs = usercheck(users,req.body.email,req.body.password);
  console.log(checkUs.obj);
  if (checkUs.error) {
    res.send('403 incorrect email or password');
  } else {
    res.cookie('userID',checkUs.obj);
    res.redirect('/urls');
  }
  
  
});

app.get('/login',(req,res)=>{
  
  let templateVars = {user:users[req.cookies['userID']]};
  res.render('urls_login',templateVars);
});

////////////////LogOut//////////////////

app.post('/logout',(req,res)=>{
  res.clearCookie('userID');
  res.redirect('/urls');
});
///////////register rendering page//////////
app.get('/register', (req,res) =>{
  //let user = req.cookies;
  let templateVars = {user:users[req.cookies['userID']]};
  res.render('urls_user', templateVars);
});
/////////posting register user///////
app.post('/register', (req,res)=>{
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password,index);
  let id = generateRandomString();
  
  let checkemail = checkmail(users,email,password);
  if (checkemail) {
    res.send('404');
  } else {
    users[id] = {
      id,
      email,
      password
    };
    //console.log(users);
    res.cookie('userID',id);
  
    res.redirect('/urls');
  }
  
  
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
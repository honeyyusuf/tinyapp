const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {generateRandomString , checkmail, usercheck} = require('./helperfunction');
const app = express();
const PORT = 8080;

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca" , id:"id1" } ,

  "9sm5xK": {longURL:"http://www.google.com" ,id:"id2"}
};
const users = { "id1":{
  id : "id1",
  email:"name1@email.com",
  password:"1234"
},
"id2":{
  id : "id2",
  email:"name2@email.com",
  password:"0000"
}
};


app.get('/',(req, res)=>{
  res.send('<html><body>Hello! <b> World</body><html>\n');
});

app.get('/urls.json',(req,res)=>{
  res.json(urlDatabase);
});
app.get('/urls/new',(req,res)=>{
  let user = req.cookies.user;
  let templateVars = {user};
  res.render('urls_new', templateVars);

});
app.get('/urls',(req,res)=>{
  let user = req.cookies["user"];
  const templateVars = {urls:urlDatabase,
    user:user };
  //console.log(templateVars);
  res.render('urls_index',templateVars);
});
///////////creating short urls/////////
app.post('/urls/',(req,res) =>{
  let shortURL = generateRandomString();
  let user = req.cookies.user;
  if (user) {
    urlDatabase[shortURL] = {longURL: req.body.longURL, id:user.id};
    //console.log(urlDatabase);
    return res.redirect(`/urls/${shortURL}`);
  }
    
  res.redirect('/login');
  
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
  let user = req.cookies.user;
  //console.log(user);
  
   
  const templateVars = {shortURL: req.params.shortURL,longURL:urlDatabase[req.params.shortURL].longURL,user};
  res.render('urls_show',templateVars);
    
  
  
  
});
///////////Redirect to long urls//////////
app.get('/u/:shortURL',(req,res)=>{
  console.log(req.params);
  let longURL = urlDatabase[req.params.shortURL].longURL;
  
  res.redirect(longURL);
});
//////////////LogIn///////////////
app.post('/login',(req,res)=>{
  let user = req.body;
  let checkUs = usercheck(users,user.email,user.password);
  if (checkUs.error) {
    res.send('403 incorrect email or password');
  } else {
    res.cookie('user',user);
    res.redirect('/urls');
  }
  
  
});

app.get('/login',(req,res)=>{
  
  let templateVars = {user:null};
  res.render('urls_login',templateVars);
});

////////////////LogOut//////////////////

app.post('/logout',(req,res)=>{
  res.clearCookie('user');
  res.redirect('/urls');
});
///////////register rendering page//////////
app.get('/register', (req,res) =>{
  //let user = req.cookies;
  let templateVars = {user:null};
  res.render('urls_user', templateVars);
});
/////////posting register user///////
app.post('/register', (req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
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
    res.cookie('user',users[id]);
  
    res.redirect('/urls');
  }
  
  
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



const bcrypt = require('bcryptjs');

////// used to generate shortid for new urls and new userid for regstration///////
function generateRandomString() {
  let shorran = Math.random().toString(36).substring(2, 8);
  return shorran;
};

/////////// check if the email and password macths user database user tries to login///
const usercheck = (objs, email, password) => {
  if (email === '' || password === '') {
    return {error : "Please input the email and password"};
  } else {
    for (let obj in objs) {
      if (objs[obj].email === email) {
        if (bcrypt.compareSync(password,objs[obj].password)) {
          return {error:null , obj};
        } else {
          return {error:'password', obj:null};
        }
      }
    }

    return {error:'email', obj:null};
  }
};
/////////checkes if the email exists for in the userdatabase during regstration/////////
const getUserByEmail = (email,users) => {
  for (let user in users) {
    if (users[user].email === email) {
      return user;
    }
  }
  return null;
};

///////////checkes if the id is the same as the urls id ///////
const urlsForUser = (objs,id) => {
  let userURL = {};
  for (let obj in objs) {
    if (objs[obj].id === id) {
      userURL[obj] = objs[obj];
    }
  }
  return userURL;
};



module.exports = {generateRandomString, getUserByEmail, usercheck ,urlsForUser};
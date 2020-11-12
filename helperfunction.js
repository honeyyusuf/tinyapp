


const bcrypt = require('bcryptjs');


function generateRandomString() {
  let shorran = Math.random().toString(36).substring(2, 8);
  return shorran;
}
 
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
const checkmail = (objs, email, password) => {
  if (email === '' || password === '') {
    return {error : "Please input the email and password"};
  } else {
    for (let obj in objs) {
      if (email === objs[obj].email) {
        return {error:"email already exists",obj:null };
      }
      
    }
  }

};
const urlsForUser = (objs,id) => {
  let userURL = {};
  for (let obj in objs) {
    if (objs[obj].id === id) {
      userURL[obj] = objs[obj];
    }
  }
  return userURL;
};



module.exports = {generateRandomString, checkmail , usercheck ,urlsForUser};
var jwt = require('jsonwebtoken');
var config = require('./../../../config/database');
var User = require('./userSchema');
var user = {};
user.signup = function(req, res){
    console.log(req.body);
	var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });
     User.findOne({email: req.body.email}, function(err, users){
         if(users){
            res.json({status:false, errors:{email : "Email is already exist."}});
        }else{
            newUser.save(function(err) {
                if(err)
                    res.json({msg : err._message, errors : err.errors});
                else{
                    User.findOne({email: req.body.email}, function(err, users){
                        var forToken = {_id: users._id, name: users.name, password: users.password, email: users.email, phone: users.phone, username: users.username }
                        var token = jwt.sign(forToken, config.secret);
                        res.json({status:true, token:'Bearer '+token, _id:users._id, name:users.name, email: users.email, phone:users.phone});
                    });
                } 
            });
        }
     });
  
}

user.login = function(req, res){
    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body);
    User.findOne({email: email}, function(err, us){
        if(err)
            throw err;
         
        if(!us){
            res.json({status:false, msg:"Username or password is incorrect - email."});
        }else{
            us.comparePassword(password, function(err, isMatch){

                if(isMatch && !err){
                    var forToken = {_id: us._id, name: us.name, password: us.password, email: us.email, phone: us.phone, username: us.username }
                    var token = jwt.sign(forToken, config.secret);
                    res.json({status:true, token:'Bearer '+token, _id:us._id, name:us.name, email: us.email,  phone: us.phone,});
                }else{
                    res.json({status:false, msg:"Username or password is incorrect - password."});
                }
            });
        }

    });
}


module.exports = user;

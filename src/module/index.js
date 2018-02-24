var mongoose = require('mongoose');
var passport = require('passport');
var dbConfig = require('./../../config/database');
require('./../../config/passport')(passport);
var jwt = require('jsonwebtoken');
var router = require('express').Router();
var user = require('./user/index');
var blog = require('./blog/index');
var userInfo = require('./common/index');

router.use('/user', user);
router.use('/blogs',  blog);
//router.use('/blogs', passport.authenticate('jwt', {session:false}), blog);


router.use('/myblog', passport.authenticate('jwt', {session:false}), blog);


router.use('/debug', passport.authenticate('jwt', {session:false}), function(req, res){
    res.json({status:"success"});
});

router.get('/checkAuth', passport.authenticate('jwt', {session:false}), function(req, res){
    var info = userInfo(req.headers.authorization);
    res.json({status:true, name:info.name, email:info.email});
});

module.exports = router;

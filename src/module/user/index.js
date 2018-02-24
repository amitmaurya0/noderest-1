var user = require('./user');
var userAction = require('./userAction');
var passport = require('passport');
require('./../../../config/passport')(passport);
const routes = require('express').Router();

routes.post('/signup', user.signup);
routes.post('/login', user.login);
routes.get('/getnotification', passport.authenticate('jwt', {session:false}), userAction.getNotification)
routes.get('/', (req, res) => {
    res.send('Page is under construction.'); 
});



module.exports = routes;
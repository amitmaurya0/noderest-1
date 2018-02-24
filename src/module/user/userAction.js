var User = require('./userSchema');
var userInfo = require('./../common/index');
var userAction = {};


userAction.getNotification = function(req, res){
    var info = userInfo(req.headers.authorization);
    User.find(
        {_id:info._id},
         function(err, result){
            if(err)
                res.json(err)
            else{
                res.json({status:true,data:result[0].new_notification_count})
            }
        }
    )
}

module.exports = userAction;
 
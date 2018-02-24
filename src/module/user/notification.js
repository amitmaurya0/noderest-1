var User = require('./userSchema');

var Notify = {};

Notify.create = function(notification, cb){
                var status = false;
                        User.update(
                            {
                                "_id": notification.user_id
                            },
                            {
                                $inc: {
                                    new_notification_count: 1
                                }, 
                                $push: {
                                    notifications: {
                                        user_id     :     notification._id,
                                        value       :     notification.info,
                                        blog_id     :     notification.blog_id,
                                        like        :     notification.like,
                                        comment     :     notification.comment,
                                        action_id   :     notification.action_id
                                    }
                                }
                            }, 
                            function(err, result1){
                                if(err){
                                    status= false;
                                }else{
                                    if(result1.nModified == 1){
                                        status =  true;
                                    }else{
                                        status =  false;
                                    }
                                }
                              
                                cb(status)
                            }
                        )
                    
                }

Notify.remove = function(notification, cb){
    var status = false;
    User.update(
        {
            _id:notification.user_id
        },
        {
            $inc:{
                new_notification_count:-1
            },
            $pull:{
                notifications:{
                    action_id:notification.action_id
                }
            }
        }, 
        function(err, unlike_notify){
            if(err){
                status= false;
            }else{
                if(unlike_notify.nModified == 1){
                    status =  true;
                }else{
                    status =  false;
                }
            }
          
            cb(status)
        }
    )
}

module.exports = Notify;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({

	name: {
		type: String,
		required:true,
	},
	email : {
		type: String,
		required: true,
		unique: true
	},
	phone :{
        type: String
    },
	password : {
		type: String,
		required: true
    },
    new_notification_count:{
        type:Number
    },
    notifications:[{
            user_id:Schema.ObjectId,
            action_id:Schema.ObjectId,
            like:{
                type:Number,
                default:0
            },
            comment:{
                type:Number,
                default:0
            },
            action_id:Schema.ObjectId,
            value:String,
            blog_id:Schema.ObjectId,
            timestamp:{
                type: Date,
                default: Date.now
            }
    }],
	timestamp : { 
		type: Date,
		default: Date.now
	},

});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});


UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
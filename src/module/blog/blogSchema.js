var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	user_id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	image:{
		path: {
			type: String,
		},
		name: {
			type: String,
		}
	},
	total_likes:{
		type:Number
	},
	like_users:[{
		user_id: Schema.ObjectId,
		timestamp:{
			type: Date,
			default: Date.now
		} 
	}],
	total_comments:{
		type:Number
	},
	comment_users:[{
		user_id: Schema.ObjectId,
		comment:String,
		timestamp:{
			type:Date,
			default:Date.now
		}
	}],
	timestamp:{
		type: Date,
		default: Date.now
	}

});

// BookSchema.pre('save', function(next){
// 	var book = this;

// });

module.exports = mongoose.model('blogs', BlogSchema);
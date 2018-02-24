var jwt = require('jsonwebtoken');
var slug = require('slug');
var Blog = require('./blogSchema');
var User = require('./../user/userSchema');
var Notify = require('./../user/notification');
var userInfo = require('./../common/index');
var ObjectId = require('mongoose').Types.ObjectId; 
var blog = {};

blog.save = function(req, res){
	var info = userInfo(req.headers.authorization);
	var blog_slug = slug(req.body.title);
	var newBlog = new Blog({
		user_id : info._id,
		title : req.body.title,
		slug : blog_slug,
		description: req.body.description,
		/* image:{
			path: req.body.image_path,
			name: req.body.image_name
		} */
	});
	Blog.findOne({slug: blog_slug}, function(err, blog){
		if(blog===null ){
			newBlog.save(function(err) {
				if(err)
					res.json({msg : err._message, errors : err.errors});
				else
					 res.json({status:"success", msg:"New blog created successfully."});
			});
		}else{
			res.json({status:false, msg:"This title is already exist."});
		}
	});
}

blog.getAll = function(req, res){
	var info = userInfo(req.headers.authorization);
	Blog.find({user_id:info._id}).sort({timestamp:-1}).exec(function(err, data){
		if(err)
			res,json(err)
		else
			res.json(data);
	})
}

blog.like = function (req, res){
	var info = userInfo(req.headers.authorization);
	Blog.find({"_id":req.body.blog_id,'like_users.user_id':info._id}, function(err, result){
		if(err)
			res.json(err)
		else{
			if(result.length == 0){
				Blog.update({"_id":req.body.blog_id},{  $inc:{total_likes: 1}, $push:{ like_users:{user_id:info._id} }}, function(err, like_result){
					if(err)
						res.json(err)
					else{
						if(like_result.nModified == 1){
							
							Blog.findById(req.body.blog_id,function(err,blog){
								if(err)
									res.json(err)
								else{
									if(blog.user_id !== info._id){
										var noti={};
										noti.user_id = blog.user_id;
										noti._id	 = info._id;
										noti.info	 = "like your blog";
										noti.blog_id = req.body.blog_id;
										noti.like = 1;
										noti.comment = 0;
										noti.action_id = blog.like_users[blog.like_users.length-1]._id;
										Notify.create(noti, function(response){
											if(response){
												res.json({action:"like",status:true,like_users:{user_id:info._id,timestamp:Date.now}});
											}else{
												res.json({status:false,aciton:"like"})
											}
										})
										
									}else{
										res.json({action:"like",status:true,like_users:{user_id:info._id,timestamp:Date.now}});
									}
								}
							})
						}else{
							res.json({status:false})
						}
						
					}
				});
			}else{
				var blg='';
				Blog.findById(req.body.blog_id,function(err,blog){
					blg = blog;
				})
				Blog.update({"_id":req.body.blog_id},{  $inc:{total_likes: -1}, $pull:{ like_users:{user_id:info._id} }}, function(err, unlike_result){
					if(err)
						res.json(err)
					else{
						if(unlike_result.nModified == 1){
							var action_id = '';
							blg.like_users.map(function(usr, index){
								if(usr.user_id == info._id)
									action_id = usr._id
							})
							var noti = {};
							noti.user_id = blg.user_id;
							noti.action_id = action_id;
							if(blg.user_id !== info._id){

								Notify.remove(noti, function(response){
									if(response){
										res.json({action:"unlike",status:true,user_id:info._id});
									}else{
										res.json({status:false})
									}
								})
							}else{
								res.json({action:"unlike",status:true,user_id:info._id});
							}
						
						}
						else
							res.json({status:false})
					}
				}); 
			}
		}
	});
}

blog.comment = function (req, res){
	var info = userInfo(req.headers.authorization);
	Blog.update({"_id":req.body.blog_id},{  $inc:{total_comments: 1}, $push:{ comment_users:{user_id:info._id,comment:req.body.comment } }}, function(err, result){
		if(err)
			res.json(err)
		else
			res.json(result);
	});	 
}

blog.removeComment = function (req, res){
	var info = userInfo(req.headers.authorization);
	Blog.update(
				{_id:req.body.blog_id,'comment_users._id':req.body.comment_id},
				{  $inc:{total_comments: -1}, $pull:{ comment_users:{_id:req.body.comment_id, user_id:info._id } }}, function(err, result){
		if(err)
			res.json(err)
		else{
			if(result.nModified == 1)
				res.json({status:true});
			else	
				res.json({status:false})
		}
	});	
}

blog.blogDetail = function(req, res){
	var blog_id = req.params.blog_id;
	Blog.aggregate([
					{
						$match:{
							_id:  ObjectId(blog_id)
						}
					},{
						$lookup:{
							from:"users",
							localField:"comment_users.user_id", 
							foreignField:"_id",
							as:"user_detail"
						}
					},{
						$project:{
							user_id:1,
							slug:1,
							title:1,
							description:1,
							total_likes:1,
							like_users:1,
							total_comments:1,
							comment_users:1,
							image:1,
							timestamp:1,
							user_detail:{name:1,_id:1}
						}
					}
				]).exec(function(err,data){
					if(err)
						res,json(err)
					else
						res.json(data);
				})
}


blog.getAllBlogs = function(req, res){
	Blog.find({}).sort({timestamp: -1}).exec(function(err, data){
		if(err)
			res,json(err)
		else
			res.json(data);
	})
}

blog.delete =function(req, res){
	var info = userInfo(req.headers.authorization);
	Blog.remove({_id:req.body.blog_id, user_id: info._id}, function(err, data){
		if(err)
		res,json(err)
	else
		res.json(data);
	});
}


module.exports = blog;
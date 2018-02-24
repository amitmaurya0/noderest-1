var blog = require('./blog');
var routes = require('express').Router();

routes.get('/all',blog.getAllBlogs);
routes.post('/add',blog.save);
routes.post('/like',blog.like);
routes.post('/comment',blog.comment);
routes.post('/comment/remove',blog.removeComment);

routes.get('/my-blogs',blog.getAll);
routes.delete('/delete',blog.delete);
routes.get('/:blog_id',blog.blogDetail);

module.exports = routes;
  
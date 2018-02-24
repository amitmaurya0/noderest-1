
var modules =require('./module/index');

module.exports = function(app){
	app.use('/api/v1/', modules);
}
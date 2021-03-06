var keystone = require('keystone'),
	common = require('../common');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	var rebecca = keystone.list('Their Story');
	 
	rebecca.model.find()
		.exec(function(err, stories) {
			
		view.render('home/ts_rebecca', {
			amanda: 	stories.filter(common.getItemByKey, "amanda")[0],
			rebecca: 	stories.filter(common.getItemByKey, "rebecca")[0],
			marcus: 	stories.filter(common.getItemByKey, "marcus")[0]
		});	
	});
};

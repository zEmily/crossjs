// controller
var home = {
	template: 'index',
	index: function(res, req) {
		var params
		var today = new Date()
		params.date = {
			'year': today.getFullYear(),
			'month': today.getMonth(), 
			'date': today.getDate(),
			'day': today.getDay()
		}
		console.log(params);
		res.render('hello', {params: params});
		console.log("hah")

	}
}
module.exports = home;
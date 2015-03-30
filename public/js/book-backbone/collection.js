var app = app || {}
(function() {
	'use strict'

	var Books = Backbone.Collection.extend({
		modal: app.Book,
		localStorage: new Backbone.LocalStorage('books'),
		orderExist: function(id)  {
			return this.where({id: id})
		}
	})
	app.books = new Books()


})();
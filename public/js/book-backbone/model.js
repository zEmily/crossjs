var app = app || {};

(function () {
	'use strict';

	app.Book = Backbone.Model.extend({
		// Default attributes for the book
		defaults: {
			id: '',
			name: '',
			num: 0
		},

		// Toggle the `num` state of this book item.
		increase: function () {
			console.log(this)
			this.save({
				num: this.get('num') + 1
			});
		},
		decrease: function() {
			this.save({
				num: this.get('num') - 1
			})
		}
	});
})();

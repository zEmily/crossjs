/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Router
	// ----------
	var TodoRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.bookFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Todo view items
			app.books.trigger('filter');
		}
	});

	app.TodoRouter = new TodoRouter();
	Backbone.history.start();
})();

/*
void function() {
	var author = function () { console.log('author'); };
	var books = function () { console.log('books'); };
	var buyBook = function (bookId) {
		console.log('111buybook: ' + bookId);
	};
	var routes = {
		'/author': author,
		'/books': [books, function() {
			console.log('An inline route handler.');
		}],
		'/books/view/:bookId': buyBook
	};
	var router = Router(routes);
	router.init();
}()
*/

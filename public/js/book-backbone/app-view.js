var app = app || {}
// set underscore template config
var _templateConfig = {
	interpolate : /<%-([\s\S]+?)%>/g,
	escape      : /<%=([\s\S]+?)%>/g,
	variable: 'data'
}
function updateSettings() {
	_.extend(_.templateSettings, _templateConfig)
}
updateSettings()

// TODO: 先弄一个booklist，其他的之后再看
~function () {
	'use strict'

	app.AppView = Backbone.View.extend({
		el: ".bookList",
		statsTemplate: _.template(
			'<div class="add-item">hahah</div>'
		),
		events: {
			'click .add-item': 'addItem'
		},
		initialize: function() {
			this.$btn = this.$('.add-item')
			this.listenTo(app.books, "add", this.render)
		},
		render: function () {
			this.$el.html(this.statsTemplate({p:"hahah"}))
			console.log("aaaa")
		},
		newBookOrder: function() {
			return {
				// TODO: 这里一定找到对应的btn~~不知道可以不~~~不可以的话~~可能要转到小view，或者看下event的设置
				name: this.$btn.data('name'),
				id: this.$btn.data('id'),
				num: 0
			}
		},
		addItem: function() {
			// 假如没有添加过，就创建；不然就只增加
			if (app.books.orderExist(this.$btn.data('id'))) {
				app.books.create(this.newBookOrder)
			} else {
				//this.model.set({num:})
				console.log('需要增加一个计数')
			}
		}
	})

}();
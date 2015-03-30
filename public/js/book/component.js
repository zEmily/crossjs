(function(exports){

	// set underscore template config
	var _config = {
		interpolate : /<%-([\s\S]+?)%>/g,
		escape      : /<%=([\s\S]+?)%>/g,
		variable: 'data'
	}
	function updateSettings() {
		_.extend(_.templateSettings, _config)
	}
	updateSettings()

	var Component = {},
		UI = {}


	Component.header = function() {
		var $container = $('<div class="header-component"></div>')
		$container.on('click', 'a', function(e) {
			e.preventDefault()
			var $target = $(e.target)
			var eventType = 'action.' + $target.data('trigger')
			var eventValue = $target.attr('href')
			EC.trigger(eventType, eventValue)

			//$('form').trigger('title_add', eventValue)
		})
		return {
			render: function(_data) {
				var templateHtml = UI.headerTemplate(_data)
				$container.html(templateHtml)
				return $container
			}
		}
	}

	Component.author = function() {
		var $container = $('<div class="author-component"></div>')
		$container.on('click', 'li', function(e) {
			var $target = $(e.target)
			var eventType = 'action.' + $target.data('trigger')
			var eventValue = $target.data('name')
			EC.trigger(eventType, eventValue)

			//$('form').trigger('title_add', eventValue)
		})
		return {
			render: function(_data) {
				var templateHtml = UI.authorTemplate(_data)
				$container.html(templateHtml)
				return $container
			}
		}
	}
	Component.book = function() {
		var $container = $('<div class="book-component"></div>')
		$container.on('click', 'a', function(e) {
			var $target = $(e.target)
			var eventType = 'action.' + $target.data('trigger')
			if (eventType == 'action.addToCart') {
				var item = $target.closest('li'),
					id = $target.data('id'),
					name = item.find('h2').text(),
					originPrice = $target.data('priceorigin'),
					finalPrice = $target.data('pricefinal'),
					company = $target.data('company'),
					images = item.find('img').attr('src')

				EC.trigger(eventType, [id, name, originPrice, finalPrice, company, images])
			} else if (eventType == 'action.getMore'){
				var page = $target.data('page')
				EC.trigger(eventType, page)
			}

			//$('form').trigger('title_add', eventValue)
		})
		return {
			render: function(_data) {
				var templateHtml = UI.bookTemplate(_data)
				$container.html(templateHtml)
				return $container
			}
		}
	},
	Component.moreItems = function() {
		return {
			html: function(_data) {
				var templateHtml = UI.moreItemsTemplate(_data)
				return templateHtml
			}
		}

	}
	Component.simpleCartBar = function() {
		var $container = $('<div class="simple-cart-bar-component"></div>')
		// TODO: 需要了解在cart详情页操作加加减减之后，点击返回，底栏的数据是不是正确的数字
		return {
			render: function(_data) {
				var templateHtml = UI.simpleCartBarTemplate(_data)
				$container.html(templateHtml)
				return $container
			}
		}
	}

	Component.cart = function() {
		var $container = $('<div class="cart-component"></div>')
		$container.on('click', 'a', function(e) {
			var $target = $(e.target)
			var eventType = 'action.' + $target.data('trigger')
			var eventValue = $target.data('change')
			var id = $target.data('id')
			EC.trigger(eventType, [eventValue, id])
		})
		return {
			render: function(_data) {
				var templateHtml = UI.cartTemplate(_data)
				$container.html(templateHtml)
				return $container
			}
		}
	}

	Component.order = function() {
		var $container = $('<div class="order-component"></div>')
		/*$container.on('click', 'a', function(e) {
			var $target = $(e.target)
			var eventType = 'action.' + $target.data('trigger')
			var eventValue = $target.data('change')
			var id = $target.data('id')
			EC.trigger(eventType, [eventValue, id])
		})*/
		return {
			render: function(_data) {
				var templateHtml = UI.orderTemplate(_data)
				$container.html(templateHtml)
				return $container
			}
		}
	}

	UI = {
		headerTemplate: _.template(
			'<a href="<%=data.backLink%>" class="back" data-trigger="changeRouter">返回</a><h1><%= data.pageTitle%></h1>'
		),
		authorTemplate: _.template(
			'<ul>'+
			'<% $.each(__data.authors, function(index, item) {%>' +
			'<% if(data.selected == item) {%>'+
			'<li data-name="<%= item%>" class="tab-active" data-trigger="changeAuthor"><%= item%></li>'+
			'<%}else{%>'+
			'<li data-name="<%= item%>" data-trigger="changeAuthor"><%= item%></li>'+
			'<%}%>'+
			'<%}) %>' +
			'</ul>'
		),
		bookTemplate: _.template(
			'<ul>'+
			'<%$.each(data.list, function(index, item){%>' +
			'<li><img src="<%= item.images%>"><h2><%= item.name%></h2><p><%= item.price.final%></p><del><%= item.price.origin%></del>' +
			'<a href="###" data-trigger="addToCart" data-id="<%= item.objectId%>" data-priceOrigin="<%= item.price.origin%>" data-priceFinal="<%= item.price.final%>" data-company="<%= item.company%>">借书吧</a></li>'+
			'<%})%>'+
			'</ul>'+
			'<% if (data.more) {%>'+
			'<a class="more" data-trigger="getMore" data-page="<%=data.page%>">更多</a>'+
			'<%}%>'
		),
		moreItemsTemplate: _.template(
			'<%$.each(data, function(index, item){%>' +
			'<li><img src="<%= item.images%>"><h2><%= item.name%></h2><p><%= item.price.final%></p><del><%= item.price.origin%></del>' +
			'<a href="###" data-trigger="addToCart" data-id="<%= item.objectId%>" data-priceOrigin="<%= item.price.origin%>" data-priceFinal="<%= item.price.final%>">借书吧</a></li>'+
			'<%})%>'
		),
		simpleCartBarTemplate: _.template(
			'<div class="stick-bar">共<%= data.num%>本书，共<%= data.price%>元' +
			'<% var href = data.price ? "#/cart" : "###"%>' +
			'<a href="<%= href%>" class="">去结算</a>' +
			'</div>'
		),
		cartTemplate: _.template(
			'<div class="cart">'+
			'<%var totalPrice = 0%>'+
			'<%var feesTotalPrice = 0%>'+
			'<% $.each(data.list, function(company, items){ %>' +
			'<%if (company != "undefined"){%>'+
			'<div class="cart-container">'+
			'<%var cartPrice = 0%>'+
			'<% var thisCompany = _.where(__data.company, {objectId: company})[0]%>'+
			'<h2><%= thisCompany.name%></h2>'+
			'<ul>'+
			'<%$.each(items, function(index, item){%>' +
			'<%if (item.num > 0) {%>'+
			'<% var itemTotalPrice = item.num * item.finalPrice%>'+
			'<% cartPrice += itemTotalPrice%>'+
			'<li>' +
			'<img src="<%= item.images%>"><h2><%= item.name%></h2><p><%= item.finalPrice%></p>' +
			'<div class="count-container">'+
			'<div class="counter">'+
			'<a href="###" data-trigger="changeNum" data-change="add" data-id="<%= item.id%>">+</a></li>'+
			'<span><%= item.num%></span>'+
			'<a href="###" data-trigger="changeNum" data-change="reduce" data-id="<%= item.id%>" >-</a></li>'+
			'</div>'+
			'<span>小计：</span><strong><%= itemTotalPrice%></strong>'+
			'</div>'+
			'</li>'+
			'<%}%>'+
			'<%})%>'+
			'</ul>'+
			'<% var free = thisCompany.delivery.free%>'+
			'<% fees = thisCompany.delivery.fees%>'+
			'<p class="cart-info">' +
			'<%if (cartPrice < free) {%>'+
			'<% feesTotalPrice += fees%>'+
			'<span>运费<%=thisCompany.delivery.fees%> 元，购物满<%= free%>元免运费</span>' +
			'<span>￥<%=cartPrice + fees%></span>(含运费￥<%=fees%>)</p>'+
			'<%} else {%>' +
			'<% fees = 0%>'+
			'<span>￥<%=cartPrice%></span>(免运费)</p>'+
			'<%}%>'+
			'<% totalPrice += cartPrice + fees%>'+
			'</div>'+
			'<%}%>'+
			'<%})%>'+
			'</div>'+
			'<div class="stick-bar"><%= totalPrice%>元,共计<%= data.num%>件' +
			'<%if (feesTotalPrice) {%>'+
			'<% itemData.total.fees = feesTotalPrice%>'+
			'<span>含运费￥<%= feesTotalPrice%></span>' +
			'<%}else{%>'+
			'<span>免运费</span>'+
			'<%}%>'+
			'<% var href = totalPrice ? "#/order" : "###"%>' +
			'<a href="<%= href%>" class="">结算</a>' +
			'</div>'
		),
		orderTemplate: _.template(
			'<div class="container">' +
			'<h2>收货信息</h2>'+
			'<div class="line"><%=data.campus.name%></div>'+
			'<div class="line"><label>地址</label><input id="address" type="text" placeholder="请输入您需要配送的地址"/></div>'+
			'<div class="line"><label>手机号码</label><input id="mobile" type="text" placeholder="请输入您的手机号码"/></div>'+
			'</div>'+
			'<div class="container">' +
			'<h2>支付方式</h2>'+
			'<div class="line">货到付款</div>'+
			'</div>'+
			'<div class="container">' +
			'<% $.each(data.list, function(company, items){ %>' +
			'<%if (company != "undefined"){%>'+
			'<div class="cart-container">'+
			'<% var thisCompany = _.where(__data.company, {objectId: company})[0]%>'+
			'<h2><%= thisCompany.name%></h2>'+
			'<ul>'+
			'<%$.each(items, function(index, item){%>' +
			'<%if (item.num > 0) {%>'+
			'<li>' +
			'<img src="<%= item.images%>"><h2><%= item.name%></h2>' +
			'<div><p>￥<%= item.finalPrice%></p>' +
			'<p>x <%= item.num%></p>' +
			'</div>' +
			'</li>'+
			'<%}%>'+
			'<%})%>'+
			'</ul>'+
			'</div>'+
			'<%}%>'+
			'<%})%>'+
			'<div class="line"><label>配送时间</label>'+
			'<select id="time">' +
			'<option value="">请选择您需要配送的时间段</option>'+
			'<%$.each(data.campus.delivery, function(index, time){%>' +
			'<option value="<%=time%>"><%=time%></option>'+
			'<%})%>'+
			'</select>' +
			'</div>'+
			'<div class="line"><input id="remarks" placeholder="给卖家留言："/></div>'+
			'<div class="line"><p>共<%= data.total.num%>件商品 合计：￥<%=data.total.price + data.total.fees%></p></div>'+
			'<div class="line"><p>运费：￥<%= data.total.fees%></p></div>'+
			'</div>'
		)
	}
	exports.Component = Component

})(window)
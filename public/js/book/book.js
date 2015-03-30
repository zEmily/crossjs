(function(){
	// TODO: 其实也可以考虑把这些值都记在localStorage。以免用户不小心刷新浏览器~~~虽然现在没啥问题~~~提交完一单之后就清空storage
	// storage 的数据同步方式：每次增加和减少的东西，都记录进去；一单结束就清空
	// storage 记载的好处，用户退出微信单页，但未成交时，它的购物车记录还是在的~~~
	//              缺点： 数据读写多了一步，或许会影响一点性能

	// itemData 更多像是用户操作所变化的东西
	itemData = {
		selected: {
			items: {},
			campus: {
				key: '999',
				name: '蛋蛋大学',
				business: "10:00,24:00",
				delivery: ["中午：12:30 ~ 13:30","下午：16:30 ~ 17:30","晚上：20:30 ~ 21:30"]
			}
		},
		pageInfo: {
			author: '鲁迅',
			page: 'xxx',
			pageTitle: '书架',
			backLink: '###'
		},
		// 不含运费
		total: {
			price: 0,
			fees: 0,
			num: 0
		}
	}
	// __data 一般存放由ajax取得东西
	__data = {
		authors: ['郁达夫', '鲁迅'],
		company:[
			{
				objectId: '12345sss',
				name: '蛋蛋之家',
				delivery: {
					fees: 5,
					free: 40
				}
			},
			{
				objectId: '23456aaa',
				name: 'otherFamily',
				delivery: {
					fees: 10,
					free: 20
				}
			}

		],
		books: {
			page: 1,
			more: true,
			list: [
				{
					objectId: 11111,
					name: "狂人日记",
					images: "/img/1.png",
					price: {
						origin: 30,
						final:  28
					},
					company: '12345sss'
				},
				{
					objectId: 222,
					name: "呐喊",
					images: "/img/2.png",
					price: {
						origin: 20,
						final:  18
					},
					company: '12345sss'
				},
				{
					objectId: 333,
					name: "阿Q正传",
					images: "/img/3.png",
					price: {
						origin: 40,
						final:  32
					},
					company: '23456aaa'
				}
			]
		}
	}

	console.log('test')
	var $listPage = $('.book-list-page'),
		$cartPage = $('.cart-page'),
		$orderPage = $('.order-page')

	var $header = $('.header'),
		$authorElem = $('.author'),
		$bookListElem = $('.bookList'),
		$simpleCartBar = $('.simple-cart')

	var header = Component.header(),
		author = Component.author(),
		bookList = Component.book(),
		simpleCartBar = Component.simpleCartBar(),
		moreItems = Component.moreItems(),
		cart = Component.cart(),
		order = Component.order()

	function renderHeader() {
		$header.append(header.render(itemData.pageInfo))
	}
	function renderAuthor() {
		$authorElem.append(author.render({
			selected: itemData.pageInfo.author
		}))
	}
	function renderBooks() {
		$bookListElem.append(bookList.render(__data.books))
	}

	function renderMoreItems() {
		var $moreElem = $bookListElem.find('.more'),
			htmlString = moreItems.html(__data.books.list)

		$(htmlString).insertBefore($moreElem)
		// 点此获取更多信息
		if (__data.books.more) {
			$moreElem.data('page', __data.books.page)
		} else {
			$moreElem.remove()
		}
	}

	function renderSimpleCartBar() {
		$simpleCartBar.append(simpleCartBar.render({
			num: itemData.total.num,
			price: itemData.total.price
		}))
	}

	// this is init listing page
	function renderList() {
		itemData.pageInfo.pageTitle = itemData.selected.campus.name
		$listPage.show()
		renderHeader()
		renderAuthor()
		renderBooks()
		renderSimpleCartBar()
	}

	function renderCart() {
		itemData.pageInfo.pageTitle = '购物车'
		itemData.pageInfo.backLink = 'list'
		// TODO:这里做判断，如果购物车清空了，就直接返回到listing
		var itemKeys = _.keys(_.groupBy(itemData.selected.items, 'company'))
		if (itemKeys != "undefined" ) {
			$cartPage.append(cart.render({
				list:_.groupBy(itemData.selected.items, 'company'),
				num: itemData.total.num
			}))
			renderHeader()
			$cartPage.show()
		} else {
			$cartPage.hide()
			router.setRoute('list')
		}
	}

	function renderOrder() {
		itemData.pageInfo.pageTitle = '确认订单'
		itemData.pageInfo.backLink = 'cart'
		var itemKeys = _.keys(_.groupBy(itemData.selected.items, 'company'))
		if (itemKeys != "undefined" ) {
			$orderPage.append(order.render({
				list:_.groupBy(itemData.selected.items, 'company'),
				total: itemData.total,
				campus: itemData.selected.campus
			}))
			renderHeader()
			$cartPage.hide()
			$orderPage.show()
		} else {
			$cartPage.hide()
			router.setRoute('list')
		}

	}

	window.EC = $({})

	EC.on('action.changeRouter', function(e, backLink) {
		// 需要根据view的种类来分流 --> 根据backLink来
		switch (backLink) {
			case 'list':
				router.setRoute('list')
				EC.trigger('view.renderList')
				$cartPage.hide()
				$orderPage.hide()
				break
			case 'cart':
				router.setRoute('cart')
				EC.trigger('view.renderCart')
				$orderPage.hide()
				$listPage.hide()
		}

	})

	EC.on('action.changeAuthor', function(e, selectAuthor) {
		// 由于这里涉及到ajax操作，所以只有author变化时才去取
		if (selectAuthor != itemData.pageInfo.author) {
			itemData.pageInfo.author = selectAuthor
			// TODO: ajax 去获取新的bookList
			EC.trigger('view.renderList')
		}
	})

	EC.on('action.getMore', function(e, page) {
		// 由于这里涉及到ajax操作，所以只有author变化时才去取
		// TODO:这里的数据先mock一份 直接返回books。然后合并进入__data
		var json = {
				page: 2,
				more: false,
				list: [
				{
					objectId: 4444,
					name: "春天",
					images: "/img/4.png",
					price: {
						origin: 30,
						final:  28
					},
					company: '12345sss'
				},
				{
					objectId: 555,
					name: "夏天",
					images: "/img/5.png",
					price: {
						origin: 20,
						final:  18
					},
					company: '12345sss'
				},
				{
					objectId: 666,
					name: "秋天",
					images: "/img/6.png",
					price: {
						origin: 40,
						final:  32
					},
					company: '23456aaa'
				}
			]
		}
		$.extend(true, __data.books, json)
		renderMoreItems()
	})

	EC.on('action.addToCart', function(e, id, name, originPrice, finalPrice, company, images) {
		// TODO: 这一块的判断不知道不是不不足，记得测试； 其实这种数据互动是可以抽出一个api来的，这样很直观。可以参考backbone的save，destroy等等
		// 变更选中item的数据
		if (!itemData.selected.items[id] || _.isEmpty(itemData.selected.items[id])) {
			itemData.selected.items[id] = {}
			$.extend(true, itemData.selected.items[id], {
				id: id,
				name: name,
				originPrice: originPrice,
				finalPrice: finalPrice,
				num: 1,
				company: company,
				images: images
			})
		} else {
			itemData.selected.items[id].num += 1
		}
		// 变更total的数据
		itemData.total.num += 1
		itemData.total.price += finalPrice

		EC.trigger('view.renderSimpleCartBar')
	})

	// 购物车里的事件 +1 ，-1
	EC.on('action.changeNum', function(e, action, id) {
		switch (action){
			case 'add':
				itemData.selected.items[id].num += 1
				itemData.total.num += 1
				itemData.total.price += itemData.selected.items[id].finalPrice
				break
			case 'reduce':
				itemData.selected.items[id].num -=1
				itemData.total.num -= 1
				itemData.total.price -= itemData.selected.items[id].finalPrice
				// 当减少到0时，就删掉这条记录
				if (itemData.selected.items[id].num <= 0) {
					itemData.selected.items[id] = {}
				}
				break
		}
		EC.trigger('view.renderCart')

	})

	// listing EC view
	EC.on('view.renderList', function() {
		renderList()
	})

	EC.on('view.renderHeader', function() {
		renderHeader()
	})
	EC.on('view.renderAuthor', function() {
		renderAuthor()
	})
	EC.on('view.renderBooks', function() {
		renderBooks()
	})
	EC.on('view.renderSimpleCartBar', function() {
		renderSimpleCartBar()
	})

	// Cart EC view
	EC.on('view.renderCart', function() {
		renderCart()
	})

	EC.on('view.renderOrder', function(){
		renderOrder()
	})

	// router
	var listView = function() {
		EC.trigger('view.renderList')
	}
	var cartView = function() {
		// TODO: 在直接输入link的地方要判一下，如果是没有data的，就应该天去listing等地方，或者选择学校那里。这里是需要一系列的防错的
		$listPage.hide()
		EC.trigger('view.renderCart')
	}
	var orderView = function() {
		$cartPage.hide()
		EC.trigger('view.renderOrder')

	}
	var routes = {
		'/list': listView,
		'/cart': cartView,
		'/order': orderView
	}
	var router = Router(routes);
	router.init()

	renderList()

})()
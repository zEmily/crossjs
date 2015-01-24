var f=1; 
if(window.DeviceMotionEvent) { 
	var speed = 30;//定义一个数值 
	var x = y = z = lastX = lastY = lastZ = 0;//重置所有数值 
	window.addEventListener('devicemotion', function(){ 
		var acceleration =event.accelerationIncludingGravity;//将传感值赋给acceleration 
		x = acceleration.x; 
		y = acceleration.y; 
		z = acceleration.z; 
		if(Math.abs(x-lastX) > speed || Math.abs(y-lastY) > speed ) { 
			// TODO:在此处可以实现摇一摇之后所要进行的数据逻辑操作 
			if(f==1){ 
				$('#imgLogo').attr('src', 'img/ling.gif') 
				setTimeout(function() {
					alert('开始解签')
					$('#imgLogo').attr('src', 'img/tiao.png'),
					$('.luck-txt') .text('哈哈哈，今天天气很好呀')
				}, 4000)
			f=0; 
			} 
		} 
		lastX = x; 
		lastY = y; 
		lastZ = z; 
	}, false); 
} else {
	$('input').css({display: 'block'})
}
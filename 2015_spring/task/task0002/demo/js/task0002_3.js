var boxArr = $('.boxList span');
var nextID = 1;
var activeID = 1;
var imgList = $('.imageList');
var imgArr = $('.imageList img');
var imgLength = imgArr[0].offsetWidth;
var timer = null;
var timerInterval = 3000;

function init() {
	var len = imgArr.length;
	for(i = 0; i < len; i++) {
		imgArr[i].style.left = i * imgLength + 'px';
	}
	timer = setInterval(rotate, timerInterval);
}

function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		var r = getComputedStyle(obj,false)[attr];
		return r;
	}
}

function startMove(obj, len) {
	clearInterval(obj.timeImageChange);
	obj.timeImageChange = setInterval(function () {
		var speed = (len - parseFloat(getStyle(obj, 'left'))) / 5;
		//console.log(obj, len, parseFloat(getStyle(obj, 'left')));
		speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
		obj.style.left = parseFloat(getStyle(obj, 'left')) + speed + 'px';
	}, 50);
}

function rotate(id) {
	if(id){ //鼠标点击轮播
		nextID = id;
	} else { //自动轮播
		nextID = activeID === 5 ? 1 : activeID + 1;
	}

	removeClass(boxArr[activeID-1], 'active');
	addClass(boxArr[nextID-1], 'active');
	if(activeID < nextID) {
		imgArr[nextID-1].style.left = imgLength + 'px';
		startMove(imgArr[activeID-1], -imgLength);
	} else if(activeID > nextID) {
		imgArr[nextID-1].style.left = -imgLength + 'px';
		startMove(imgArr[activeID-1], imgLength);
	}
	startMove(imgArr[nextID-1], 0);

	activeID = nextID;
}


init();
$.click($('.boxList'), function(e) {
	clearInterval(timer);
	console.log(e);
	var spanNode = e.target;
	var idClick = parseInt(spanNode.getAttribute('rel'));
	console.log(idClick);
	if(idClick >= 1 && idClick <= 5) {
		// imgArr[idClick-1].style.left = 0 + 'px';
		rotate(idClick);
	}
	timer = setInterval(rotate, timerInterval);
});
var leftBlock = $('.l-block');
var rightBlock = $('.r-block');
var singleBlockHeight = $('.s-block')[0].offsetHeight;
var zIndex = 1;
var parentBlock = leftBlock.parentNode;
var rightBlockX = rightBlock.offsetLeft;

function initPosition(obj) {
	var num = obj.children.length;
	for(var i = 0; i < num; i++) {
		obj.children[i].style.top = i * singleBlockHeight + 1 + 'px';
	}
}

function checkPosition(x, y, block) {
    var x0 = getPosition(block).x;
    var x1 = getPosition(block).x + block.offsetWidth;
    var y0 = getPosition(block).y;
    var y1 = getPosition(block).y + block.offsetHeight;
    console.log(x0, x1);
    return x > x0 && x < x1 && y > y0 && y < y1; 
}

function drag(e) {
	var ev = e || window.event;
	var target = ev.target || ev.srcElement;
	if(target.className.toLowerCase() !== 's-block') {
		return;
	}
	//鼠标开始移动坐标
	var mouseX = ev.clientX;
	var mouseY = ev.clientY;
	//目标方框初始位置
	var moveBlockX = target.offsetLeft;
	var moveBlockY = target.offsetTop;
	console.log(mouseX, mouseY, moveBlockX, moveBlockY);

	target.style.border = 'border: 1px solid #000';
	target.style.zIndex = zIndex++;
	target.style.opacity = 0.5;

	var parentNode = target.parentNode;
	var first = true;

	//点击鼠标拖动
	window.onmousemove = function (e) {
		if(first) {
			parentNode.removeChild(target);
			parentBlock.appendChild(target);
		}
		first = false;
		var ev = e || window.event;

		target.style.left = moveBlockX + ev.clientX - mouseX + 'px';
		target.style.top = moveBlockY + ev.clientY - mouseY + 'px';
		initPosition(parentNode);
	};
	//松开鼠标
	window.onmouseup = function (e) {
		window.onmousemove = null;
		window.onmouseup = null;
		target.style.opacity = 1;

		var ev = e || window.event;

		target.parentNode.removeChild(target);
		if(checkPosition(ev.clientX, ev.clientY, leftBlock)){
			target.style.left = 1 + "px";
			leftBlock.appendChild(target);
			initPosition(leftBlock);
		} else if(checkPosition(ev.clientX, ev.clientY, rightBlock)){
			target.style.left = rightBlockX + 1 + "px";
			rightBlock.appendChild(target);
			initPosition(rightBlock);
		} else {
			if(parentNode.className.search('l-block') != -1) {
				target.style.left = 1 + "px";
			} else if(parentNode.className.search('r-block') != -1) {
				target.style.left = rightBlockX + 1 + "px";
			}
			parentNode.appendChild(target);
			initPosition(parentNode);
		}
	}
}

function init() {
	initPosition(leftBlock);
	initPosition(rightBlock);

	$.delegate(leftBlock, 'div', 'mousedown', drag);
	$.delegate(rightBlock, 'div', 'mousedown', drag);
}


init();

// var a = {
// 	a: 1,
// 	b: '1'
// };
// console.dir(a);

// function Person(name) {
// 	this.name = name;
// 	this.sayName = function(){
// 		console.log(this.name);
// 	};
// }
// Person.prototype.age = 20;
// Person.prototype.sayAge = function () {
// 	console.log(this.age);
// };
// Person.prototype = {
// 	constructor: Person, //必须重新指定构造函数
// 	name: 'li',
// 	age: 20,
// 	sayName: function(){
// 		console.log(this.name);
// 	},
// 	sayAge: function(){
// 		console.log(this.age);
// 	}
// };

 // Person.prototype = new Person();
// var person1 = new Person('li1');
// var person2 = new Person('li2');
// console.log(person1.sayName === person2.sayName, person1.sayAge === person2.sayAge);
// console.log(Person.prototype);
// // console.log(Person.prototype.isPrototypeOf(person1));
// // console.log(typeof Person.prototype.sayAge, typeof arguments);
// var x = 10;
// function howManyArgs(x) {
// 	// var max = 10;
// 	console.log(x);
// 	return function (y) {
// 		console.log(x, y);
// 	}
// }

// var how = howManyArgs(1);
// var how2 = howManyArgs(2);
// x = 30;
// how(3);
// how2(4);
// console.log('2' + max);
// 
function constfuncs(i) {

		return	function () {
				console.log(i);
				return i;
		};
	}
	var funcs = [];

	for(var i = 0; i < 10; i++) {
		funcs[i] = constfuncs(i);
	//return funcs;
}

//var funcs = constfuncs();
funcs[6]();
console.log((function(v) {
	console.log(v);
})(2), constfuncs(3));


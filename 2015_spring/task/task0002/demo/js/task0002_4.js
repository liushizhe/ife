var suggestData = ['a', 'abandon', 'abdomen', 'abide', 'ability', 'able', 'abnormal', 'aboard', 'abolish', 'abound', 'about', 'above', 'fiction', 'field', 'fierce', 'fight', 'test2', 'test3'];

var ulList = $('ul');
var inputBox = $('input');

//输入框输入字符处理
function handleInput(input) {
	//console.log(input);
	var pattern = new RegExp('^' + input, 'i');
	var len = suggestData.length;
	var li = '';

	if(input === '') {
		ulList.style.display = 'none';
	} else {
		for(var i = 0; i < len; i++) {
			if(suggestData[i].match(pattern)) {
				console.log(suggestData[i]);
				li += '<li><span>'+input+'</span>'+suggestData[i].substring(input.length)+'</li>';
			}
		}
		ulList.innerHTML = li;
		ulList.style.display = 'block';
	}
}

//输入框按上下方向键、回车键处理
function handleKeyDown(e) {
	console.log(e);
	var activeLi = $('.active');
	switch (e.keyCode) {
		case 40://down
			if(activeLi) {
				var nextLi = activeLi.nextSibling;
				if(nextLi) {
					removeClass(activeLi, 'active');
					addClass(nextLi, 'active');
				}
			} else {
				addClass($('li')[0], 'active');
			}
			break;
		case 38://up
			if(activeLi) {
				var nextLi = activeLi.previousSibling;
				removeClass(activeLi, 'active');
				if(nextLi) {
					addClass(nextLi, 'active');
				}
			} 
			break;
		case 13://enter
			if(activeLi) {
				inputBox.value = activeLi.innerText;
				ulList.style.display = 'none';
			} 
			break;
		default:
			// statements_def
			break;
	}
}


//输入框输入字符
$.delegate(inputBox, 'input', 'input', function (e) {
	handleInput(e.target.value || e.srcElement.value);
});
//输入框按上下方向键、回车键
$.delegate($('input'), 'input', 'keydown', function (e) {
	handleKeyDown(e);
});
//鼠标放置提示框
$.delegate(ulList, 'li', 'mouseover', function (e) {
	addClass(e.target || e.srcElement, 'active');
});
//鼠标移开提示框
$.delegate(ulList, 'li', 'mouseout', function (e) {
	removeClass(e.target || e.srcElement, 'active');
});
//鼠标点击提示框某一项
$.delegate(ulList, 'li', 'click', function (e) {
	var target = e.target || e.srcElement;
	inputBox.value = target.innerText;
	ulList.style.display = 'none';
});
document.getElementsByTagName('*').offsetLeft;

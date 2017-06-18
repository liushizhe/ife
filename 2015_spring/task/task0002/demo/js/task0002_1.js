function insertAfter(newElement, existElement) {

    var existParent = existElement.parentNode;

    if (existParent) {
        existParent.insertBefore(newElement, existElement.nextSibling);
    }
    return newElement;
}

//step 1&2
function step1_2(e) {
	var inputText = $('#hobby').value;
	console.log(inputText);
	var inputArr = inputText.split(/\n|　|\s|，|\,|、|;+/);
	inputArr = uniqArray1(inputArr);
	inputArr = filterArray(inputArr);
	if(inputArr && inputArr.length) {
		var pEle = document.createElement('p');
		pEle.innerHTML = inputArr.join(',');
		insertAfter(pEle, e.target);
	}
}

// $.click($('#btn'), step1_2);

//step 3
function showErrMsg(msg) {
	if(msg) {
		$('.ife-err').innerHTML = msg;
	} else {
		$('.ife-err').innerHTML = '　';
	}
}
//1,2，３　４,5 6;7;;
function step3(e) {
	var inputText = $('#hobby').value;
	console.log(inputText);
	var inputArr = inputText.split(/\n|　|\s|，|\,|、|;+/);
	inputArr = uniqArray1(inputArr);
	inputArr = filterArray(inputArr);
	if(inputArr.length > 10) {
		showErrMsg('用户输入的爱好数量不能超过10个');
		return;
	} else {
		showErrMsg('');
	}
	if(inputArr && inputArr.length) {
		var pEle = document.createElement('p');
		each(inputArr, function(item, i) {
			var input = document.createElement('input');
			input.setAttribute('type', 'checkbox');
			input.setAttribute('id', 'checkboxid' + i);
			var label = document.createElement('label');
			label.setAttribute('for', 'checkboxid' + i);
			label.innerHTML = item;
			pEle.appendChild(input);
			pEle.appendChild(label);
		});
		insertAfter(pEle, e.target);
	} else {
		showErrMsg('用户输入的爱好不能为空');
	}
}

$.click($('#btn'), step3);
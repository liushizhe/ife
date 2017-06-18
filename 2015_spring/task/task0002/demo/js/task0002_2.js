
var interval;

function updateTime(e) {
	clearInterval(interval);
	var inputDate = $('#time').value;
	var pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
	var show = $('.show');
	if(pattern.test(inputDate)) {
		var futureDate = inputDate.replace('-', '/');
		var arrFutureDate = inputDate.split('-');
		console.log(arrFutureDate);
		var futureTime = new Date(futureDate);
		
		interval =  setInterval(function(){
			var currentTime = new Date();
			console.log(currentTime, currentTime.getUTCDate(), currentTime.getDate());
			var interTime = futureTime - currentTime;

		    if(interTime < 0) {
		    	clearInterval(interval);
				show.innerHTML = '请输入未来某个时间';
			} else if(interTime == 0) {
				clearInterval(interval);
				show.innerHTML = "距离"+arrFutureDate[0]+"年"+arrFutureDate[1]+"月"+arrFutureDate[2]+"日还有"+0+"天"+0+"小时"+0+"分"+0+"秒";
			} else {
				//距离YYYY年MM月DD日还有XX天XX小时XX分XX秒
				var day = Math.floor(interTime / 24 / 3600 / 1000);
				var hour = Math.floor(interTime % (24 * 3600 * 1000) / (3600 * 1000));
				var min = Math.floor(interTime % (24 * 3600 * 1000) % (3600 * 1000) / (60 * 1000));
				var sec = Math.floor(interTime % (24 * 3600 * 1000) % (3600 * 1000) % (60 * 1000) / 1000);
				console.log(arrFutureDate);
				show.innerHTML = "距离"+arrFutureDate[0]+"年"+arrFutureDate[1]+"月"+arrFutureDate[2]+"日还有"+day+"天"+hour+"小时"+min+"分"+sec+"秒";
			}
		    
		}, 500);
		
		
	} else {
		show.innerHTML = '请输入YYYY-MM-DD格式字符';
	}
}

$.click($('#btn'), updateTime);
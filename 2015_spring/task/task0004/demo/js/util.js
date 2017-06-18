define(function() {
/**
 * 判断arr是否为一个数组，返回一个bool值
 *
 * @param  {any}  arr 目标对象
 * @return {boolean}        判断结果
 */
function isArray(arr) {
    return '[object Array]' === Object.prototype.toString.call(arr);
}

/**
 * 判断fn是否为一个函数，返回一个bool值
 *
 * @param  {any}  fn 目标对象
 * @return {boolean}        判断结果
 */
function isFunction(fn) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' === Object.prototype.toString.call(fn);
}

    function click(element, listener) {
        addClickEvent(element, listener);
    };

    function unclick(element, listener) {
        removeClickEvent(element, listener);
    };

    function delegate(element, tag, eventName, listener) {
        addEvent(element, eventName, function(event){
            //target Firefox下属性，srcElement IE，chrome两者皆有
            var target = event.target || event.srcElement;
            if(target.tagName.toLowerCase() == tag.toLowerCase()){
                listener.call(target, event);
            }
        });
    }
// var arr = new Array();
// arr.push(12);
// arr.push(3);
// arr.push('12,3');
// function funTest () {
// 	return 1;
// }
// var num = 1;
// var bool = true;

// console.log(typeof num == "number");
// console.log(isArray(arr), isFunction(funTest));

/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 *
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 *
 * @returns {Boolean} 检查结果
 */
function isPlain(obj){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if ( !obj ||
         //一般的情况，直接用toString判断
         Object.prototype.toString.call(obj) !== "[object Object]" ||
         //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
         //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
         //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
         !('isPrototypeOf' in obj)
       ) {
        return false;
    }

    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( obj.constructor &&
        !hasOwnProperty.call(obj, "constructor") &&
        !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in obj ) {}
    return key === undefined || hasOwnProperty.call( obj, key );
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(source) {
    // your implement
    var result = source;
    var i, len;

    if(!source){
        return result;
    } else if(isArray(source)){
        result = [];
        for (var i = 0; i < source.length; i++) {
            result[i] = cloneObject(source[i]);
        }
    } else if(isPlain(source)){
        result = {};
        for (i in source){
            if(source.hasOwnProperty(i)){
                result[i] = cloneObject(source[i]);
            }
        }
    }
    return result;
    // var result = source, i, len;
    // if (!source
    //     || source instanceof Number
    //     || source instanceof String
    //     || source instanceof Boolean) {
    //     return result;
    // } else if (isArray(source)) {
    //     result = [];
    //     var resultLen = 0;
    //     for (i = 0, len = source.length; i < len; i++) {
    //         result[resultLen++] = cloneObject(source[i]);
    //     }
    // } else if (isPlain(source)) {
    //     result = {};
    //     for (i in source) {
    //         if (source.hasOwnProperty(i)) {
    //             result[i] = cloneObject(source[i]);
    //         }
    //     }
    // }
    // return result;
}

// 测试用例：
// console.log('克隆对象');
// var srcObj = {
//     a: 1,
//     b: {
//         b1: ["hello", "hi"],
//         b2: "JavaScript"
//     }
// };
// var abObj = srcObj;
// var tarObj = cloneObject(srcObj);

// srcObj.a = 2;
// srcObj.b.b1[0] = "Hello 2";

// console.log(srcObj['a'], srcObj['b']);
// console.log(abObj.a);
// console.log(abObj.b.b1[0]);

// console.log(tarObj.a);      // 1
// console.log(tarObj.b.b1[0]);    // "hello"
// function strCopy() {
//     var s = {a: 2, b: '2'};
//     return s;
// }
// var ss = strCopy();
// var sss = strCopy();
// sss.a = 3;
// console.log(ss,sss);

// console.log('克隆对象');
// var strSrc = "123";
// var strDst = cloneObject(strSrc);
// console.log(strSrc, strDst);
// strDst = '234';
// console.log(strSrc, strDst);


// var num_src = [{a: 'abc'}, "abc"];
// var num_clone = cloneObject(num_src);
// num_src[0].a = 'dd';
// num_src[1] = 'de';
// console.log(num_src, num_clone);
//去掉空白数组元素
function filterArray(arr) {
    var result = [];
    each(arr, function(item) {
        if(item) {
            result.push(item);
        }
    });

    return result;
}
// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    var i, j, len;
    var result;

    result = arr.slice();
    if(!isArray(result))return result;
    len = result.length;
    if(len === 1)return result;
    for (var i = len - 1; i >= 1; i--) {
        for (var j = i - 1; j >= 0; j--) {
            if(result[i] === result[j]){
                result.splice(i, 1);
                break;
            }
        }
    }
    return result;
}
//hash 1
function uniqArray1(arr) {
    var len;
    var result = [];
    var obj = {};

    if(!isArray(arr))return arr;
    len = arr.length;
    if(len === 1)return arr;
    for (var i = 0; i < len; i++) {
        if(!obj[arr[i]]) {
            obj[arr[i]] = true;
            result.push(arr[i]);
        }
    }

    return result;
}
//hash 2
function uniqArray2(arr) {
    var len;
    var result = [];
    var obj = {};

    if(!isArray(arr))return arr;
    len = arr.length;
    if(len === 1)return arr;
    for (var i = 0; i < len; i++) {
        obj[arr[i]] = false;
    }

    return Object.keys(obj);
}

// 使用示例
// console.log("数组去重\n");
// var a = [1, 3, 5, 7, 5, 3];
// var b = uniqArray2(a);
// console.log(a);
// console.log(b); // [1, 3, 5, 7]
// var c = ['a', 'b', 'c', 'a', 'c'];
// var d = uniqArray2(c);
// console.log(c);
// console.log(d); // [1, 3, 5, 7]

// 中级班同学跳过此题
// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    var i, j;

    function isEmpty(c) {
        if(c === ' ' || c === '\t')return true;
        else return false;
    }

    for(i = 0; i < str.length; i++){
        if(!isEmpty(str.charAt(i)))break;
    }
    for(j = str.length - 1; j >= i; j--){
        if(!isEmpty(str.charAt(j)))break;
    }
    if(i > j)return '';
    return str.substring(i, j);
}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// 使用示例
// console.log('字符串去除头尾空格');
// var str = '   hi!  ';
// // str = trim(str);
// str = simpleTrim(str);
// console.log(str); // 'hi!'
// var str = ' hh\t';
// // str = trim(str);
// str = trim(str);
// console.log(str); // 'hi!'


// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        fn(arr[i], i);
    }
}

// 其中fn函数可以接受两个参数：item和index

// 使用示例
// console.log('数组遍历');
var arr = ['java', 'c', 'php', 'html'];
function output(item) {
    console.log(item)
}
// each(arr, output);  // java, c, php, html

// 使用示例
// var arr = ['java', 'c', 'php', 'html'];
// function output2(item, index) {
//     console.log(index + ': ' + item)
// }
// each(arr, output2);  // 0:java, 1:c, 2:php, 3:html

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    // var arr = Object.keys(obj);
    // return arr.length;
    if(!Object.keys) {
        if(!Object(obj))throw new TypeError('Object.keys called not on a object');
    }
    var r = [], p;
    for(p in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, p)) {
            r.push(p);
        }
    }
    return r.length;
}

// 使用示例
// var obj = {
//     a: 1,
//     b: 2,
//     c: {
//         c1: 3,
//         c2: 4
//     }
// };
// console.log("获取对象元素个数");
// console.log(getObjectLength(obj)); // 3

//使用正则表达式
// 判断是否为邮箱地址
// var email = '.lj19.-+@16.com';
// function isEmail(emailStr) {
//     return /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{3,10})+$/.test(emailStr);

// }
// console.log(isEmail(email));

// // 判断是否为手机号
// var phone = '18512341232';
// function isMobilePhone(phone) {
//     return /^1\d{10}$/.test(phone);

// }
// console.log(isMobilePhone(phone))

//DOM
// console.log('DOM示例');
// var html = document.documentElement;
// console.log(html);
// console.log(document.childNodes[0]), 
// console.log(document.childNodes[0] == document.firstChild);
// console.log(document.body, document.doctype);

/**
 * 判断元素是否有指定class
 */
function hasClass(element, className) {
    var classNames = element.className;
    if(!classNames)return false;

    var arrClassName = classNames.split(/\s+/);

    for (var i = 0; i < arrClassName.length; i++) {
        if(arrClassName[i] === className){
            return true;
        }
    }
    return false;
}
// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    if(!hasClass(element, newClassName)) {
        if(!element.className) {
            element.className = newClassName;
        } else {
            element.className = [element.className, newClassName].join(' ');
        }
    }    
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    if(oldClassName && hasClass(element, oldClassName)) {
        var classNames = element.className;
        var arrClassName = classNames.split(/\s+/);

        for (var i = 0; i < arrClassName.length; i++) {
            if(arrClassName[i] === oldClassName){
                arrClassName.splice(i, 1);
            }
        }
        element.className = arrClassName.join(' ');
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var cur = element;
    var x = 0;
    var y = 0;

    while(cur !== null) {
        x += cur.offsetLeft;
        y += cur.offsetTop;
        cur = cur.offsetParent;
    }
    
    return {x: x, y: y};
}
// var div = document.getElementById('div-id');
// console.log(div, div.className);
// addClass(div, 'div-c3');
// console.log(div.className);
// removeClass(div, 'div-c3');
// console.log(div.className);
// var a1 = document.getElementById('a1');
// var a1 = document.getElementById('a1');
// var a1 = document.getElementById('a1');
// console.log(isSiblingNode(a1, a2));
// console.log(isSiblingNode(a1, a3));

// console.log(document.getElementsByTagName('div'));
// console.log(document.getElementById('div-id'));

// var names = "Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand ";

// console.log(names);

// var re = /\s*;\s*/;
// var nameList = names.split(re);

// console.log(nameList);
// var arrName = Array.prototype.slice.apply(nameList);
// console.log(arrName);
// function blank(x) {console.log(this);
// return 1;
// }
// var obj = {
//     '1':blank
// };
// console.log(obj['1']);
// var obj2 = obj['1'].apply(obj, arrName);
// console.log(obj['1']);
// console.log(obj2);


// var objId = $('#div-id');
// console.log(objId);

// var classSlector = $('.aaron .class-p');
// console.log(classSlector);

// console.log('事件模型');
// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if(element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, listener);
    }
}

// 例如：
function clicklistener(event) {
    console.log(event);
}
// addEvent($("#addbtn"), "click", clicklistener);

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    if(element.removeEventListener) {
        element.removeEventListener(event, listener, false);
    } else if (element.detachEvent) {
        element.detachEvent('on' + event, listener);
    }
}

// var interval =  setInterval(function(){
//     removeEvent($("#addbtn"), "click", clicklistener);
//     clearInterval(interval);
// }, 3000);

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}

function removeClickEvent(element, listener) {
    removeEvent(element, "click", listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element, "keydown", function(event) {
        if (event.keyCode == 13) {
            listener();
        }
    });
}


// $.click($("#addbtn"), clicklistener);

function renderList(event) {
    console.log(event);
    $('#list').innerHTML = '<li>new item</li>';
}
// function init() {
//     // var list = $('#list li');
//     // for(var i = 0; i < list.length; i++) {
//     //     $.click(list[i], renderList);
//     // }
//     each($('#list li'), function(item) {
//         $.click(item, renderList);
//     });
//     $.click($('#addbtn'), renderList);
// }
// init();


// $.delegate($('#list'), 'li', 'click', renderList);

// ------------------------------------------------------------------
// 判断IE版本号，返回-1或者版本号
// ------------------------------------------------------------------

// 首先要说明的是，各种判断浏览器版本的方法，难在所有环境下都正确。navigator下的字段容易被任意篡改。
// 所以在实际场景下，如果可能的话，避免使用获取IE版本号的方式来处理问题，
// 更推荐的是直接判断浏览器特性（http://modernizr.com/）而非从浏览器版本入手。

// 这是传统的userAgent + documentMode方式的ie版本判断。
// 这在大多数对老IE问题进行hack的场景下有效果。
function isIE() {
    var mode = document.documentMode;
    var agent = navigator.userAgent;
    return /msie (\d+\.\d+)/i.test(navigator.userAgent)
        ? (document.documentMode || + RegExp['\x241']) : undefined;
}

// console.log(isIE());

// ------------------------------------------------------------------
// 设置cookie
// ------------------------------------------------------------------


function isValidCookieName(cookieName) {
    // http://www.w3.org/Protocols/rfc2109/rfc2109
    // Syntax:  General
    // The two state management headers, Set-Cookie and Cookie, have common
    // syntactic properties involving attribute-value pairs.  The following
    // grammar uses the notation, and tokens DIGIT (decimal digits) and
    // token (informally, a sequence of non-special, non-white space
    // characters) from the HTTP/1.1 specification [RFC 2068] to describe
    // their syntax.
    // av-pairs   = av-pair *(";" av-pair)
    // av-pair    = attr ["=" value] ; optional value
    // attr       = token
    // value      = word
    // word       = token | quoted-string

    // http://www.ietf.org/rfc/rfc2068.txt
    // token      = 1*<any CHAR except CTLs or tspecials>
    // CHAR       = <any US-ASCII character (octets 0 - 127)>
    // CTL        = <any US-ASCII control character
    //              (octets 0 - 31) and DEL (127)>
    // tspecials  = "(" | ")" | "<" | ">" | "@"
    //              | "," | ";" | ":" | "\" | <">
    //              | "/" | "[" | "]" | "?" | "="
    //              | "{" | "}" | SP | HT
    // SP         = <US-ASCII SP, space (32)>
    // HT         = <US-ASCII HT, horizontal-tab (9)>

    return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24'))
        .test(cookieName);
}

function setCookie(cookieName, cookieValue, expiredays) {
    if (!isValidCookieName(cookieName)) {
        return;
    }

    var expires;
    if (expiredays != null) {
        expires = new Date();
        expires.setTime(expires.getTime() + expiredays * 24 * 60 * 60 * 1000);
    }

    document.cookie =
        cookieName + '=' + encodeURIComponent(cookieValue)
        + (expires ? '; expires=' + expires.toGMTString() : '');
}

function getCookie(cookieName) {
    if (isValidCookieName(cookieName)) {
        var reg = new RegExp('(^| )' + cookieName + '=([^;]*)(;|\x24)');
        var result = reg.exec(document.cookie);

        if (result) {
            return result[2] || null;
        }
    }

    return null;
}

function ajax(url, options) {
    var options = options || {};
    var type = (options.type || 'GET').toUpperCase();
    var data = stringifyData(options.data || {});
    var eventHandlers = {
        onsuccess: options.onsuccess,
        onfail: options.onfail
    };
    var xhr;

    try {
        xhr = getXHR();
        xhr.open(type, url, true);
        xhr.onreadystatechange = stateChangeHandler;

        // 在open之后再进行http请求头设定
        if (type === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
        // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
    }
    catch(ex) {
        fire('fail');
    }
    return xhr;

    function stringifyData(data) {
        // 此方法只是简单示意性实现，并未考虑数组等情况。
        var param = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                param.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return param.join('&');
    }

    function getXHR() {
        if (window.ActiveXObject) {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch (e) {
                try {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
                catch (e) {}
            }
        }
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }

    function stateChangeHandler() {
        var stat;
        console.log("xxx", xhr.readyState, xhr.state);
        if (xhr.readyState === 4) {
            try {
                stat = xhr.status;
            }
            catch (ex) {
                // 在请求时，如果网络中断，Firefox会无法取得status
                fire('fail');
                return;
            }

            fire(stat);

            // http://www.never-online.net/blog/article.asp?id=261
            // case 12002: // Server timeout
            // case 12029: // dropped connections
            // case 12030: // dropped connections
            // case 12031: // dropped connections
            // case 12152: // closed by server
            // case 13030: // status and statusText are unavailable

            // IE error sometimes returns 1223 when it
            // should be 204, so treat it as success
            if ((stat >= 200 && stat < 300)
                || stat === 304
                || stat === 1223) {
                fire('success');
            }
            else {
                fire('fail');
            }

            /*
             * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
             * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
             * function maybe still be called after it is deleted. The theory is that the
             * callback is cached somewhere. Setting it to null or an empty function does
             * seem to work properly, though.
             *
             * On IE, there are two problems: Setting onreadystatechange to null (as
             * opposed to an empty function) sometimes throws an exception. With
             * particular (rare) versions of jscript.dll, setting onreadystatechange from
             * within onreadystatechange causes a crash. Setting it from within a timeout
             * fixes this bug (see issue 1610).
             *
             * End result: *always* set onreadystatechange to an empty function (never to
             * null). Never set onreadystatechange from within onreadystatechange (always
             * in a setTimeout()).
             */
            window.setTimeout(
                function() {
                    xhr.onreadystatechange = new Function();
                    xhr = null;
                },
                0
            );
            }
    }

    function fire(type) {
        type = 'on' + type;
        var handler = eventHandlers[type];

        if (!handler) {
            return;
        }
        if (type !== 'onsuccess') {
            handler(xhr);
        }
        else {
            //处理获取xhr.responseText导致出错的情况,比如请求图片地址.
            try {
                console.log(xhr.responseText);
            }
            catch(error) {
                return handler(xhr);
            }
            handler(xhr, xhr.responseText);
        }
    }
}

// var options = {
//     type: 'GET',
//     data: null,
//     onsuccess: function(arg1, arg2) {
//         console.log('onsuccess');
//         console.log(arg1, arg2);
//     },
//     onfail: function(arg1, arg2) {
//         console.log('onfail');
//         console.log(arg1, arg2);
//     }
// };

// ajax('http://www.w3school.com.cn/   ajax/demo_get2.asp?fname=Bill&lname=Gates', options);

// function apple() {}
// apple.prototype = {
//     product: 'mac',
//     say: function() {
//         console.log(this.product);
//     }
// }

// var product = new apple();
// product.say(); //mac
// var phone = {
//     product: 'iphone'
// }
// product.say.call(phone); //iphone

// function fun(arg1, arg2) {
//     console.log(arg1, arg2);
// }
// var arg1 = 1, arg2 = 2;
// fun.call(this, arg1, arg2);
// fun.apply(this, [arg1, arg2]);
    return {
        hasClass: hasClass,
        removeClass: removeClass,
        addClass: addClass,
        click: click,
        unclick: unclick,
        uniqArray1: uniqArray1
    }

});


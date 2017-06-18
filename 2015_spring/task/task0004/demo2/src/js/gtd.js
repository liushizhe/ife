
define(["util", "selector"], function(util, $) {
        //return an object to define the "my/shirt" module.
        

var INVALID_ID = 0xffffffff;
var INVAILD_INDEX = 0xffffffff;
/**
 * id当前及列表项标识
 * name列表项名称
 * child包含子列表标识（id）
 * father父列表项id
 * finish任务完成情况
 * date任务完成日期
 * content任务内容
 */
/*
<iframe src=javascript:alert('xss');height=0 width=0></iframe>
 */
//第1级任务
    var cat1 = [
        {
            "id": 0,
            "name": "默认分类", 
            "child": [0]
        },
        {
            "id": 1,
            "name": "默认分类2",
            "child": [1, 2]
        }
    ];
    var cat2 = [
        {
            "id": 0,
            "name": "默认子分类",
            "child": [0, 1],
            "father": 0
        },
        {
            "id": 1,
            "name": "默认子分类21",
            "child": [],
            "father": 1
        },
        {
            "id": 2,
            "name": "默认子分类22",
            "child": [],
            "father": 1
        }
    ]; 
    var cat3 = [
        {
            "id": 0,
            "name": "to-do 1",
            "father": 0,
            "finish": true,
            "date": "2015-05-28",
            "content": "开始 task0001 的编码任务。"
        },
        {
            "id": 1,
            "name": "to-do 3",
            "father": 0,
            "finish": false,
            "date": "2015-05-30",
            "content": "完成 task0001 的编码任务。"
        }
    ];

    function init() {
        

        if(!localStorage.getItem('cat1')) {
            localStorage.setItem('cat1', JSON.stringify(cat1));
            localStorage.setItem('cat2', JSON.stringify(cat2));
            localStorage.setItem('cat3', JSON.stringify(cat3));
        } else {
            cat1 = JSON.parse(localStorage.getItem('cat1'));
            cat2 = JSON.parse(localStorage.getItem('cat2'));
            cat3 = JSON.parse(localStorage.getItem('cat3'));
        }
        var test = $('#t-list-all');

        util.addClass($('#t-list-all'), 'choose');//默认选择所有任务列表
        
        util.click($('#t-list-all'), clickAllTaskList);
        util.click($('.t-list-add'), addTaskList);
        util.click($('.t-status-sel li')[0], clickTaskStatus);
        util.click($('.t-status-sel li')[1], clickTaskStatus);
        util.click($('.t-status-sel li')[2], clickTaskStatus);
        util.click($('.icon-done'), finishTask);
        util.click($('.icon-edit'), editTask);
        util.click($('.btn3')[0], cancelAdd);
        util.click($('.t-status-add'), addTask);

        updateTaskList(INVALID_ID); //初始化
    }
//新建具体任务
function addTask() {
    util.click($('.btn3')[1], taskAdd);
    var nodeEditTittle = $('.t-content-tittle .task-text');
    var nodeEditDate = $('.t-content-date .task-text');
    var nodeEditDetail = $('.t-content-detail .myTextArea');
    // $('.t-status .t-status-add').click = null;//新增任务按钮不起作用
    //日期 编辑文本框数据清除并隐藏正常显示内容
    nodeEditTittle.value = '';
    nodeEditDate.value = '';
    nodeEditDetail.value = '';
    $('.t-content-tittle span')[0].style.display = 'none';
    $('.t-content-date span').style.display = 'none';
    $('.t-content-detail span').style.display = 'none';
    //日期 编辑文本框、保存、放弃按钮
    nodeEditTittle.style.display = 'inline-block';
    nodeEditDate.style.display = 'inline-block';
    nodeEditDetail.style.display = 'inline-block';
    $('.btn3')[0].style.display = 'inline-block';
    $('.btn3')[1].style.display = 'inline-block';
}
//取消新增任务
function closePop() {
    $('.pop').style.display = 'none';
    $('.overlay').style.display = 'none';
    $('.pop-content').innerHTML = ''; 
}
//确认新增任务
function confirmPop() {
    var strInput = $('.pop-content .new-task-name').value;
    var nodeErr = $('.error');
    var strSel = $('.cat-sel').value;

    if(strInput.length === 0) {
        nodeErr.innerHTML = '您输入内容为空';
        return;
    } else if(strInput.length > 10) {
        nodeErr.innerHTML = '您输入内容超过10个字符';
        return;
    } else if(getCatByKeyValue(cat1, 'name', strInput)) {
        nodeErr.innerHTML = '您输入分类已经存在';
        return;
    } else if(getCatByKeyValue(cat2, 'name', strInput)) {
        nodeErr.innerHTML = '您输入子分类已经存在';
        return;
    }
    if(strSel === '-1') {//新建分类
        var cat = {
            "id": cat1[cat1.length-1].id + 1,//id一直累加
            "name": strInput,
            "child": []
        };
        cat1.push(cat);
    } else {
        var objFather = getCatByKeyValue(cat1, 'id', cat1[strSel].id);
        var c = {
            "id": cat2[cat2.length-1].id + 1,//id一直累加
            "name": strInput,
            "child": [],
            "father": objFather.id
        };
        objFather.child.push(c.id);
        cat2.push(c);
    }
    save();
    closePop();
    // addClass($('#t-list-all'), 'choose');//默认选择所有任务列表
    updateTaskList(INVALID_ID); //新增
    
}
//添加新增任务列表按钮
function addTaskList() {
    $('.pop').style.display = 'block';
    $('.overlay').style.display = 'block';
    var html = '';
    html += '<div>'
        +    '任务名称:'
        +    '<input type="text" class="new-task-name new-task-name-p" placeholder="输入新任务名称">'
        +    '</div>'
        +    '<div>'
        +    '任务目录:'
        +    '<select class="cat-sel cat-sel-p">'
        +    '<option value="-1">无</option>';
    var list = $('#t-list-detail h4');
    for(var i = 0; i < list.length; i++) {     
        html += '<option value="' + i + '">' + list[i].getElementsByTagName('span')[0].innerHTML + '</option>';
    }
    html += '</select>'
            + '</div>'
            +    '<div class="error"></div>'
            +    '<button class="pop-btn btn1">取消</button>'
            +    '<button class="pop-btn btn2">确定</button>';
    
    $('.pop-content').innerHTML = html;            
    util.click($('.btn1'), closePop);
    util.click($('.btn2'), confirmPop);
}
//点击左侧任务列表按钮
function clickAllTaskList(ele) {
    //console.log(ele.target.tagName);
    //window.event ? window.event.cancelBubble = true : e.stopPropagation();
    ele = ele.target || ele.srcElement; 
    if(ele.tagName.toLowerCase() === 'span') {
        ele = ele.parentNode;
    }
    var parent = $('.t-list');
    var nodes = parent.getElementsByTagName('*');

    for(var i = 0; i < nodes.length; i++) {
        if(util.hasClass(nodes[i], 'choose')) {
            util.removeClass(nodes[i], 'choose');
        }
    }
    if(ele) {
        util.addClass(ele, 'choose');
    }
    updateTaskListDetail(INVALID_ID);//新建删除都是靠点击文件栏
}
//点击任务完成按钮
function finishTask() {
    var task = getCatByKeyValue(cat3, 'name', $('.t-content-tittle span')[0].innerHTML);
    if(task) {
        if(task.finish) {
            alert('任务已经完成！');
            return;
        } else {
            var con = confirm("确定要设置任务为已完成状态吗？");
            if (!con) {
                return;
            }
            task.finish = true;
            // updateTaskList(task.id);
            save();
            updateTaskListDetail(task.id);//完成
        }
    }
}
//点击修改任务按钮

function htmlEncode(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#x27;")
              .replace(/\//g, "&#x2f;")
              .replace(/`/g, "&#x60;");
}

function htmlDecode(str) {
    return str.replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, "\"")
              .replace(/&#x27;/g, "\'")
              .replace(/&#x2f;/g, "\/")
              .replace(/&#x60;/g, "`");
}
 
function editTask() {
    if(!$('.t-content-tittle span')[0].innerHTML) {
        return;
    }
    var nodeEditDate = $('.t-content-date .task-text');
    var nodeEditDetail = $('.t-content-detail .myTextArea');
    //$('.t-status .t-status-add').click = null;//新增任务按钮不起作用
    util.click($('.btn3')[1], modifyTask);//保存按钮重新绑定监听事件，区分新增任务保存
    //日期 编辑文本框数据清除并隐藏正常显示内容
    $('.t-content-date .task-text').value = htmlDecode($('.t-content-tittle span')[0].innerHTML);
    nodeEditDate.value = $('.t-content-date span').innerHTML;
    nodeEditDetail.value = htmlDecode($('.t-content-detail span').innerHTML);
    $('.t-content-date span').style.display = 'none';
    $('.t-content-detail span').style.display = 'none';
    //日期 编辑文本框、保存、放弃按钮
    nodeEditDate.style.display = 'inline-block';
    nodeEditDetail.style.display = 'inline-block';
    $('.btn3')[0].style.display = 'inline-block';
    $('.btn3')[1].style.display = 'inline-block';
}
//点击保存按钮，新增任务时保存
function taskAdd() {
    var nodeEditTitle = $('.t-content-tittle .task-text');
    var nodeEditDate = $('.t-content-date .task-text');
    var nodeEditDetail = $('.t-content-detail .myTextArea');
    var name = htmlEncode(nodeEditTitle.value);
    var date = nodeEditDate.value;
    var detail = htmlEncode(nodeEditDetail.value);

    if (name.length === 0) {
        $('.taskError').innerHTML = '任务名字为空';
        return;
    }
    if (getCatByKeyValue(cat3, 'name', name)) {
        $('.taskError').innerHTML = '任务名字已经存在';
        return;
    }
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        $('.taskError').innerHTML = '任务日期格式错误';
        return;
    }
    var arrDate = date.split('-');
    if (arrDate[1] < 1 || arrDate[1] > 12 || arrDate[2] < 1 || arrDate[2] > 31) {
        $('.taskError').innerHTML = '任务日期有错，根本没有这一天';
        return;
    }
    $('.t-content-tittle span')[0].innerHTML = name;
    $('.t-content-date span').innerHTML = date;
    $('.t-content-detail span').innerHTML = detail;
    //保存数据
    var curC2;//待添加的第二季任务列表对象
    //确定第二级任务列表
    var nodeCatAll = $('.t-list-wrap h3')[0];//h3元素包含所有任务和分类列表
    if(util.hasClass(nodeCatAll, 'choose')) {//选中所有任务列表
        curC2 = getCatByKeyValue(cat2, 'id', cat1[0].child[0]);//当前分类没有子分类，切换到默认分类的默认子分类
    } else {//判断是否第1级任务列表
        var nodeCat1 = $('.t-list-wrap h4');
        var i;
        for(i = 0; i < nodeCat1.length; i++) {
            if(util.hasClass(nodeCat1[i], 'choose')) {
                break;
            }
        }
        if(i < nodeCat1.length) {//选中第一级列表
            var c1 = getCatByKeyValue(cat1, 'name', nodeCat1[i].getElementsByTagName('span')[0].innerHTML);
            if(c1.child.length === 0) {//当前分类没有子分类，切换到默认分类的默认子分类
                curC2 = getCatByKeyValue(cat2, 'id', cat1[0].child[0]);
            } else {//当前分类第一个子分类
                curC2 = getCatByKeyValue(cat2, 'id', c1.child[0]);
            }
        } else {//选中第二级列表
            var nodeCat2 = $('.t-list-wrap h5');
            for(i = 0; i < nodeCat2.length; i++) {
                if(util.hasClass(nodeCat2[i], 'choose')) {
                    break;
                }
            }
            if(i === nodeCat2.length) {//异常

            } else {
                curC2 = getCatByKeyValue(cat2, 'name', nodeCat2[i].getElementsByTagName('span')[0].innerHTML);
            }
        }
    }
    console.log(curC2);
    /*
    {
        "id": 2,
        "name": "默认子分类22",
        "child": [],
        "father": 1
    }
    {
        "id": 0,
        "name": "to-do 1",
        "father": 0,
        "finish": true,
        "date": "2015-05-28",
        "content": "开始 task0001 的编码任务。"
    }
     */
    var c3 = {
        "id": cat3[cat3.length-1].id + 1,
        "name": name,
        "father": curC2.id,
        "finish": false,
        "date": date,
        "content": detail
    };
    cat3.push(c3);
    curC2.child.push(c3.id);

    //各个控件恢复显示
    $('.t-content-tittle span')[0].style.display = 'inline-block';
    $('.t-content-date span').style.display = 'inline-block';
    $('.t-content-detail span').style.display = 'inline-block';
    nodeEditTitle.style.display = 'none';
    nodeEditDate.style.display = 'none';
    nodeEditDetail.style.display = 'none';
    $('.btn3')[0].style.display = 'none';
    $('.btn3')[1].style.display = 'none';
    $('.taskError').innerHTML = '';
    save();
    updateTaskList(c3.id); //任务栏新建
    util.unclick($('.btn3')[1], taskAdd);
}
//点击保存按钮，编辑时保存
function modifyTask() {
    // $.click($('.t-status .t-status-add'), addTask);
    var nodeEditDate = $('.t-content-date .task-text');
    var nodeEditDetail = $('.t-content-detail .myTextArea');
    var date = nodeEditDate.value;
    var detail = htmlEncode(nodeEditDetail.value);

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        $('.taskError').innerHTML = '任务日期格式错误';
        return;
    }
    var arrDate = date.split('-');
    if (arrDate[1] < 1 || arrDate[1] > 12 || arrDate[2] < 1 || arrDate[2] > 31) {
        $('.taskError').innerHTML = '任务日期有错，根本没有这一天';
        return;
    }

    $('.t-content-date span').innerHTML = date;
    $('.t-content-detail span').innerHTML = detail;
    var content = $('.t-content-tittle span')[0].textContent;
    var cat = getCatByKeyValue(cat3, 'name', htmlEncode(content));//xss
    cat.date = date;
    cat.content = detail;

    //各个控件恢复显示
    $('.t-content-date span').style.display = 'inline-block';
    $('.t-content-detail span').style.display = 'inline-block';
    nodeEditDate.style.display = 'none';
    nodeEditDetail.style.display = 'none';
    $('.btn3')[0].style.display = 'none';
    $('.btn3')[1].style.display = 'none';
    $('.taskError').innerHTML = '';
    // updateTaskList(cat.id);
    save();
    updateTaskListDetail(cat.id);  //保存
    util.unclick($('.btn3')[1], modifyTask);
}
//点击放弃保存按钮
function cancelAdd() {
    // $.click($('.t-status .t-status-add'), addTask);
    var nodeEditDate = $('.t-content-date .task-text');
    var nodeEditDetail = $('.t-content-detail .myTextArea');

    //各个控件恢复显示
    $('.taskError').innerHTML = '';
    $('.t-content-date span').style.display = 'inline-block';
    $('.t-content-detail span').style.display = 'inline-block';
    nodeEditDate.style.display = 'none';
    nodeEditDetail.style.display = 'none';
    $('.btn3')[0].style.display = 'none';
    $('.btn3')[1].style.display = 'none';
}
//点击状态栏任务
function taskClick(ele) {
    ele = ele.target || ele.srcElement;
    if(ele.tagName.toLowerCase() === 'span') {
        ele = ele.parentNode;
    }
    var nodes = ele.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('*');

    for(var i = 0; i < nodes.length; i++) {
        if(util.hasClass(nodes[i],'choose')) {
            util.removeClass(nodes[i],'choose');
        }
    }
     
    util.addClass(ele, 'choose');
    //更新任务详细信息
    updateTaskDetail(ele);
}

//通过key-value获取列表项
function getCatByKeyValue(obj, key, value) {
    for(var i = 0; i < obj.length; i++) {
        if(obj[i][key] === value) {
            return obj[i];
        }
    }
    return null;
}
//通过key-value获取列表项索引
function getIndexByKey(obj, key, value) {
    for(var i = 0; i < obj.length; i++) {
        if(obj[i][key] === value) {
            return i;
        }
    }
    return INVAILD_INDEX;
}
//日期从小到大排序
function sortDate(date) {
    return date.sort(function (a, b) {
        return a.replace(/-/g, '') - b.replace(/-/g, '');
    });
}
//显示任务详细信息
function updateTaskDetail(ele) {
    if(ele) {
        //var e = ele.getElementsByClassName('detail-text');//[0];

        var html = ele.getElementsByClassName('detail-text')[0].textContent;

        var name = htmlEncode(html);//xss
        //console.log(ele.getElementsByClassName('detail-text')[0].innerHTML,html,name);
        var obj = getCatByKeyValue(cat3, 'name', name);
        $('.t-content-tittle span')[0].innerHTML = obj.name;
        $('.t-content-date span').innerHTML = obj.date;
        $('.t-content-detail span').innerHTML = obj.content;
        $('.set-text').style.display = 'block';
    } else {
        $('.t-content-tittle span')[0].innerHTML = '';
        $('.t-content-date span').innerHTML = '';
        $('.t-content-detail span').innerHTML = '';
        $('.set-text').style.display = 'none';
    }
}
//选择状态列表完成情况 
function clickTaskStatus(ele) {
    if(ele === null) return;
    ele = ele.target || ele.srcElement;
    var parent = ele.parentNode;
    for(var i = 0; i < parent.children.length; i++) {
        if(util.hasClass(parent.children[i], 'choose')) {
            util.removeClass(parent.children[i], 'choose');
        }
    }
    util.addClass(ele, 'choose');
    var str = ele.innerHTML;
    nodes = document.getElementsByClassName('status-item');
    for(var i = 0; i < nodes.length; i++) {
        nodes[i].style.display = 'block';
        nodesFinish = nodes[i].getElementsByClassName('task-finish');
        if(nodesFinish) {
            for(var j = 0; j < nodesFinish.length; j++) {
                nodesFinish[j].parentNode.style.display = 'block';
            }
        }
        nodesFinish = nodes[i].getElementsByClassName('task-unfinish');
        if(nodesFinish) {
            for(var j = 0; j < nodesFinish.length; j++) {
                nodesFinish[j].parentNode.style.display = 'block';
            }
        }
    }

    if(str.indexOf('所有') !== -1) {
        
    } else if(str.indexOf('未完成') !== -1) {
        for(var i = 0; i < nodes.length; i++) {
            nodesFinish = nodes[i].getElementsByClassName('task-finish');
            nodesLi = nodes[i].getElementsByTagName('li');
            if(nodesFinish.length) {
                if(nodesFinish.length === nodesLi.length) {
                    nodes[i].style.display = 'none';
                } else {
                    for(var j = 0; j < nodesFinish.length; j++) {
                        nodesFinish[j].parentNode.style.display = 'none';
                    }
                }
                
            }
        }
    } else if(str.indexOf('已完成') !== -1) {
        for(var i = 0; i < nodes.length; i++) {
            nodesFinish = nodes[i].getElementsByClassName('task-unfinish');
            nodesLi = nodes[i].getElementsByTagName('li');
            if(nodesFinish.length) {
                if(nodesFinish.length === nodesLi.length) {
                    nodes[i].style.display = 'none';
                } else {
                    for(var j = 0; j < nodesFinish.length; j++) {
                        nodesFinish[j].parentNode.style.display = 'none';
                    }
                }
                
            }
        }
    }

    var h6 = document.getElementsByTagName('h6');        // 默认选择第一个任务
    //console.log(h6[0].parentNode.parentNode.parentNode.style.display, h6[1].parentNode.parentNode.parentNode.style.display);
    for (var i = 0; i < h6.length; i++) {
        if (h6[i].parentNode.parentNode.parentNode.style.display !== 'none') {
            h6[i].click();
            break;
        }
    }
}
//更新状态列表
//返回选中任务
function updateStatusList(arrTaskID, searchID) {
    var date = [];
    var task = [];
    var html = '';

    var nodes = document.getElementsByTagName('h6');
    if(nodes) {
        for(var i = 0; i < nodes.length; i++) {
            util.unclick(nodes[i], taskClick);
        }
    }
    var nodes = document.getElementsByClassName('t-status-choose')[0].getElementsByClassName('delete');
    if(nodes) {
        for(var i = 0; i < nodes.length; i++) {
            util.unclick(nodes[i], del);
        }
    }

    for(var i = 0; i < arrTaskID.length; i++) {
        var obj = getCatByKeyValue(cat3, 'id', arrTaskID[i]);
        task.push(obj);
        date.push(obj.date);
    }
    date = util.uniqArray1(date);
    date = sortDate(date);
    var k = 0;
    var s = false;
    for(var i = 0; i < date.length; i++) {
        html += '<li class="status-item"><h5>'+date[i]+'</h5><ul>';
        for(var j = 0; j < task.length; j++) {
            if(task[j].date === date[i]) {
                if(task[j].finish === true) {
                    html += '<li><h6 class="task-finish">';
                } else {
                    html += '<li><h6 class="task-unfinish">';
                }
                html += '<i class="icon-check"></i>' 
                + '<span class="detail-text">'
                +task[j].name+'</span>'
                +'<i class="delete icon-minus-circled"></i>'
                +'</h6></li>';
                 if(s === false) {
                     if(searchID === task[j].id) {
                        s = true;
                     } else {
                        k++;
                     }
                 }
            }
        }
        html += '</ul></li>';
    }
    $('.t-status-choose').innerHTML = html;
    var nodes = document.getElementsByTagName('h6');
    for(var i = 0; i < nodes.length; i++) {
        util.click(nodes[i], taskClick);
    }
    var nodes = document.getElementsByClassName('t-status-choose')[0].getElementsByClassName('delete');
    for(var i = 0; i < nodes.length; i++) {
        util.click(nodes[i], del);
    }
    if(s === false) {
        return 0;
    } else {
        return k;
    }
    // var ele = $('.t-status-choose');
    // ele = ele.getElementsByTagName('ul')[0];
    // ele = ele.getElementsByTagName('li')[0];
    // addClass($('h6')[0], 'choose');
}
//更新任务状态及详细信息
function  updateTaskListDetail(nodeID) {
    var oldChoose = $('.t-status-choose .choose');     // 保存正在选中的任务
    // var nodesStatus = document.getElementsByClassName('t-status-sel')[0].getElementsByTagName('li');
    $('.t-status-sel li')[0].click();;
    // for(var i = 0; i < nodesStatus.length; i++) {
    //     nodesStatus[i].click();
    // }
    var curList = $('.t-list-wrap .choose');//确定当前选择任务列表
    var hightlight = 0;
    var arrTaskID = [];//存续需要显示任务ID
    if(curList) {
        var tag = curList.tagName.toLowerCase();
        //获取具体任务项
        switch (tag) {
            case 'h3':
                for(var i = 0; i < cat3.length; i++) {
                    arrTaskID.push(cat3[i].id);
                }
                hightlight = updateStatusList(arrTaskID, nodeID);
                break;
            case 'h4':
                var name = curList.getElementsByTagName('span')[0].innerHTML;
                var obj = getCatByKeyValue(cat1, 'name', name);
                if(obj) {
                    for(var i = 0; i < obj.child.length; i++) {
                        var objChild = getCatByKeyValue(cat2, 'id', obj.child[i]);
                        for(var j = 0; j < objChild.child.length; j++) {
                            arrTaskID.push(objChild.child[j]);
                        }
                    }
                }
                hightlight = updateStatusList(arrTaskID, nodeID);
                break;
            case 'h5':
                var name = curList.getElementsByTagName('span')[0].innerHTML;
                var obj = getCatByKeyValue(cat2, 'name', name);
                if(obj) {
                    for(var i = 0; i < obj.child.length; i++) {
                        arrTaskID.push(obj.child[i]);       
                    }
                }
                hightlight = updateStatusList(arrTaskID, nodeID);

                break;
            default:
                // statements_def
                break;
        }
    }
    //更新任务详细信息
    if(arrTaskID.length) {
        //document.getElementsByTagName('h6')[hightlight].click();
        if (oldChoose) {// 恢复之前选中的选项
            var childEle = document.getElementsByTagName('h6');
            var oldName = oldChoose.getElementsByTagName('span')[0].innerHTML;
            var isClick = false;
            for (var i = 0; i < childEle.length; i++) {
                if (childEle[i].getElementsByTagName('span')[0].innerHTML === oldName) {
                    childEle[i].click();
                    isClick = true;
                    break;
                }
                if (!isClick && $('h6')) {                                   // 之前选中的元素不再显示的情况
                    document.getElementsByTagName('h6')[0].click();
                }
            }
        }
        else if ($('h6')) {                   // 否则默认选择第一个任务
            var s = document.getElementsByTagName('h6');
            s[0].click();
        }
    }
    else {
        updateTaskDetail(null);//清除任务详细信息
    }
}
//删除任务
function del(e) {
    //阻止事件冒泡，因为删除事件重绘DOM，有可能造成页面崩溃
    //window.event ? window.event.cancelBubble = true : e.stopPropagation(); 
    var con = confirm("删除操作不可逆，确定要删除吗？");
    if (!con) {
        return;
    }
    e = e.target || e.srcElement;
    var parent = e.target.parentNode;
    var name = parent.getElementsByTagName('span')[0].innerHTML;
    var tag = parent.tagName.toLowerCase();

    switch (tag) {
        case 'h4':                                                          // 删除一个分类
            index = getIndexByKey(cat1, 'name', name);

            for (var i = 0; i < cat1[index].child.length; i++) {            // 删除该分类下的所有子分类及任务
                var childIndex = getIndexByKey(cat2, 'id', cat1[index].child[i]);
                for (var j = 0; j < cat2[childIndex].child.length; j ++) {
                    var taskIndex = getIndexByKey(cat3, 'id', cat2[childIndex].child[j])
                    cat3.splice(taskIndex, 1);
                }
                cat2.splice(childIndex, 1);
            }
            cat1.splice(index, 1);
            break;
        case 'h5':                                                          // 删除一个子分类
            index = getIndexByKey(cat2, 'name', name);

            for (var i = 0; i < cat2[index].child.length; i++) {       // 删除该子分类下的所有任务
                var taskIndex = getIndexByKey(cat3, 'id', cat2[index].child[i])
                cat3.splice(taskIndex, 1);
            }

            var fatherObj = getCatByKeyValue(cat1, 'id', cat2[index].father);  // 删除父节点中的记录
            fatherObj.child.splice(fatherObj.child.indexOf(cat2[index].id), 1);
            cat2.splice(index, 1);
            break;
        case 'h6':
            index = getIndexByKey(cat3, 'name', name);

            var fatherObj = getCatByKeyValue(cat2, 'id', cat3[index].father);  // 删除父节点中的记录
            fatherObj.child.splice(fatherObj.child.indexOf(cat3[index].id), 1);
            cat3.splice(index, 1);
            break;
    }
    save();
    updateTaskList(INVALID_ID);  //删除  任务栏->文件拦，文件拦->文件栏
}
//更新网页左中内容
function updateTaskList(nodeID) {
    var preTask = $('.t-status-choose .choose');//状态列表选中情况
    var curList = $('.t-list-wrap .choose');//确定当前选择任务列表
    // if(curList === null) {
    //     addClass($('#t-list-all'), 'choose');
    // }
    //更新左侧文件列表
    $('#t-list-all').innerHTML = '<span>所有任务</span>('+cat3.length+')';
    // var name = curList.getElementsByTagName('span')[0].innerHTML;
    var html = '';

    for (var i = 0; i < cat1.length; i++) {
        var length = 0;
        var obj = cat1[i];
        for(var k = 0; k < obj.child.length; k++) {
            length += cat2[getIndexByKey(cat2, 'id', obj.child[k])].child.length;
        }
        // if(name != cat1[i].name) {
            html += '<li><h4>'; 
        // } else {
        //     html += '<li><h4 onclick="clickAllTaskList(this)" class="choose">'; 
        // }
        html += '<span>' + cat1[i].name + '</span>'
        + '(' + length + ')'; 
        // if(i !== 0)
        {
            html += '<i class="delete icon-minus-circled"></i>';
        }
        html += '</h4><ul class="t-list-item">';
        for (var j = 0; j < cat2.length; j++) {
            if(cat1[i].id === cat2[j].father) {
                // if(name != cat2[j].name) {
                    html += '<li><h5>';
                // } else {
                //     html += '<li><h5 onclick="clickAllTaskList(this)" class="choose">'; 
                // }
                html += '<span>' + cat2[j].name + '</span>'
                + '('+ cat2[j].child.length + ')';
                // if(!(i === 0 && j === 0))
                {
                    html += '<i class="delete icon-minus-circled"></i>';
                }
                html += '</h5></li>';
            }
        }
        html += '</ul></li>';
    }
    html = html.replace(/<i class="delete icon-minus-circled"><\/i>/, '');    // 去掉默认分类的删除按钮
    html = html.replace(/<i class="delete icon-minus-circled"><\/i>/, '');    // 去掉默认子分类的删除按钮
    $('#t-list-detail').innerHTML = html;
    // util.click($('#t-list-all'), clickAllTaskList);
    var nodes = $('#t-list-detail').getElementsByTagName('h4');
    for(var i = 0; i < nodes.length; i++) {
        util.click(nodes[i], clickAllTaskList)
    }
    var nodes = $('#t-list-detail').getElementsByTagName('h5');
    for(var i = 0; i < nodes.length; i++) {
        util.click(nodes[i], clickAllTaskList)
    }
    var nodes = $('#t-list-detail').getElementsByClassName('delete');
    for(var i = 0; i < nodes.length; i++) {
        util.click(nodes[i], del)
    }
    //左边列表项重置后需重新点击
    if(curList) {
        var tag = curList.tagName.toLowerCase();
        var name = curList.getElementsByTagName('span')[0].innerHTML;
        var click = false;//检测查找节点是否存在，因为有可能被删掉
        switch (tag) {
            case 'h3':
                document.getElementsByTagName('h3')[0].click();
                click = true;
                break;
            case 'h4':
                var nodesH4 = $('#t-list-detail').getElementsByTagName('h4');
                for(var i = 0; i < nodesH4; i++) {
                    if(name === nodesH4[i].getElementsByTagName('span')[0].innerHTML) {
                        nodesH4[i].click();
                        click = true;
                        break;
                    }
                }
                break;
            case 'h5':
                var nodesH5 = $('#t-list-detail').getElementsByTagName('h5');
                for(var i = 0; i < nodesH5; i++) {
                    if(name === nodesH5[i].getElementsByTagName('span')[0].innerHTML) {
                        nodesH5[i].click();
                        click = true;
                        break;
                    }
                }
                break;
            default:
                // statements_def
                break;
        }
        if(!click) {
            $('h3')[0].click();
        }
    } else {
        $('h3')[0].click();
    }
    //更新中间各文件状态，默认选择所有、首条todo列表，todo列表按日期排序
    //updateTaskListDetail(nodeID);
}
function save() {
    if(localStorage.getItem('cat1')) {
        localStorage.setItem('cat1', JSON.stringify(cat1));
        localStorage.setItem('cat2', JSON.stringify(cat2));
        localStorage.setItem('cat3', JSON.stringify(cat3));
    }
}

    return {
        init: init
    }
});

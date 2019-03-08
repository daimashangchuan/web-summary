//   获取css样式
function getStyle(ele, attr) {
	var style;
	if (ele.currentStyle) {
		style = ele.currentStyle[attr]
	} else {
		style = getComputedStyle(ele)[attr]
	}
	return style
}


//  阻止事件冒泡的兼容
function stopBubble(event){
	if (window.event) {
		//  IE浏览器
		window.event.cancelBubble = true;
	} else{
		//  W3C标准内核
		event.stopPropagation();
	}
}


/**
 * 能够让任意对象匀速移动到指定位置 animate
 * 能够让任意对象快速移动到指定位置 animation
 * obj  要移动的对象
 * step 每次移动多少像素
 * target 一共移动多少像素
 */
function animate(obj, step, target) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var leader = obj.offsetLeft;
		step = Math.abs(step);
		step = leader < target ? step : -step;
		//Math.abs(target - leader)  当前位置到目标的位置
		if (Math.abs(target - leader) > Math.abs(step)) {
			leader += step;
			obj.style.left = leader + "px";
		} else {
			obj.style.left = target + "px";
			clearInterval(obj.timer);
		}
	}, 15);
}
function animation(obj, target) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var leader = obj.offsetLeft;
		var step = (target - leader) / 10;
		step = step > 0 ? Math.ceil(step) : Math.floor(step);
		leader = leader + step;
		obj.style.left = leader + 'px';
		if (leader === target) {
			clearInterval(obj, timer)
		}
	}, 15);
}


//  获取滚动top  left
function scroll() {
	return {
		top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
		left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
	}
}


//  获取页面的宽高
function client() {
	return {
		width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
		height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
	}
}


/**
 * 事件监听兼容写法addEvent
 * 事件解除兼容写法removeEvent
 * ele 元素    
 * e 事件   
 * fn  执行的函数
 * */
addEvent(data,'click')
function addEvent(ele, e, fn) {  
	if (ele.addEventListener) {
		ele.addEventListener(e, fn);
	} else if (ele.attachEvent) {
		ele.attachEvent('on' + e, fn);
	} else {
		ele['on' + e] = fn;
	}
}
function removeEvent(ele, e, fn) {
	if (ele.removeEventListener) {
		ele.removeEventListener(e, fn);
	} else if (ele.detachEvent) {
		ele.detachEvent('on' + e, fn);
	} else {
		ele['on' + e] = null;
	}
}


/**
 * ajax的封装
 * 	method 请求方式
 *  url 路径
 * 	data ?name=sunjiwei&age=25
 * 	fnSucc  请求成功
 * 	fnFaild 请求失败
 * */
function ajax(method,url,data,fnSucc,fnFaild){
    //1、创建Ajax实例
    try{
        var xml=new XMLHttpRequest();
    }catch (e){
        xml=new ActiveXObject("Microsoft.XMLHTTP");
    }
    //  清楚浏览器的缓存
    xml.setRequestHeader("If-Modified-Since", "0")。
    if(method.toUpperCase()=="POST"){
        xml.open(method,url,true);       
        xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xml.send(data);
    }else if(method.toUpperCase()=="GET"){
        //2、连接服务器  打开和服务器的链接
        xml.open(method,url+"?"+data,true);
        //3、发送
        xml.send();
    }
    //4、接收数据
    xml.onreadystatechange=function(){
        if(xml.readyState===4){
            if(xml.status===200){
                fnSucc(xml.responseText);
            }else {
                if(fnFaild){
                    fnFaild();
                }
            }
        }
    }
}


/**
* 
* 实现跨域      
*  	url  链接       
*  	data   name=liming&age=29
* */
function jsonp(url,data,callback){
    //1 生成script 便签
    osc=document.createElement("script");
    fname="f"+parseInt(Math.random()*10000);
    //在window对象上定义名字随机的函数
    window[fname]=callback;
    //2拼接url
    url=url+"?"+data+"&callback="+fname;
    osc.src=url;
    //将生成的script便签插入到head中  执行跨域请求
    document.head.appendChild(osc);
    window[fname]=function (text){
        if(callback){
            callback(text)
        }
        document.head.removeChild(osc);
    }
}


/**
 * setCookie  添加cookie
 * getCookie  查看cookie
 * removeCookie 删除cookie
 * */
function setCookie(key, value, expiresDate) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + expiresDate);
    document.cookie =
        key + "=" +
        value +
        ";expires=" +
        oDate
}
function getCookie(name) {
    var arr = document.cookie.split('; ')
    for (var i = 0; i < arr.length; i++) {
        var nowarr = arr[i].split('=');
        if (nowarr[0] == name) {
            return nowarr[1];
        }
    }
}
function removeCookie(key) {
    setCookie(key, "", -1)
}


//用js来区分不同版本的浏览器
function userAgent() {
	if (navigator.userAgent.indexOf('Firefox') != -1) {
		console.log('Firefox')
	} else if (navigator.userAgent.indexOf('Chrome') != -1) {
		console.log('Chrome')
	} else if (navigator.userAgent.indexOf('rv:11.0') != -1) {
		console.log('ie11')
	} else if (navigator.userAgent.indexOf('MSIE') != -1) {
		console.log('ie10及以下的版本')
	}
}


//   获取url上的值
function getParam(name){
	var search = location.search.substring(1);
	var regstr = "(^|&)" + name + "=(\\w+)(&|$)"
	var reg = new RegExp(regstr);
	var arr = reg.exec(search);
	if(arr){
		return arr[2];
	}else{
		return null;
	}
}
function getParams(name){
	var value = window.location.search.substring(1);			
	if(value.indexOf("&") != -1){
		var arr = value.split("&");	
		for (var i=0;i<arr.length;i++) {
			var newarr = arr[i].split("=");
			if(newarr[0] == name){
				return newarr[1];
			}
		}
	}else{
		var newarr = value.split("=")
		for (var i=0;i<newarr.length;i++) {
			if(newarr[0] == name){
				return newarr[1];
			}
		}
	}
}


// 锚链接跳转    滑动效果
function smooth(event){
	event.click(function(){
		if(location.pathname.replace(/^\//,"") == 
		this.pathname.replace(/^\//,"")
		&&location.hostname == this.hostname){
			var $target = $(this.hash);
			$target = $target.length&&$target || $("[name=]"+this.hash.slice(1)+"]");
			if($target.length){
				var targetoffset = $target.offset().top;
				$("html,body").animate({scrollTop:targetoffset},1000);
				return false;
			}
		}		
	})		
}


/**
 * 移动端封装的rem.js
 *   以及动态插入meta标签   
 * 	 ***如果开发的是webapp时不能采用，单独移动端时即可
 * */
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
        recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        if(clientWidth>=750){
            docEl.style.fontSize = '200px';
        }else{
            docEl.style.fontSize = (clientWidth / 7.5)*2 + 'px';
        }
    };
 	if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
// 以及动态插入meta标签   
(function(){
    var w=window.screen.width;
    var target=375
    var scale=target/w
    var meta=document.createElement("meta")
    meta.name="viewport"
    meta.content="initial-scale="+scale+",minimum-scale="+scale+",maximum-scale="+scale
    document.head.appendChild(meta);
})()



//  实现数组与对象的深拷贝
function deepClone(obj){
	let newObj;
	if (Array.isArray(obj)) {
		newObj = [];
	} else if(typeof obj === 'object'){
		newObj = {};
	} else {
		newObj = obj;
	};
	if (typeof obj === 'object') {
		for (item in obj) {
			if (obj.hasOwnProperty(item)) {
				if (obj[item] && typeof obj[item] === 'object') {
					newObj[item] = deepClone(obj[item]);
				} else{
					newObj[item] = obj[item];
				}
			}
		}
	}
	return nowObj;
}


/**
 * createTime() 设置日期格式
 * msec 毫秒数
 * select  默认false 设置为true 格式为 1971-06-11 08:01:04
 * */
function createTime(msec,select){
	var date = new Date(msec);
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	m = m<10?'0'+m:m;
	var d = date.getDate();
	d = d<10?("0"+d):d;
	var h = date.getHours();
	h = h<10?("0"+h):h;
	var M = date.getMinutes();
	M = M<10?("0"+M):M;
	var s = date.getSeconds();
	s = s<10?("0"+s):s;
	if (select) {
		var str = y+"-"+m+"-"+d+" "+h+":"+M+":"+s;
	} else{
		var str = y+"年"+m+"月"+d+"日  "+h+":"+M+":"+s;
	}
	return str;
}




/**
 * Ajax 的封装    get与post
 * 	method 传的方法  
 * 	url 请求的地址
 * 	data 向后端在url地址传的字段
 * 	
 * */

function ajax(method,url,data,fnSucc,fnFaild){
    //1、创建Ajax实例
    try{
        var xml=new XMLHttpRequest();
    }catch (e){
        xml=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(method.toUpperCase()=="POST"){
        xml.open(method,url,true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xml.send(data);
    }else if(method.toUpperCase()=="GET"){
        //2、连接服务器  打开和服务器的链接
        xml.open(method,url+"?"+data,true);
        //3、发送
        xml.send();
    }
    //4、接收数据
    xml.onreadystatechange=function(){
        if(xml.readyState===4){
            if(xml.status===200){
                fnSucc(xml.responseText);
            }else {
                if(fnFaild){
                    fnFaild();
                }
            }
        }
    }
}
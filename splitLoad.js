var splitLoad=function(){
	var count=0;  //计数器
	// 获取数据
	function loadData(url,callback){
		var xhr=new XMLHttpRequest();
		xhr.open("GET",url,true);
		xhr.send(null);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
					callback(JSON.parse(xhr.responseText));
				}
			}else{
				//alert("error!");
			}
		}
	}
	// 数组分组
	Array.prototype.toGroup=function(n){
		var arr=[],	// 二维数组用来存放结果
			len=Math.ceil(this.length/n),	//新数组的项数
			i;
		for(i=0;i<len;i++){
			arr.push(this.slice(i*n,i*n+n));
		}
		return arr;
	};
	// 判断是否到底部
	function isBottom(){
		var sTop=parseInt(document.body.scrollTop)||parseInt(document.documentElement.scrollTop),
			rootHeight=parseInt(document.documentElement.clientHeight),
			scrollHeight=parseInt(document.body.scrollHeight),
			bool=false;
		if(scrollHeight<=sTop+rootHeight){
			if(bool) return;
			bool=true;
			return true;
		}
	}
	// 事件绑定
	function binder(el,type,handle){
		if(el.addEventListener){
			el.addEventListener(type,handle,false);
		}else if(el.attachEvent){
			el.attachEvent("on"+type,handle);
		}
	}
	//事件解绑
	function unbinder(el,type,handle){
		if(el.removeEventListener){
			el.removeEventListener(type,handle,false);
		}else if(el.detachEvent){
			el.detachEvent("on"+type,handle);
		}
	}
	// 模板
	function render(tpl,data){
		var i,
			len=data.length,
			result="";
		function replace(o){
			var x,t,reg;
			for(x in o){
				reg=new RegExp('{{'+x+'}}','ig');
				t=(t||tpl).replace(reg,o[x]);
			}
			return t;
		}
		for(i=0;i<len;i++){
			result+=replace(data[i]);
		}
		return result;
	}
	// 事件处理函数
	function scrollHandle(box,tpl){
		if(isBottom()){
			if(count<dataGroup.length-1){
				count++;
				box.innerHTML+=render(tpl,dataGroup[count]);
			}else{
				unbinder(window,"scroll",arguments.callee.caller);
			}
		}
	}
	return {
		init:function(opts){
			var opts=opts||{},
				tpl=opts.tpl||"",  // 模板字符串
				box=opts.box||{},  // 把解析的模板字符串放置何处
				url=opts.url||"",  // 请求的网址
				num=opts.num||5;	// 每次展示的条数
			loadData(url,function(data){
				dataGroup=data.toGroup(num);
				box.innerHTML=render(tpl,dataGroup[0]);
			});
			binder(window,"scroll",function(){
				scrollHandle(box,tpl);
			});
		}
	}
}();
window.splitLoad=splitLoad;
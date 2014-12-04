(function(){

	var allData;
	loadAll();

	$('.card-empty')[0].addEventListener('dragenter',function(e){
		e.preventDefault();
	});

	$('.card-empty')[0].addEventListener('dragover',function(e){
		this.classList.add('active');
		e.preventDefault();
	});

	$('.card-empty')[0].addEventListener('drop',function(e){
		e.preventDefault();
		this.classList.remove('active');
		var file = e.dataTransfer.files[0];
		if(!file)return;
		var zxing = require('zxing');
		zxing.decode(file.path,function(err, result) {
			if (err != null) {
				alert('解析二维码出错：' + err.message);
				console.log(err); // Will output any errors found
				return;
			}
			var parsedResult = parseKey(result);
			createNew(parsedResult);
		});
	});

	$('#cardContainer')[0].addEventListener('click',function(e){
		if(!e.target.classList.contains('delete')) return;
		if(!confirm('确定要删除吗？')) return;

		var target = e.target;
		var $allDelete = $('#cardContainer .delete');
		var targetIndex;
		Array.prototype.forEach.call($allDelete,function(DOM,index){
			if(target == DOM){
				targetIndex = index;
			}
		});

		allData.splice(targetIndex,1);
		localStorage.setItem('allData',JSON.stringify(allData));
		loadAll();

	});

	function createNew(options){
		allData.push(options);
		localStorage.setItem('allData',JSON.stringify(allData));
		loadAll();
	}

	function loadAll(){
		allData = JSON.parse(localStorage.getItem('allData') || '[]');
		var html = allData.map(function(item){
			if(!item.color){
				item.color = ['blue','red','green','pink','yellow','purple'][(Math.random()*6)>>0];
			}
			return '<div class="card '+item.color+'">'+
				'<div class="delete">x</div>'+
				'<h3 class="title">'+item.title+'</h3>'+
				'<div class="number"></div>'+
				'<div class="count"></div>'+
				'</div>';
		}).join('');
		Array.prototype.forEach.call($('.card:not(.card-empty)'),function(DOM){
			DOM.parentNode.removeChild(DOM);
		});
		var tmp = document.createElement('div');
		tmp.innerHTML = html;
		var frag = document.createDocumentFragment();
		while (tmp.firstChild) {
			frag.appendChild(tmp.firstChild);
		}
		$('#cardContainer')[0].insertBefore(frag,$('.card-empty')[0]);
		refresh();
	}

	function parseKey(url){
		var parser = require('url');
		var parsedResult = parser.parse(url,true);
		var color = ['blue','red','green','pink','yellow','purple'][(Math.random()*6)>>0];
		return {
			method:parsedResult.host,
			key:parsedResult.query.secret,
			color:color,
			title:decodeURIComponent(parsedResult.pathname.substr(1))
		};
	}

	function refresh(){
		var onceler = require('onceler');
		var allNumbers = $('.number');
		var allCount = $('.count');
		if(!allData) return;
		allData.forEach(function(item,index){
			var obj = new onceler[item.method.toUpperCase()](item.key);
			var result = obj.now()+'';
			while(result.length < 6){
				result = '0' + result;
			}
			allNumbers[index].innerHTML = result;
			allCount[index].innerHTML = Math.floor(30-Date.now()/1000%30);
		});
		setTimeout(refresh,1000);
	}

	function $(selector){
		return document.querySelectorAll(selector);
	}

})();

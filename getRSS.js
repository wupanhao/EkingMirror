var axios = require('axios');
var XmlStream = require('xml-stream');
var fs = require('fs')

function format(filename){
	var stream=fs.createReadStream(filename);
	var xml = new XmlStream(stream);
	var data = [];
	// console.log(xml)
	xml.preserve('item');
	xml.on('endElement: item', function(item) {
	  console.log(item.title.$text);
	  data.push(item.title.$text);
	})

	xml.on('end',function(){
		console.log(data);
	})
}

function getRSS(name,url){
	axios.request(url).then(function(res){
		console.log(res.data)
		filename = 'rss/'+name+'.xml'
		fs.writeFileSync(filename,res.data);
		format(filename);
	}).catch((error) => {
		console.log(error)
	})
}

getRSS('douban','https://www.douban.com/feed/review/book')
getRSS('sciencedaily','http://feeds.sciencedaily.com/sciencedaily')

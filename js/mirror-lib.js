// var request = require('request');
var fs = require('fs');
var axios = require('axios');
var XmlStream = require('xml-stream');
var config = require('../config');
// var parser = require('xml2js').parseString;

// var moment = require('moment');
// request('https://www.douban.com/feed/review/book',function(error,response,data){
// 	console.log(data);
// })

function isSameDay(Date1,Date2){
	var now = new Date();
	console.log(Date1,Date2,now)
	console.log(Date1.getDate(),Date2.getDate() ,now.getDate(),Date1.getMonth(),Date2.getMonth() , Date1.getFullYear(),Date2.getFullYear())
	return Date1.getDate()==Date2.getDate() && Date1.getMonth()==Date2.getMonth() && Date1.getFullYear()==Date2.getFullYear()
}


function getRSS(callback){
	fs.stat('rss/rss.xml',function(err,stat){
		if(stat && stat.isFile){
			console.log('文件存在');
			var stream=fs.createReadStream('rss/rss.xml');
			var xml = new XmlStream(stream);
			var data = [];
			// console.log(xml)
			xml.preserve('item');
			xml.on('endElement: item', function(item) {
			  console.log(item.title.$text);
			  data.push(item.title.$text);
			})

			xml.on('end',function(){
				callback(data);
				}
			)
		}

		else{
			callback({status:'Fail',msg:'请检查rss.xml文件'})
		}
	})
}


function getLunarDate(callback){
	// var now = new Date(new Date().getTime() + 28800000)  ;
	var now = new Date();
	fs.stat('./lunar.json', function(err, stat){
    if(stat&&stat.isFile()) {
	console.log('文件存在');
	var data = JSON.parse(fs.readFileSync('lunar.json').toString());
    } else {
	console.log('文件不存在或不是标准文件');
    }

    if(data && data.data){
    	var lunar_date = data.data;
    	console.log(lunar_date)
    	console.log(now)
    	// console.log(lunar_date.day,now.getDate() ,lunar_date.month,(now.getMonth()+1) , lunar_date.year,now.getFullYear())
    	if(lunar_date.day==now.getDate() && lunar_date.month==(now.getMonth()+1) && lunar_date.year==now.getFullYear() ){
    		if(callback)
    			callback(lunar_date);
	    	return;
    	}
    	else
    		refreshLunarDate(callback);
    }
    else
    	refreshLunarDate(callback);
    // return;


});


}

function getWeather(city,callback){

	// var now = new Date(new Date().getTime() + 28800000)  ; 
	var now = new Date();

	fs.stat('./weatherForecast.json', function(err, stat){
    if(stat&&stat.isFile()) {
	console.log('文件存在');
	var data = JSON.parse(fs.readFileSync('weatherForecast.json').toString());
	if(data && data.daily_forecast && isSameDay(new Date(data.update.loc),now) ){
		if(callback)
		callback(data)
	}
	else{
		console.log('Not same day or data error'+data,now);
	console.log(isSameDay(new Date(data.update.loc),now) );
		refreshWeatherForecast(city,callback);
			}
    } else {
	console.log('文件不存在或不是标准文件');
	refreshWeatherForecast(city,callback);
    }

	});

}
// getLunarDate()

function refreshWeatherForecast(city,callback){
			axios.request("https://free-api.heweather.com/s6/weather/forecast", {params:{ location: city, key: config.key }}).then((res) => {
		var forecast = res.data.HeWeather6[0];
		console.log(forecast);
		fs.writeFileSync('weatherForecast.json',JSON.stringify(forecast));
		if(callback)
			callback(forecast);
	})
			// .catch((e)=>{console.log(e)});
}

function refreshLunarDate(callback){
    axios.request('http://www.sojson.com/open/api/lunar/json.shtml').then(function(res){
		console.log(res.data)
		fs.writeFileSync('lunar.json',JSON.stringify(res.data));
	    console.log('refresh lunar date');
	    callback(res.data.data);
	})
	// .catch((e)=>{console.log(e)})
}

// processLunarDate()
// axios.request

// console.log(moment("20111031", "YYYYMMDD").fromNow())

// console.log(now.getFullYear());

function test(){

return setTimeout(()=>{
	return 'hello';
},1000);
return 'world'
}

// console.log(test())

// getLunarDate((data)=>{
// 	console.log('I get ',data)
// });

// getWeather('北京',(data)=>{
// 	console.log('I get ',data)
// })

// refreshWeatherForecast('北京',console.log)

module.exports = {
    getWeather:getWeather,
    getLunarDate:getLunarDate,
    getRSS:getRSS,
}
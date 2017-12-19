// var request = require('request');
var fs = require('fs');
var axios = require('axios');
var XmlStream = require('xml-stream');
var config = require('./config');
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
	var rssFile = require('../config').rss;
	fs.stat(rssFile,function(err,stat){
		if(stat && stat.isFile){
			console.log('文件存在');
			var stream=fs.createReadStream(rssFile);
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
			callback({status:'Fail',msg:'请检查'+rssFile+'文件'})
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


	const execSync = require('child_process').execSync;

	var cmd = execSync('wget "https://free-api.heweather.com/s6/weather/forecast?location='+city+'&key='+config.key+'" -O heweather.json ').toString();
	// console.log(cmd);
	var data = JSON.parse(fs.readFileSync('heweather.json').toString());
	console.log(data)
	if(data.HeWeather6){
		var forecast = data.HeWeather6[0];
		fs.writeFileSync('weatherForecast.json',JSON.stringify(forecast));
		if(callback)
			callback(forecast);
		else
			callback({status:'Fail',msg:'data error'})
	}
	else
		callback({status:'Fail',msg:'data error'})


	/*
			axios.request("https://free-api.heweather.com/s6/weather/forecast", {params:{ location: city, key: config.key }}).then((res) => {
		var forecast = res.data.HeWeather6[0];
		console.log(forecast);
		fs.writeFileSync('weatherForecast.json',JSON.stringify(forecast));
		if(callback)
			callback(forecast);
	})
	*/
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


function getCi(n=1,callback){
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('data/ci.db');

	db.all('select * from ci WHERE length(content) > 2 ORDER BY random() Limit ' + n,function(err,res){
		if(err){
			console.log(err);
			callback({'status':'Fail'})
		}
		else
			callback(res)
	})

	db.close();
}

// getCi(10,console.log);
// getWeather('北京',console.log);
// refreshLunarDate(console.log);
// refreshWeatherForecast('北京',console.log);

module.exports = {
    getWeather:getWeather,
    getLunarDate:getLunarDate,
    getRSS:getRSS,
    getCi:getCi
}


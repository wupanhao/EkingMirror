curDate = new Date();

$('#date')[0].innerHTML = curDate.getFullYear()+'-'+(curDate.getMonth()+1)+'-'+curDate.getDate();
function getCurWeather(city){
$.get("https://free-api.heweather.com/s6/weather/now", { location: city, key: "09355c25f30b4b15859c3ccab86b1464" },(res) => {
	console.log(res);
} );
}

function getWeatherForcast(city){
	$.get('/weather',(res)=>{
		console.log(res);
		var forecast = res.daily_forecast
		for (var i = 0 ; i < forecast.length ; i++) {
			$('#weather-forecast')[0].innerHTML +='<tr><td>'+ forecast[i].date.substring(5)+'  </td><td>'+forecast[i].cond_txt_d+'  </td><td>'+forecast[i].tmp_min+'°~'+forecast[i].tmp_max+'°<td></tr>';
			console.log(forecast[i]);
		}

	})
}

var weather_icon={
	sunny:'wi-day-sunny',
	cloudy:'wi-day-cloudy',
	rain:'wi-day-rain',
	snowy:'wi-day-snowy'
}
$('#top-right')[0].innerHTML = '<i class="wi '+weather_icon.sunny+' large"></i>' ;
$('#lower-third')[0].innerHTML = 'You look good~' ;

// http://www.sojson.com/open/api/lunar/json.shtml



function getLunarDate(date){

	$.get('/lunar_date',(res) =>{
		console.log(res);
		console.log(res.lunarYearString+'年'+res.cnmonth+'月'+res.cnday)
		var lunar_date_string = res.lunarYearString+'年'+res.cnmonth+'月'+res.cnday;
		$('#date')[0].innerHTML +='  '+lunar_date_string
	});
}

comment = [];
update_time = new Date('2017-1-1');

function getRSS(){
	$.get('/rss',(res) => {
		console.log(res);
		// $('#bottom-center')[0].innerHTML ='<div style="font-size:24px">' + res[Math.floor(Math.random()*res.length)]+'</div>';
		comment = res;
	})
}

getWeatherForcast();
getLunarDate();
getRSS();

 var socket = io();

 socket.on('message',(data)=>{
 	console.log(data);
	$('#lower-third')[0].innerHTML = data.msg ;
 })

setInterval(()=>{
	var date = new Date();
	var time = date.toTimeString();
	// console.log(time);
	$('#time')[0].innerHTML = time.substring(0,8);
	if(date.getTime() - update_time.getTime() > 3000){
		update_time = date;
		console.log('update comment at ' + time)
		$('#bottom-center')[0].innerHTML ='<div >' + comment[Math.floor(Math.random()*comment.length)]+'</div>';
	}
},1000)



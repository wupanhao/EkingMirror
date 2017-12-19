

function isSameDay(Date1,Date2){
	// var now = new Date();
	// console.log(Date1,Date2,now)
	// console.log(Date1.getDate(),Date2.getDate() ,now.getDate(),Date1.getMonth(),Date2.getMonth() , Date1.getFullYear(),Date2.getFullYear())
	return Date1.getDate()==Date2.getDate() && Date1.getMonth()==Date2.getMonth() && Date1.getFullYear()==Date2.getFullYear()
}


 function updateCi(){
 	setInterval(()=>{
	var date = new Date();
	var time = date.toTimeString();
	// console.log(time);
	$('#time')[0].innerHTML = time.substring(0,8);
	if(date.getTime() - update_time.getTime() > 600000){
		update_time = date;
		var data = comment[Math.floor(Math.random()*comment.length)];
		console.log('update comment at ' + time,data)
		// ci
		$('#bottom-center')[0].innerHTML ='<div class="medium align-left">    ' + data.content+'</div>' + '<div class="medium align-right" >《' + data.rhythmic +'》—— '+data.author + '</div>';
	}


},1000)
 }


function getWeatherForcast(city){
	$.get('/weather',(res)=>{
		console.log(res);
		var forecast = res.daily_forecast
		var html = ""
		for (var i = 0 ; i < forecast.length ; i++) {
			 html+='<tr><td>'+ forecast[i].date.substring(5)+'  </td><td>'+forecast[i].cond_txt_d+'  </td><td>'+forecast[i].tmp_min+'°~'+forecast[i].tmp_max+'°<td></tr>';
			console.log(forecast[i]);
		}
		$('#weather-forecast')[0].innerHTML = html
	})
}

function getLunarDate(date){

	$.get('/lunar_date',(res) =>{
		console.log(res);
		if(res.update)
			today = new Date(res.update.loc)
		console.log(res.lunarYearString+'年'+res.cnmonth+'月'+res.cnday)
		var lunar_date_string = res.lunarYearString+'年'+res.cnmonth+'月'+res.cnday;
		$('#date')[0].innerHTML ='  '+lunar_date_string
	});
}

function getRSS(){
	$.get('/rss',(res) => {
		console.log(res);
		// $('#bottom-center')[0].innerHTML ='<div style="font-size:24px">' + res[Math.floor(Math.random()*res.length)]+'</div>';
		comment = res;
	})
}

function getCi(){
		$.get('/ci',{num:100},(res) => {
		console.log(res);
		// $('#bottom-center')[0].innerHTML ='<div style="font-size:24px">' + res[Math.floor(Math.random()*res.length)]+'</div>';
		comment = res;
		updateCi();
	})
}

curDate = new Date();

$('#date')[0].innerHTML = curDate.getFullYear()+'-'+(curDate.getMonth()+1)+'-'+curDate.getDate();
function getCurWeather(city){
$.get("https://free-api.heweather.com/s6/weather/now", { location: city, key: "09355c25f30b4b15859c3ccab86b1464" },(res) => {
	console.log(res);
} );
}

var weather_icon={
	sunny:'wi-day-sunny',
	cloudy:'wi-day-cloudy',
	rain:'wi-day-rain',
	snowy:'wi-day-snowy'
}
$('#top-right')[0].innerHTML = '<i class="wi '+weather_icon.sunny+' xlarge"></i>' ;
$('#lower-third')[0].innerHTML = 'You look good~' ;

// http://www.sojson.com/open/api/lunar/json.shtml

today = new Date();




comment = [];
update_time = new Date('2017-1-1');



getWeatherForcast();
getLunarDate();
// getRSS();
getCi()

 var socket = io();

 socket.on('message',(data)=>{
 	console.log(data);
	$('#lower-third')[0].innerHTML ='<div class="large">'+ data.msg +'</div';
 })





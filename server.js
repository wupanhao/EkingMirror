var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mirror_lib = require('./js/mirror-lib');
var bodyParser = require('body-parser')
var res = "";

var head = "";
function getList(req,res){
var path = root;
var body = head;
console.log(req.query);
console.log(req.query.path);
if(req.query && req.query.path)
path = decodeURI(req.query.path)+'/';

}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// app.use('/static', express.static('public'));
// app.get('/dir',getList);

app.use('/', express.static('public'));
app.use('/', express.static('node_modules'));


app.get('/', function (req, res) {
		res.sendFile(process.cwd() +'/public/index.html');
})

app.get('/weather', function (req, res) {
		// mirror_lib.getWeather('北京',console.log)

		mirror_lib.getWeather('北京',return_json(res))
		// res.send('weather');
})

app.get('/lunar_date',function(req,res){
	mirror_lib.getLunarDate(return_json(res))
})

app.get('/rss',(req,res)=>{
	mirror_lib.getRSS(return_json(res))
})

app.get('/send_msg',(req,res) => {
	res.send('<form method="POST" action="/message"><input name="msg" type="text"><input type="submit" value="发送"></form>')
})

app.post('/message',(req,res) => {
	// console.log(req)
	var query = req.body
	if( query && query.msg ){
		io.emit('message',{msg:query.msg})
		res.json({status:'OK'})
	}
	else
		res.json({status:'Fail'})
})


function return_json(res){
	return (data) => {
		res.json(data);
	}
}

io.on('connection',function(socket){
	console.log('a user connected');
	io.emit('message',{msg:"hello world"})
})

http.listen(8081, function(){
  console.log('listening on *:8081');
});
 
// var server = app.listen(8081, function () {
 
//   var host = server.address().address
//   var port = server.address().port
 
//   console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
// })

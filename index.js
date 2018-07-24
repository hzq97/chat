/*
 * @Author: anchen
 * @Date:   2018-06-10 16:28:31
 * @Last Modified by:   anchen
 * @Last Modified time: 2018-06-10 22:07:18
 */
var express = require('express');
var _ = require('underscore');
var app = express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var user_list=[];
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
var io = require('socket.io')(server);
io.on('connection', function(socket) {
	//用户上线
	socket.on('name',function(data){
		socket.name = data;
		user_list.push({id:socket.id,name:socket.name});
    	io.emit('user_list',{list:user_list});
		io.emit('name',{name:socket.name});
	})
	//用户发送信息
    socket.on('text-content', function(data) {
        io.emit('text-content', {content:data,name:socket.name});
    });
    //接收图片
    socket.on('img',function(data){
    	io.emit('img',{name:socket.name,path:data});
    })
    //用户下线
    socket.on('disconnect',function(){
    		user_list = _.filter(user_list,function(e){
    			return e.id!=socket.id;
    		})
    		io.emit('user_list',{list:user_list});
			io.emit('dis',{name:socket.name});
		})
});
server.listen(3030);
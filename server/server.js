const express = require('express');
const path = require('path')
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;
const io = new Server(server);

const online_users = new Map();
// Map() - структура данных похожая на объект


// Раздаем статику из папки client
app.use(express.static(path.join(__dirname,'../client')))


// Подключение тригера на событие нового клиент
io.on('connection',(socket)=>{
 
    let id = socket.id;
    console.log(`🔵 Пользователь ${id} подключился`);
  
    // --- Функция на случай подключения нового пользователя к приложению
    socket.on('join',(username) => {
      socket.username  = username;
      online_users.set(socket.id,username) // Сохраняем в список онлайн пользователей нового пользователя
      

      io.emit('online users',{
        count:online_users.size,
        users:Array.from(online_users.values()),
        user_info: {status:true,name:socket.username}
      })

    })
    // --- Функции на случай отключения пользователя от приложения
    socket.on('disconnect',() => {
        console.log(`🔴 Пользователь ${id} отключился`);
        online_users.delete(socket.id)
        io.emit('online users',{
         count:online_users.size,
         users:Array.from(online_users.values()),
         user_info: {status:false,name:socket.username}
      })
    })

    // --- Функция на случай получения сервером нового сообщения от клиента
    socket.on('chat message', (msg) => {
        console.log(`Пользователь ${msg.user} отправил сообщение: ${msg.text}`);
        io.emit('chat message',msg) // Отправили сообщение всем подключенным клиентам
    })

    // --- Функция на случай получения сервером события о том, что клиент начал печатать сообщение
    socket.on('typing', (username)=>{
        socket.broadcast.emit('typing',username) // Отправляем всем клиентам, кроме того, кто начал печатать, событие о том, что пользователь начал печатать
    })

    // --- Функция на случай получения сервером события о том, что клиент прекратил печатать сообщение
    socket.on('stop typing',(username)=>{
        socket.broadcast.emit('stop typing',username) // Отправляем всем клиентам, кроме того, кто прекратил печатать, событие о том, что пользователь прекратил печатать
    })


});


server.listen(PORT,"0.0.0.0",()=>{
    console.log(`Ваш сервер запущен на порту http://localhost:${PORT}`)
    console.log(`Глобальный адрес: http://192.168.1.52:${PORT}`)
})

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
    
    socket.on('join',(username)=>{
      socket.username  = username;
      online_users.set(socket.id,username) // Сохраняем в список онлайн пользователей нового пользователя
      //--- 
      io.emit('online users',{
        count:online_users.size,
        users:Array.from(online_users.values())
      })

    })
    // --- Функции на случай отключения пользователя от приложения
    socket.on('disconnect',() => {
        console.log(`🔴 Пользователь ${id} отключился`);
        online_users.delete(socket.id)
        io.emit('online users',{
        count:online_users.size,
        users:Array.from(online_users.values())
      })
    })

    

    socket.on('chat message', (msg) => {
        console.log(`Пользователь ${msg.user} отправил сообщение: ${msg.text}`);
        io.emit('chat message',msg) // Отправили сообщение всем подключенным клиентам
    })

})



server.listen(PORT,"0.0.0.0",()=>{
    console.log(`Ваш сервер запущен на порту http://localhost:${PORT}`)
    console.log(`Глобальный адрес: http://192.168.1.52:${PORT}`)
})

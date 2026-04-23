const socket = io();
const userNameEl = document.querySelector('#user-name')
const chat = document.querySelector('#chat');
const msgInp = document.querySelector('#msg-inp');
const msgBtn = document.querySelector('#send-message');
const onlineUsersEl = document.querySelector('#online-users');
const usersListEl = document.querySelector('#users-list')

let user_name = prompt('Введите ваше имя');
userNameEl.textContent = user_name;
socket.emit('join',user_name); // Как только подключился пользователь сразу отправляем на сервер

function sendMessage(){
    let msg =  msgInp.value; // Получили сообщение

    // Проверили сообщение
    if(msg.length  < 1 ){
        alert('У вас пустое сообщение')
        return;
    }
    
    const data = {
        user:user_name,
        text:msg
    }

    // Отправили по socket соединению сообщение на сервер
    socket.emit('chat message',data)
    msgInp.value = '';
}


// Слушатели


socket.on('chat message',(data)=>{
    console.log('Мы получили сообщение' + data)
    let time = new Date();
    let hours = time.getHours();
    let mins = time.getMinutes();

    let temp = `
                <div class="message">
                    <div class="message-author"> ${data.user}</div>
                    <div class="message-text"> ${data.text} </div>
                    <div class="message-time">${hours} : ${mins} </div>
                </div>
    `

    chat.textContent += temp;
})

socket.on('online users',(data)=>{
    const {count,users} = data;
    onlineUsersEl.innerHTML = count;
   
    console.log(users);

    usersListEl.innerHTML = '';

    users.forEach((value) => {
        let tmp = ` <div class="connected-user">
                      <img width="30px" src="./assets/avatars/ava.png" alt="">
                     ${value}
                    </div>`
        usersListEl.innerHTML+= tmp;
    })

})


 // По нажатию на кнопку отправки отправляем сообщение
 msgBtn.onclick = sendMessage;
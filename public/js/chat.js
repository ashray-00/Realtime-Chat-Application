(function connect() {
    let socket = io.connect('http://localhost:3000')

    let username = document.querySelector('#username')
    let usernameBtn = document.querySelector('#usernameBtn')
    let curUsername = document.querySelector('.text')

    let message = document.querySelector('#message')
    let messageBtn = document.querySelector('#messageBtn')
    let messageList = document.querySelector('#message-list')

    let info = document.querySelector('.info')

    usernameBtn.addEventListener('click', e => {
        console.log(username.value)
        socket.emit('change_username', { username: username.value })
        curUsername.textContent = username.value
        username.value = ''
    })

    username.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            console.log(username.value)
            socket.emit('change_username', { username: username.value })
            curUsername.textContent = username.value
            username.value = ''
        }
    })

    messageBtn.addEventListener('click', e => {
        console.log(message.value)
        socket.emit('new_message', { message: message.value })
        message.value = ''
    })

    message.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            console.log(message.value)
            socket.emit('new_message', { message: message.value })
            message.value = ''
        }
    })

    socket.on('receive_message', data => {
        console.log(data)
        let listItem = document.createElement("div")
        var messages = document.getElementById("message-list")
        listItem.classList.add('chat__message')
        let span = document.createElement("span")
        messages.appendChild(listItem).append(data.message)
        messages
            .appendChild(span)
            .append("by " + data.username)
        var objDiv = document.getElementById("scroller");
        objDiv.scrollTop = objDiv.scrollHeight;
    })

    message.addEventListener('keypress', e => {
        socket.emit('typing')
        var objDiv = document.getElementById("scroller");
        objDiv.scrollTop = objDiv.scrollHeight;
    })

    socket.on('typing', data => {
        info.textContent = data.username + " is typying..."
        setTimeout(() => { info.textContent = '' }, 5000)
    })
})();

(function () {
    fetch("/chats")
        .then(data => {
            return data.json()
        })
        .then(json => {
            json.map(data => {
                let listItem = document.createElement("div")
                var messages = document.getElementById("message-list")
                listItem.classList.add('chat__message')
                let span = document.createElement("span")

                // messages.appendChild(listItem)
                messages.appendChild(listItem).append(data.message)
                messages
                    .appendChild(span)
                    .append("by " + data.sender)
            })
            var objDiv = document.getElementById("scroller");
            objDiv.scrollTop = objDiv.scrollHeight;
        })
})();

// window.onload=function () {
//     var objDiv = document.getElementById("scroller");
//     objDiv.scrollTop = objDiv.scrollHeight;
// }
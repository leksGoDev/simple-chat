//import createWebSocket from "./websocket.js";

let ws = null
let login = ''
const URL = 'localhost:3000'
let isConnected = false

const buttonSend = document.querySelector('.button-send')
const buttonDisc = document.querySelector('.button-disc')
const input = document.querySelector('.main-input')
const label = document.getElementById('label')
const textArea = document.querySelector('.messages')

buttonSend.addEventListener('click', event => {
    event.preventDefault()
    if (input.value.trim() !== '') {
        if (!isConnected) {
            isConnected = true
            login = input.value
            ws = createWebSocket(`ws://${URL}`)
        } else {
            const message = {
                action: 'message',
                userName: login,
                data: input.value
            }
            ws.send(JSON.stringify(message))
        }
        input.value = ''
    }
})
buttonDisc.addEventListener('click', event =>{
    event.preventDefault()
    const message = {
        action: 'disconnection',
        userName: login
    }
    ws.send(JSON.stringify(message))
    isConnected = false
    login = ''
    input.value = ''
    ws.close()
})
const renderOpening = () => {
    alert('Соединение установлено.')
    label.textContent = `Пользователь "${login}"`
    input.placeholder = 'Введите сообщение...'
    buttonDisc.disabled = false
}
const renderClosing = () => {
    alert('Соединение прервано.')
    label.textContent = 'Имя пользователя'
    input.placeholder = 'Введите имя...'
    buttonDisc.disabled = true
}
function createWebSocket(url){
    const websocket = new WebSocket(`ws://${URL}`)
    websocket.onopen = () => {
        renderOpening()
        const message = {
            action: 'connection',
            userName: login
        }
        websocket.send(JSON.stringify(message))
    }
    websocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        switch (message.action){
            case 'connection':
                textArea.value += `Пользователь "${message.userName}" подключился.\n`
                break;
            case 'message':
                textArea.value += `${message.userName}: ${message.data}\n`
                break;
            case 'disconnection':
                textArea.value += `Пользователь "${message.userName}" отключился.\n`
                break;
        }
    }
    websocket.onclose = (event) => {
        renderClosing()
    }
    websocket.onerror = (event) => {

    }
    return websocket
}
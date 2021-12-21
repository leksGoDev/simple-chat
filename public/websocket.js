export default function createWebSocket(url){
    const ws = new WebSocket(url)
    ws.onopen = (event) => {
        console.log('Client connected')
    }
    ws.onmessage = (event) => {
        console.log(event.data)
    }
    ws.onclose = (event) => {

    }
    ws.onerror = (event) => {

    }
    return ws
}
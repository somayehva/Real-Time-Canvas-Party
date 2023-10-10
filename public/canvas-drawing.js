const socket = new WebSocket('ws://10.0.0.116:3000');
const canvas = document.querySelector("#draw");
const container = document.querySelector('.container');
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = "#BADA55";
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 10;

let isDrawing = false;
let lastX = 0
let lastY = 0
let hue = 0;
// let direction = true;


function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    hue++;
    if (hue >= 360) {
        hue = 0;
    }
    // if (ctx.lineWidth >= 20 || ctx.lineWidth <= 5) {
    //     direction = !direction;
    // }
    // if (direction) {
    //     ctx.lineWidth++;
    // } else {
    //     ctx.lineWidth--;
    // }
    const drawingData = {
        eventType: 'drawing',
        initialX: lastX,
        initialY: lastY,
        finalX: e.offsetX,
        finalY: e.offsetY,
        color: ctx.strokeStyle,
        lineWidth: ctx.lineWidth,
    };
    [lastX, lastY] = [e.offsetX, e.offsetY];
    socket.send(JSON.stringify(drawingData));
}

function displayCursor(e) {
    const mouseData = {
        eventType: 'mouse',
        x: e.offsetX,
        y: e.offsetY
    }
    socket.send(JSON.stringify(mouseData));
}

window.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    const drawingData = {
        eventType: 'drawing',
        initialX: lastX,
        initialY: lastY,
        finalX: e.offsetX,
        finalY: e.offsetY,
        color: ctx.strokeStyle,
        lineWidth: ctx.lineWidth,
    }
    socket.send(JSON.stringify(drawingData));
});
window.addEventListener("mousemove", draw);
window.addEventListener("mouseup", () => isDrawing = false);
window.addEventListener("mouseout", () => isDrawing = false);
window.addEventListener('mousemove', displayCursor);

// event listener to handle WebSocket messages
socket.addEventListener('message', (e) => {
    const drawingData = JSON.parse(e.data);
    if (drawingData.eventType === 'drawing') {
        ctx.lineWidth = drawingData.lineWidth;
        ctx.strokeStyle = drawingData.color;
        ctx.beginPath();
        ctx.moveTo(drawingData.initialX, drawingData.initialY);
        ctx.lineTo(drawingData.finalX, drawingData.finalY);
        ctx.stroke();
    } else if (drawingData.eventType === 'mouse') {
        const { x, y, id } = drawingData;
        let userElement = document.querySelector(`div[data-id="${id}"]`);
        if (userElement == null) {
            const randHexColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
            const cursorDiv = document.createElement('div');
            cursorDiv.innerHTML = `<i class="fa-solid fa-arrow-pointer" style="color:${randHexColor} "></i><span>User ${id}</span>`;
            cursorDiv.classList.add('user-cursor');
            cursorDiv.dataset.id = id;
            container.appendChild(cursorDiv);
        }
        userElement.style.top = y + "px";
        userElement.style.left = x + "px";

    } else if (drawingData.eventType === 'connection') {
        const { id } = drawingData;
        console.log("New user connect: ", id);
        const randHexColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        const cursorDiv = document.createElement('div');
        cursorDiv.innerHTML = `<i class="fa-solid fa-arrow-pointer" style="color:${randHexColor} "></i><span>User ${id}</span>`;
        cursorDiv.classList.add('user-cursor');
        cursorDiv.dataset.id = id;
        container.appendChild(cursorDiv);

    } else if (drawingData.eventType === 'disconnect') {
        const { id } = drawingData;
        let userElement = document.querySelector(`div[data-id="${id}"]`);
        if (userElement != null) {
            userElement.remove();
        }
    }
});
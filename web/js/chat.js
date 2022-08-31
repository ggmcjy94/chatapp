//로그인 시스템 대신
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");
document.querySelector("#username").innerHTML = username;
// sse 연결하기
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);
eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.sender === username) { // 내가 보내면
        //파란 박스
        initMyMessage(data);
    } else {
        // 회색 박스
        initYourMessage(data);
    }
}

//파란 박스
function getSendMsgBox(data) {

    let md = data.createdAt.substring(5,10);
    let tm = data.createdAt.substring(11,16);
    convertTime = tm + " | " + md;

    return `<div class="sent_msg"> 
    <p>${data.message}</p> 
    <span class="time_date">${convertTime} / <b>${data.sender}</b></span> 
    </div>`
}

// 회색 박스
function getReceiveMsgBox(data) {

    let md = data.createdAt.substring(5,10);
    let tm = data.createdAt.substring(11,16);
    convertTime = tm + " | " + md;
    return `<div class="received_withd_msg"> 
    <p>${data.message}</p> 
    <span class="time_date">${convertTime} / <b>${data.sender}</b></span> 
    </div>`
}

//파란 박스 초기화
// addMessage() 함수 호출 db 에 insert 되고 그데이터가 자동으로 흘러 들어옴 (sse 방식이라)
function initMyMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    
    let sendBox = document.createElement("div");
    sendBox.className = "outgoing-msg";

    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
}


// 회색박스 초기화
function initYourMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    
    let receivedBox = document.createElement("div");
    receivedBox.className = "received-msg";

    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
}

//Ajax 채팅 메시지를 전송
async function addMessage() {
    let msgInput = document.querySelector("#chat-outgoing-msg");
    
    let chat = {
        sender: username,
        roomNum: roomNum, 
        message : msgInput.value
    };

   fetch("http://localhost:8080/chat" , {
        method: "post",
        body: JSON.stringify(chat),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });
    msgInput.value = "";
}

//버튼 클릭시 메시지 전송
document.querySelector("#chat-outgoing-button").addEventListener("click", () => {
    addMessage();
});


//엔터 클릭시 메시지 전송
document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        addMessage();
    }
});
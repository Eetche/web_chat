let socket = io();

let send = document.querySelector(".send");
let input = document.querySelector(".input");
let messages = document.querySelector("#messages");
let pseudo = document.querySelector(".pseudo");
let inputing = document.querySelector(".inputing");

let onlineAmount = document.querySelector(".online_amount");
let onlineIndicator = document.querySelector(".online_indicator");

let imageInput = document.querySelector(".image_input")

let createRoom = document.querySelector("#create_room")
let createRoomTable = document.querySelector(".create_room_table")
let createRoomClose = document.querySelector(".create_room_table .btn-close");
let createRoomNameInput = document.querySelector("#room_name_input")
let createRoomButton = document.querySelector("#create_room_btn")

let alertDiv = document.querySelector(".alert")

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

createRoom.addEventListener('click', () => {
  createRoomTable.style.display = "flex"
})

createRoomClose.addEventListener('click', () => {
  createRoomTable.style.display = "none"
})

createRoomButton.addEventListener("click", () => {
  if (createRoomNameInput.value) {
    socket.emit("join", {roomName: createRoomNameInput.value})
  }
})

function sendMessage(content, pseudo) {

  let myMessage = document.createElement("div");
  myMessage.className = "message my_message";

  let messageContent = document.createElement("li");
  messageContent.className = "message_content";
  messageContent.textContent = content;

  let pseudoTitle = document.createElement("p");
  pseudoTitle.className = "pseudo_title";
  pseudoTitle.textContent = getCookie("nickname");

  if (imageInput.files[0]) {
    let reader = new FileReader();

    let messageImage = document.createElement("img")
    messageImage.className = "image_message"
    messageImage.title = imageInput.files[0].name

    reader.onload = (event) => {
      messageImage.src = event.target.result;

      imageInput.value = ""


      if (content && getCookie("nickname") || event.target.result) {
        myMessage.appendChild(pseudoTitle);
        myMessage.append(messageImage)
        myMessage.appendChild(messageContent);
        messages.appendChild(myMessage);
      }

      if (content && getCookie("nickname") || event.target.result) {
        socket.emit("chat message", {
          input: content,
          pseudo: pseudo,
          imageURL: event.target.result.toString("base64")
        });
      }

    }

    reader.readAsDataURL(imageInput.files[0])
  } else {
    if (content && getCookie("nickname")) {
        messages.appendChild(myMessage);
        myMessage.appendChild(pseudoTitle);
        myMessage.appendChild(messageContent);

        socket.emit("chat message", {
          input: content,
          pseudo: pseudo,
          imageURL: undefined
        });
      }
  }


}

function sendUser() {
  sendMessage(input.value, getCookie("nickname"));
  input.value = "";
}

window.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    sendUser();
  }
});

send.addEventListener("click", (e) => {
  e.preventDefault();

  sendUser();
});

input.addEventListener("input", () => {
  if (input.value && getCookie("nickname")) {
    send.style.width = "50px";
  } else {
    send.style.width = "0px";
  }

  socket.emit("inputing", { pseudo: getCookie("nickname") });
});

imageInput.addEventListener("input", () => {
  if (imageInput.value && getCookie("nickname")) {
    send.style.width = "50px";
  } else {
    send.style.width = "0px";
  }

  socket.emit("inputing", { pseudo: getCookie("nickname") })
})

msgSound = new Audio("/message.mp3")

socket.on("chat message", (data) => {
  let imageMessage = document.createElement("img")
  imageMessage.className = "image_message"

  let message = document.createElement("div");
  message.className = "message";

  let messageContent = document.createElement("li");
  messageContent.className = "message_content";
  messageContent.textContent = data.input;

  let pseudo = document.createElement("p");
  pseudo.className = "pseudo_title";
  pseudo.textContent = data.pseudo;

  let imageMessageURL = data.imageURL

  message.appendChild(pseudo);

  if (imageMessageURL) {
    imageMessage.src = imageMessageURL
    message.appendChild(imageMessage)
  }

  message.appendChild(messageContent);
  messages.appendChild(message);

  window.scrollTo(0, document.body.scrollHeight);

  msgSound.play()

});

socket.on("join", (data) => {
  alertDiv.style.top = "0px"
  alertDiv.textContent = "Вы вступили в группу " + data.roomName

  setTimeout(() => {
    alertDiv.style.top = "-75px"
  }, 3000)
})

let inputingClients = [];

setInterval(() => {
  if (inputing.textContent != "") {
    inputingClients = [];
    inputing.textContent = "";
  }
}, 2500);

socket.on("inputing", (data) => {
  if (!inputingClients.includes(data.pseudo)) {
    inputingClients.push(data.pseudo);
  }

  if (inputingClients.length != 0) {
    if (inputingClients.length > 2) {
      inputing.textContent = `${inputingClients[0]}, ${inputingClients[1]}... печатают`;
    } else {
      inputing.textContent = inputingClients + " печатает...";
    }
  }
});

socket.on("connec", (online) => {
  onlineAmount.textContent = online;

  if (online < 2) {
    onlineIndicator.style.background = "grey"
  }
});

socket.on("disconnec", (online) => {
  onlineAmount.textContent = online;

  if (online < 2) {
    onlineIndicator.style.background = "grey"
  }
});

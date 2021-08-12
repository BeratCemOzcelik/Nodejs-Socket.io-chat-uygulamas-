const socket = io.connect("http://localhost:3000");

const sender = document.getElementById('sender')
const message = document.getElementById('message')
const submitBtn = document.getElementById('submitBtn')
const output = document.getElementById('output')
const imageBtn = document.getElementById('imageBtn')

eventListeners();

function eventListeners() {   
    document.addEventListener("DOMContentLoaded", loadAllMessagesToUI);
    output.addEventListener("click",deleteMessage)

}

function deleteMessage(e){ //silincek veriyi bulan ve arayüzden kaldıran fonksiyon

    if(e.target.className === "delete-message"){
        e.target.parentElement.remove();
        deleteMessageFromStorage(e.target.parentElement)
    }
}

function deleteMessageFromStorage(deleteMessage){   //localStorage den veri silme
        let messages = getMessagesFromStorage();
        resim = deleteMessage.childNodes[1].src
       let parcala = deleteMessage.childNodes[0].innerText.split(":")
       console.log(parcala);
        let gonderen =  parcala[0].trim();
        let mesaj = parcala[1].trim();


        messages.forEach(function(data,index){

            if( data.message ===mesaj && data.sender === gonderen && data.image === resim){
                    messages.splice(index,1); // arrayden değeri silicez
            }

        });

        localStorage.setItem("messages",JSON.stringify(messages)); //localStorage ı güncelliyoruz.


}

function loadAllMessagesToUI() {     //tüm mesajları localstorage den ui a aktaran fonksiyon
    let messages = getMessagesFromStorage();

    messages.forEach(function(message){
        addMessageToUi(message)
    })


}



function addMessageToUi(message) {  //gelen mesajı arayüze ekleyen fonksiyon

    if(message.image === undefined)
    {
        output.innerHTML += '<div classname="message">'+'<p id="mesaj"><strong>' +
        message.sender + ':</strong>' +
        message.message + "" + '  </p>' +'<button href = "#" class ="delete-message">Bu mesajı sil</button>'+'</div>';
    }

    else{
    output.innerHTML +='<div classname="message">'+ '<p id="mesaj"><strong>' +
        message.sender + ':</strong>' +
        message.message + "" + '  </p>' + '<img width="400px" height="200px" src="' +
        message.image + '"/> <br/>'+'<button href = "#" class ="delete-message">Bu mesajı sil</button>'+'</div>';
    }

}

function getMessagesFromStorage() {  //mesajları localStorage den alan fonksiyon.

    let messages;

    if (localStorage.getItem("messages") === null) {
        messages = [];
    }
    else {
        messages = JSON.parse(localStorage.getItem("messages"));
    }

    return messages;

}

function addMessageToStorage(newMessage) {  //mesajı localStroge e ekleyen fonksiyon.
    let messages = getMessagesFromStorage();

    messages.push(newMessage);

    localStorage.setItem("messages", JSON.stringify(messages));


}



submitBtn.addEventListener('click', () => { //sadece yazı gönderen buton
    socket.emit('chat', { //servere socket.io ile veri gönderiyoruz
        message: message.value,
        sender: sender.value
    })
})


imageBtn.addEventListener("change", function () { // hem resim hem yazı gönderen buton
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        socket.emit('chat', {    //servere socket.io ile veri gönderiyoruz
            image: reader.result,
            message: message.value,
            sender: sender.value
        })

    });

    reader.readAsDataURL(this.files[0]);

})


socket.on('chat', data => {  // serverden veri alan fonksiyon

    addMessageToStorage(data);
    addMessageToUi(data);

})
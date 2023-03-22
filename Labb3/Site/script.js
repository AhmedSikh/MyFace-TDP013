document.getElementById("twot").onclick = async function newMessage(){
    const textBox = document.getElementById("message");
    const message = textBox.value;
    
    //error handling
    if(message.length < 1)
    {
        return;
    }
    else if(message.length > 140)
    {
        document.getElementById("error-overlay").style.visibility = "visible"
        document.getElementById("error-text").innerHTML = "Message too long. Max 140 characters allowed."
        return;
    }
    else if(message.search(";") != -1)
    {
        document.getElementById("error-overlay").style.visibility = "visible";
        document.getElementById("error-text").innerHTML = "You can't twoot a semi-colon ( ; ). Sorry!";
        return;
    }

    textBox.value = "";
    
    //Save message to DB
    jsonData = JSON.stringify({message: message})

    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://localhost:3000/messages', true);
    xhttp.setRequestHeader('Content-type', 'application/json', 'Authorization', 'Bearer <access token>');
    xhttp.onload = function (){loadMessages()};
    xhttp.send(jsonData);
}
function createMessage(message, readstatus, messageID)
{
    const newElement = document.createElement("div");
    newElement.setAttribute("class", "message");
    newElement.setAttribute("messageid", messageID);
    const text = document.createElement("p");
    text.appendChild(document.createTextNode(message));

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.onclick = setReadstatus;
    if(readstatus)
    {
        checkBox.setAttribute("checked", "");
    }

    newElement.appendChild(text);
    newElement.appendChild(checkBox);

    document.getElementById("message_box").appendChild(newElement);
}

async function loadMessages(){

    let data = [];
    let res = await fetch('http://localhost:3000/messages', {'method': 'GET'});
    if (res.ok) {
        data = await res.json();
    }
    data.sort((a, b)=>
    {
        if (parseInt(a.id) < parseInt(b.id))
        {
            return -1;
        } 
        return 1;
    });
    document.getElementById("message_box").innerHTML = '';

    data.forEach(post =>
    {
        createMessage(post.message, post.readstatus, post.id);
    })
    
}

async function setReadstatus()
{
    let messageID = this.parentNode.getAttribute("messageid");

    let data = true;
    let res = await fetch('http://localhost:3000/messages/'+messageID, {'method': 'GET'});
    if (res.ok) {
        data = await res.json();
    }

    jsonData = JSON.stringify({readstatus: !data.readstatus});

    let xhttp = new XMLHttpRequest();
    xhttp.open('PATCH', 'http://localhost:3000/messages/'+messageID, true);
    xhttp.setRequestHeader('Content-type', 'application/json', 'Authorization', 'Bearer <access token>');
    xhttp.send(jsonData);
}

document.getElementById("error-button").onclick = () => 
{
    document.getElementById("error-overlay").style.visibility = "hidden";
};

loadMessages();
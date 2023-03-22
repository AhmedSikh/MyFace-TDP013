document.getElementById("twot").onclick = function newMessage(){
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
    
    //Save as cookie
    const messageID = Date.now().toString();
    document.cookie = messageID + "=false:" + message + "; expires=Thu, 18 Dec 3013 12:00:00 UTC; samesite=strict";

    createMessage(message, false, messageID);
}

function createMessage(message, readstatus, messageID)
{
    const newElement = document.createElement("div");
    newElement.setAttribute("class", "message");
    newElement.setAttribute("messageID", messageID);
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

function loadMessages(){
    const data = document.cookie;
    if(data == 0){return;}

    mappedData = cookieMapper(data);
    let arrayData = new Array;

    for(const [key, value] of mappedData.entries())
    {
        arrayData.push([key,value]);
    }

    arrayData.sort((a, b)=>
    {
        if (parseInt(a[0]) < parseInt(b[0]))
        {
            return -1;
        } 
        return 1;
    });
    
    arrayData.forEach(pair =>
    {
        const msg = pair[1].split(/:(.+)/)[1];
        const readstatus = pair[1].split(":")[0] === "true";
        const messageID = pair[0];
        createMessage(msg, readstatus, messageID);
    })
    
}

function setReadstatus()
{
    let messageID = parseInt(this.parentNode.getAttribute("messageID"));
    let data = cookieMapper(document.cookie);
    
    console.log(messageID);
    console.log(data);
    const message = data.get(messageID).split(/:(.+)/)[1];
    const readstatus = data.get(messageID).split(":")[0];

    if(readstatus == "false")
    {
        document.cookie = messageID + "=true:" + message + "; expires=Thu, 18 Dec 3013 12:00:00 UTC; samesite=strict";
    }
    else
    {
        document.cookie = messageID + "=false:" + message + "; expires=Thu, 18 Dec 3013 12:00:00 UTC; samesite=strict";
    }
}

function cookieMapper(cookie_data)
{
    const data = cookie_data.split(";");

    const cookieMap = new Map();

    data.forEach(cookie=>
        {
            splitCookie = cookie.split("=");
            cookieMap.set(parseInt(splitCookie[0]), splitCookie[1]);
        });
    return cookieMap;
}

document.getElementById("error-button").onclick = () => 
{
    document.getElementById("error-overlay").style.visibility = "hidden";
};

loadMessages();
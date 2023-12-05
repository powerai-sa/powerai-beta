const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {

    const defaultText = `<div class="default-text">
                            <h1>!اهلا بك</h1>
                            <p style="margin-top:7px;">ابدا محادثة و اكتشف قوة الذكاء الاصطناعي</p>
                            <p>محادثاتك محفوظة على الصفحة ولن تختفي مع اعادة التحميل</p>
                            </div>

                            <div class="notify">
        <div class="text-container-n">
            <h1>.يتم مراجعة محادثاتك لغرض تحسين الجودة,  قد تكون بعض الردود غير منطقية و سيتم تحسينها في المستقبل</h1>
        </div>
    </div>`
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage(); //call the function

const createElement = (html, className) => {
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0,
            top_p: 1,
            stop: null
        })
    }
    try{
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch(error){
        pElement.classList.add("error");
        pElement.textContent = ".حدث خطأ ما عند محاولة انشاء الرد, يرجى المحاولة مرة اخرى";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML); //saves on localstorage chat even when reload
}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="pai-icon.png" alt="">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
    </div>
    <ion-icon onclick="copyResponse(this)" class="copybutton" style="color: black;font-size:20px;" title="انقر للنسخ" name="copy-outline"></ion-icon>
</div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if(!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="usericon-s.png" alt="">
        <p></p>
    </div>
</div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    if (confirm("هل انت متأكد من انك تريد حذف المحادثات الحالية؟")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", () => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);

const functionWindow = document.querySelector(".functions");
const defaultSec = document.querySelector(".notify")
const appsButton = document.querySelector("#apps-btn");
const default_txt = document.querySelector(".default-text");

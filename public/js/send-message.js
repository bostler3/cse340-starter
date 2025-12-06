const form = document.querySelector("#sendMessageForm")
form.addEventListener("change", function () {
    const sendBtn = document.querySelector("#sendMessageButton")
    sendBtn.removeAttribute("disabled")
})
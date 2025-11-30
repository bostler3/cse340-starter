const form = document.querySelector("#updateAccountInfoForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("#edit-info-button")
    updateBtn.removeAttribute("disabled")
})

const formTwo = document.querySelector("#updateAccountPasswordForm")
formTwo.addEventListener("change", function () {
    const updateBtnTwo = document.querySelector("#change-password-button")
    updateBtnTwo.removeAttribute("disabled")
})
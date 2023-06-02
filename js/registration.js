const avatar = document.querySelector("#avatar_input")
const nickname = document.querySelector("#nickname_input")
const submit = document.querySelector("#submit_input")

submit.addEventListener('click', () => {
    document.cookie = "nickname=" + nickname.value + "; max-age=9999999";
    window.location = "http://localhost:3000/index.html"
})

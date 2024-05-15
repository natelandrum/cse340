const showHidePassword  = document.querySelector(".password-wrapper img");
const passwordInput = document.querySelector(".password-wrapper input");
const line = document.querySelector(".line");
line.style.visibility = "hidden";

showHidePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    line.style.visibility = "visible";
  } else {
    passwordInput.type = "password";
    line.style.visibility = "hidden";}
});
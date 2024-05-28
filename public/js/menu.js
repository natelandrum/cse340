document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.querySelector("#hamburgerButton");
    const navList = document.querySelector(".menuLinks");

    hamburgerButton.addEventListener("click", () =>
    {
        navList.classList.toggle("open");
        hamburgerButton.classList.toggle("open");
    })
});
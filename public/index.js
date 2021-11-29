/** @format */
console.log("check");

const closeBtn = document.querySelector("#close");
closeBtn.addEventListener("mouseenter", () => {
    console.log("event fire");
    closeBtn.classList.add("open");
});
closeBtn.addEventListener("mouseleave", () => {
    closeBtn.classList.remove("open");
});

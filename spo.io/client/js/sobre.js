document.addEventListener("DOMContentLoaded", function() {
    const headers = document.querySelectorAll(".accordion-header");
    
    headers.forEach(header => {
        header.addEventListener("click", function() {
            const content = this.nextElementSibling;
            const arrow = this.querySelector(".arrow");
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                arrow.style.transform = "rotate(0deg)";
                this.classList.remove("active");
            } else {
                closeAllAccordions();
                content.style.maxHeight = content.scrollHeight + "px";
                arrow.style.transform = "rotate(180deg)";
                this.classList.add("active");
            }
        });
    });
    
    function closeAllAccordions() {
        headers.forEach(header => {
            const content = header.nextElementSibling;
            const arrow = header.querySelector(".arrow");
            content.style.maxHeight = null;
            arrow.style.transform = "rotate(0deg)";
            header.classList.remove("active");
        });
    }
});

const hamburguer = document.querySelector(".hamburguer");
const navMenu = document.querySelector(".nav-menu");

hamburguer.addEventListener("click", () => {
    hamburguer.classList.toggle('active');
    navMenu.classList.toggle('active');
});
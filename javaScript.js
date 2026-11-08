
// Script interactivo para el portafolio de Irma Arias

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-btn");

    // Activar botón del menú al hacer clic
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Cambiar dinámicamente la clase activa del menú según la posición del scroll
    window.addEventListener("scroll", () => {
        let scrollPos = window.scrollY;

        document.querySelectorAll(".content-section, #inicio").forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    });

    console.log("Portafolio oscuro y creativo de Irma Yaneht Arias García cargado con éxito.");
});

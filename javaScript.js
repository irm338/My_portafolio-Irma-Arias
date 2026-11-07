// Script interactivo para el portafolio de Irma Arias

document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos de navegación y secciones
    const navLinks = document.querySelectorAll(".nav-btn");

    // Efecto interactivo al hacer clic en los botones del menú superior
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Cambiar dinámicamente la clase activa del menú según el desplazamiento (Scroll)
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

    console.log("Portafolio de Irma Yaneht Arias García cargado correctamente.");
});

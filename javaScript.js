
// Interacciones del portafolio de Irma Yaneht Arias García

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-ready");

    const navLinks = Array.from(document.querySelectorAll(".nav-btn"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");
    const progressBar = document.querySelector("#reading-progress-bar");
    const backToTop = document.querySelector("#back-to-top");
    const typewriter = document.querySelector("#typewriter-text");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let toastTimer;
    let scrollFrame = false;

    // Abre y cierra el menú de navegación en pantallas pequeñas.
    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
        nav.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación");
        nav.classList.toggle("is-open", !isOpen);
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(item => item.classList.toggle("active", item === link));
            closeMenu();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Actualiza el menú, el avance de lectura y el botón de regreso con un solo evento de scroll.
    const updateScrollState = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        backToTop.classList.toggle("is-visible", window.scrollY > 400);

        let currentSection = "inicio";
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= 160) {
                currentSection = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
        });
        scrollFrame = false;
    };

    window.addEventListener("scroll", () => {
        if (!scrollFrame) {
            window.requestAnimationFrame(updateScrollState);
            scrollFrame = true;
        }
    }, { passive: true });
    updateScrollState();

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    // Rota las especialidades con un efecto de escritura, respetando la preferencia de movimiento.
    if (typewriter && !reduceMotion) {
        const specialties = [
            "Desarrolladora Web Frontend y Backend",
            "Creadora de Experiencias Interactivas",
            "Automatización con n8n"
        ];
        let specialtyIndex = 0;
        let characterIndex = specialties[0].length;
        let deleting = false;

        const typeNextCharacter = () => {
            const specialty = specialties[specialtyIndex];
            characterIndex += deleting ? -1 : 1;
            typewriter.textContent = specialty.slice(0, characterIndex);

            let delay = deleting ? 38 : 65;
            if (!deleting && characterIndex === specialty.length) {
                deleting = true;
                delay = 1500;
            } else if (deleting && characterIndex === 0) {
                deleting = false;
                specialtyIndex = (specialtyIndex + 1) % specialties.length;
                delay = 350;
            }
            window.setTimeout(typeNextCharacter, delay);
        };

        window.setTimeout(typeNextCharacter, 1800);
    }

    // Muestra las secciones al entrar en pantalla.
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("is-visible"));
    }

    // Filtra las tarjetas conservando una breve transición al ocultarlas.
    const filterButtons = document.querySelectorAll(".filter-button");
    const projectCards = document.querySelectorAll(".project-card");
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;
            filterButtons.forEach(filterButton => {
                const isSelected = filterButton === button;
                filterButton.classList.toggle("is-active", isSelected);
                filterButton.setAttribute("aria-pressed", String(isSelected));
            });

            projectCards.forEach(card => {
                const shouldShow = selectedFilter === "todos" || card.dataset.category === selectedFilter;
                window.clearTimeout(card.hideTimer);
                if (shouldShow) {
                    card.hidden = false;
                    card.classList.remove("is-hiding");
                } else if (!card.hidden) {
                    card.classList.add("is-hiding");
                    card.hideTimer = window.setTimeout(() => {
                        card.hidden = true;
                        card.classList.remove("is-hiding");
                    }, reduceMotion ? 0 : 240);
                }
            });
        });
    });

    // Abre el detalle y las tecnologías del proyecto seleccionado.
    const projectDetails = {
        "kid-fit": {
            title: "Proyecto Kid-Fit",
            description: "Aplicación móvil y web interactiva para niños de 5 a 12 años enfocada en promover la actividad física y la hidratación mediante captura de movimiento en tiempo real.",
            technologies: ["React Native", "MediaPipe Pose", "Firebase"]
        },
        campusshop: {
            title: "CampusShop",
            description: "Maquetación estática de plataforma e-commerce.",
            technologies: ["HTML5", "CSS3"]
        },
        campusparking: {
            title: "CampusParking",
            description: "Interfaz para administración de estacionamiento.",
            technologies: ["HTML5", "CSS3", "JavaScript"]
        },
        edutrack: {
            title: "EduTrack",
            description: "Landing page y dashboard educativo.",
            technologies: ["HTML5", "CSS3", "JavaScript"]
        },
        karenflix: {
            title: "KarenFlix - Catálogo",
            description: "Sistema de gestión de base de datos para un catálogo de películas estructurado bajo relaciones 3NF.",
            technologies: ["Node.js", "Express", "ClickUp"]
        },
        fitcorecli: {
            title: "FitCoreCLI-Yani",
            description: "Aplicación modular de consola para la gestión integral de un gimnasio con patrones de repositorio.",
            technologies: ["Node.js", "JavaScript", "CLI"]
        }
    };

    const projectModal = document.querySelector("#project-modal");
    const modalTitle = document.querySelector("#modal-title");
    const modalDescription = document.querySelector("#modal-description");
    const modalTechnologies = document.querySelector("#modal-technologies");
    const modalRepository = document.querySelector("#modal-repository");

    document.querySelectorAll(".project-details").forEach(button => {
        button.addEventListener("click", () => {
            const project = projectDetails[button.dataset.project];
            const card = button.closest(".project-card");
            if (!project || !card) {
                return;
            }

            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalTechnologies.replaceChildren(...project.technologies.map(technology => {
                const badge = document.createElement("span");
                badge.className = "modal-badge";
                badge.textContent = technology;
                return badge;
            }));
            const repositoryLink = card.querySelector("[data-repo-link]");
            modalRepository.href = repositoryLink.href;
            projectModal.showModal();
        });
    });

    const closeModalButton = document.querySelector("#modal-close");
    closeModalButton.addEventListener("click", () => projectModal.close());
    projectModal.addEventListener("click", event => {
        if (event.target === projectModal) {
            projectModal.close();
        }
    });

    // Permite descubrir las descripciones del stack al pasar el cursor o activar una insignia.
    document.querySelectorAll(".tech-badge").forEach(badge => {
        badge.addEventListener("click", () => {
            const willActivate = !badge.classList.contains("is-active");
            document.querySelectorAll(".tech-badge").forEach(item => {
                item.classList.remove("is-active");
                item.setAttribute("aria-expanded", "false");
            });
            badge.classList.toggle("is-active", willActivate);
            badge.setAttribute("aria-expanded", String(willActivate));
        });
    });

    // Añade una inclinación pequeña a las tarjetas de proyectos en dispositivos con puntero.
    if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        projectCards.forEach(card => {
            card.addEventListener("pointermove", event => {
                if (card.hidden) {
                    return;
                }
                const bounds = card.getBoundingClientRect();
                const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
                const rotateX = (0.5 - (event.clientY - bounds.top) / bounds.height) * 5;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            });
            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    // Desplaza apenas los botones al mover el puntero para darles respuesta magnética.
    if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.querySelectorAll(".magnetic-button").forEach(button => {
            button.addEventListener("pointermove", event => {
                const bounds = button.getBoundingClientRect();
                const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.08;
                const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.08;
                button.style.translate = `${offsetX}px ${offsetY}px`;
            });
            button.addEventListener("pointerleave", () => {
                button.style.translate = "";
            });
        });
    }

    // Informa si se pudo copiar el correo y ofrece un respaldo para navegadores compatibles.
    const toast = document.querySelector("#toast");
    const showToast = message => {
        toast.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
    };

    const copyTextWithFallback = text => {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = text;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) {
            throw new Error("El navegador no permitió copiar el correo.");
        }
    };

    document.querySelector("#copy-email").addEventListener("click", async event => {
        const email = event.currentTarget.dataset.email;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
            } else {
                copyTextWithFallback(email);
            }
            showToast("¡Correo copiado al portapapeles!");
        } catch (error) {
            console.error("No se pudo copiar el correo:", error);
            showToast("No se pudo copiar el correo. Puedes seleccionarlo y copiarlo manualmente.");
        }
    });
});

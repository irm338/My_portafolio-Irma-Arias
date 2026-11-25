// Interacciones del portafolio arcade de Irma Yaneht Arias García.
document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const toast = document.querySelector("#toast");
    const menuItems = Array.from(document.querySelectorAll(".arcade-menu__item"));
    let toastTimer;

    // Notifica logros e interacciones importantes.
    const showToast = message => {
        toast.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
    };

    // Dibuja el fondo espacial con partículas y una pista de velocidad.
    const sceneCanvas = document.querySelector("#scene-canvas");
    const sceneContext = sceneCanvas.getContext("2d");
    const particles = [];
    let sceneWidth = 0;
    let sceneHeight = 0;
    let sceneFrame = 0;

    const resizeScene = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        sceneWidth = window.innerWidth;
        sceneHeight = window.innerHeight;
        sceneCanvas.width = Math.floor(sceneWidth * ratio);
        sceneCanvas.height = Math.floor(sceneHeight * ratio);
        sceneContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        particles.length = 0;
        const particleCount = Math.min(90, Math.floor(sceneWidth / 13));
        for (let index = 0; index < particleCount; index += 1) {
            particles.push({
                x: Math.random() * sceneWidth,
                y: Math.random() * sceneHeight,
                radius: Math.random() * 1.7 + 0.4,
                speed: Math.random() * 0.35 + 0.12,
                tint: Math.random() > 0.5 ? "#00f5d4" : "#9b5de5"
            });
        }
    };

    const drawScene = () => {
        sceneContext.clearRect(0, 0, sceneWidth, sceneHeight);
        const horizon = sceneHeight * 0.74;
        const gradient = sceneContext.createLinearGradient(0, horizon, 0, sceneHeight);
        gradient.addColorStop(0, "#111a3200");
        gradient.addColorStop(1, "#101933b3");
        sceneContext.fillStyle = gradient;
        sceneContext.fillRect(0, horizon, sceneWidth, sceneHeight - horizon);

        sceneContext.strokeStyle = "#00f5d41c";
        sceneContext.lineWidth = 1;
        for (let line = -8; line <= 8; line += 1) {
            sceneContext.beginPath();
            sceneContext.moveTo(sceneWidth / 2 + line * 8, horizon);
            sceneContext.lineTo(sceneWidth / 2 + line * sceneWidth * 0.13, sceneHeight);
            sceneContext.stroke();
        }

        const motion = reduceMotion ? 0 : (sceneFrame % 90) / 90;
        for (let line = 0; line < 7; line += 1) {
            const depth = ((line / 7 + motion) % 1);
            const y = horizon + depth * depth * (sceneHeight - horizon);
            sceneContext.strokeStyle = `rgba(0, 245, 212, ${0.08 + depth * 0.15})`;
            sceneContext.beginPath();
            sceneContext.moveTo(sceneWidth / 2 - depth * sceneWidth * 0.55, y);
            sceneContext.lineTo(sceneWidth / 2 + depth * sceneWidth * 0.55, y);
            sceneContext.stroke();
        }

        particles.forEach(particle => {
            sceneContext.globalAlpha = 0.35 + Math.sin(sceneFrame * 0.02 + particle.x) * 0.22;
            sceneContext.fillStyle = particle.tint;
            sceneContext.beginPath();
            sceneContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            sceneContext.fill();
            if (!reduceMotion) {
                particle.y -= particle.speed;
                if (particle.y < -4) {
                    particle.y = sceneHeight + 4;
                    particle.x = Math.random() * sceneWidth;
                }
            }
        });
        sceneContext.globalAlpha = 1;
        sceneFrame += 1;
        if (!reduceMotion) {
            window.requestAnimationFrame(drawScene);
        }
    };
    resizeScene();
    drawScene();
    window.addEventListener("resize", resizeScene, { passive: true });

    // Lleva la cuenta de las secciones visitadas y entrega experiencia una sola vez.
    let experience = 0;
    const visitedSections = new Set();
    const xpFill = document.querySelector("#xp-fill");
    const xpLabel = document.querySelector("#xp-label");
    const playerLevel = document.querySelector("#player-level");
    const awardExperience = section => {
        if (visitedSections.has(section.id)) {
            return;
        }
        visitedSections.add(section.id);
        experience += 100;
        const nextLevelXp = experience % 500;
        xpFill.style.width = `${nextLevelXp / 5}%`;
        xpLabel.textContent = `${nextLevelXp} / 500 XP`;
        playerLevel.textContent = `LVL ${18 + Math.floor(experience / 500)}`;
        if (section.id !== "inicio") {
            showToast(`+100 XP · ${section.querySelector("h2")?.textContent || "SECCIÓN EXPLORADA"}`);
        }
    };

    const xpSections = document.querySelectorAll("[data-xp]");
    if ("IntersectionObserver" in window) {
        const xpObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    awardExperience(entry.target);
                }
            });
        }, { threshold: 0.35 });
        xpSections.forEach(section => xpObserver.observe(section));
    } else {
        xpSections.forEach(awardExperience);
    }

    // Mantiene el avance de lectura y resalta la misión más cercana.
    const progressBar = document.querySelector("#reading-progress-bar");
    let scrollPending = false;
    const updateScrollState = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        scrollPending = false;
    };
    window.addEventListener("scroll", () => {
        if (!scrollPending) {
            window.requestAnimationFrame(updateScrollState);
            scrollPending = true;
        }
    }, { passive: true });
    updateScrollState();

    // Escribe las especialidades de forma animada, salvo si el usuario reduce el movimiento.
    const typewriter = document.querySelector("#typewriter-text");
    const specialties = [
        "Desarrolladora Web Frontend y Backend",
        "Creadora de experiencias interactivas",
        "Exploradora de automatizaciones con n8n"
    ];
    if (typewriter && !reduceMotion) {
        let phraseIndex = 0;
        let characterIndex = specialties[0].length;
        let deleting = false;
        const writeNextCharacter = () => {
            const phrase = specialties[phraseIndex];
            characterIndex += deleting ? -1 : 1;
            typewriter.textContent = phrase.slice(0, characterIndex);
            let delay = deleting ? 34 : 58;
            if (!deleting && characterIndex === phrase.length) {
                deleting = true;
                delay = 1450;
            } else if (deleting && characterIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % specialties.length;
                delay = 300;
            }
            window.setTimeout(writeNextCharacter, delay);
        };
        window.setTimeout(writeNextCharacter, 1800);
    }

    // Permite elegir las opciones del menú principal con las flechas y Enter.
    let selectedMenuIndex = -1;
    document.addEventListener("keydown", event => {
        const activeElement = document.activeElement;
        const isTyping = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
        if (event.key === "Escape") {
            document.querySelector("#project-modal").close();
            return;
        }
        if (isTyping || document.querySelector("#project-modal").open || !["ArrowDown", "ArrowUp"].includes(event.key)) {
            return;
        }
        const focusedIndex = menuItems.indexOf(activeElement);
        selectedMenuIndex = focusedIndex >= 0 ? focusedIndex : selectedMenuIndex;
        selectedMenuIndex = event.key === "ArrowDown"
            ? (selectedMenuIndex + 1) % menuItems.length
            : (selectedMenuIndex <= 0 ? menuItems.length - 1 : selectedMenuIndex - 1);
        event.preventDefault();
        menuItems.forEach((item, index) => item.classList.toggle("is-selected", index === selectedMenuIndex));
        menuItems[selectedMenuIndex].focus();
    });

    menuItems.forEach((item, index) => {
        item.addEventListener("focus", () => {
            selectedMenuIndex = index;
            menuItems.forEach((menuItem, menuIndex) => menuItem.classList.toggle("is-selected", menuIndex === index));
        });
    });

    // Reproduce ritmos generados con osciladores de Web Audio, sin archivos externos.
    const tracks = [
        { name: "Beat Urbano", tempo: 104, wave: "sawtooth", notes: [55, 62, 67, 62, 58, 65, 70, 65] },
        { name: "Synthwave", tempo: 118, wave: "triangle", notes: [57, 64, 69, 73, 52, 59, 64, 68] },
        { name: "Ritmo Dance", tempo: 126, wave: "square", notes: [60, 67, 72, 67, 55, 62, 67, 74] }
    ];
    const musicPlayer = document.querySelector(".music-player");
    const trackName = document.querySelector("#track-name");
    const playButton = document.querySelector("#music-play");
    const nextButton = document.querySelector("#music-next");
    const muteButton = document.querySelector("#music-mute");
    const equalizer = document.querySelector("#equalizer");
    const audioBars = 12;
    for (let bar = 0; bar < audioBars; bar += 1) {
        equalizer.appendChild(document.createElement("i"));
    }

    let audioContext;
    let masterGain;
    let trackIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let beatIndex = 0;
    let nextBeatTime = 0;
    let schedulerTimer;

    const createAudio = async () => {
        if (!audioContext) {
            const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextConstructor) {
                throw new Error("Este navegador no admite audio web.");
            }
            audioContext = new AudioContextConstructor();
            masterGain = audioContext.createGain();
            masterGain.gain.value = isMuted ? 0 : 0.2;
            masterGain.connect(audioContext.destination);
        }
        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }
    };

    const playNote = (frequency, startTime, duration, waveform, volume) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = waveform;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        oscillator.connect(gain);
        gain.connect(masterGain);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.02);
    };

    const playKick = startTime => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(110, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(45, startTime + 0.12);
        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.14);
        oscillator.connect(gain);
        gain.connect(masterGain);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
    };

    const playNoise = startTime => {
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.08, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let index = 0; index < data.length; index += 1) {
            data[index] = Math.random() * 2 - 1;
        }
        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();
        filter.type = "highpass";
        filter.frequency.value = 6500;
        gain.gain.setValueAtTime(0.11, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.07);
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        source.start(startTime);
        source.stop(startTime + 0.08);
    };

    const scheduleBeat = () => {
        const track = tracks[trackIndex];
        const beatDuration = 60 / track.tempo / 2;
        while (nextBeatTime < audioContext.currentTime + 0.12) {
            const step = beatIndex % 16;
            if (step % 4 === 0) {
                playKick(nextBeatTime);
            }
            if (step % 2 === 1) {
                playNoise(nextBeatTime);
            }
            if (step % 4 === 0 || step === 6 || step === 10) {
                const note = track.notes[(beatIndex >> 1) % track.notes.length];
                playNote(440 * Math.pow(2, (note - 69) / 12), nextBeatTime, beatDuration * 1.8, track.wave, 0.075);
                playNote(440 * Math.pow(2, (note - 24 - 69) / 12), nextBeatTime, beatDuration * 1.9, "triangle", 0.2);
            }
            beatIndex += 1;
            nextBeatTime += beatDuration;
        }
    };

    const updateMusicControls = () => {
        playButton.textContent = isPlaying ? "Ⅱ" : "▶";
        playButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
        musicPlayer.classList.toggle("is-playing", isPlaying);
        equalizer.classList.toggle("is-playing", isPlaying);
        trackName.textContent = tracks[trackIndex].name;
    };

    const startMusic = async () => {
        try {
            await createAudio();
            isPlaying = true;
            beatIndex = 0;
            nextBeatTime = audioContext.currentTime + 0.05;
            window.clearInterval(schedulerTimer);
            schedulerTimer = window.setInterval(scheduleBeat, 25);
            updateMusicControls();
        } catch (error) {
            console.error("No se pudo iniciar el reproductor:", error);
            showToast("Tu navegador no pudo iniciar el reproductor musical.");
        }
    };

    playButton.addEventListener("click", () => {
        if (isPlaying) {
            isPlaying = false;
            window.clearInterval(schedulerTimer);
            updateMusicControls();
        } else {
            startMusic();
        }
    });

    nextButton.addEventListener("click", () => {
        trackIndex = (trackIndex + 1) % tracks.length;
        updateMusicControls();
        if (isPlaying) {
            startMusic();
        }
    });

    muteButton.addEventListener("click", async () => {
        isMuted = !isMuted;
        muteButton.setAttribute("aria-pressed", String(isMuted));
        muteButton.setAttribute("aria-label", isMuted ? "Activar sonido" : "Silenciar música");
        muteButton.textContent = isMuted ? "×" : "◖";
        if (audioContext) {
            masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.2, audioContext.currentTime, 0.04);
        }
    });
    updateMusicControls();

    // Filtra las misiones por categoría y marca el filtro activo.
    const projectCards = Array.from(document.querySelectorAll(".mission-card"));
    document.querySelectorAll(".filter-button").forEach(button => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;
            document.querySelectorAll(".filter-button").forEach(filterButton => {
                const selected = filterButton === button;
                filterButton.classList.toggle("is-active", selected);
                filterButton.setAttribute("aria-pressed", String(selected));
            });
            projectCards.forEach(card => {
                const shouldShow = selectedFilter === "todos" || card.dataset.category === selectedFilter;
                card.hidden = !shouldShow;
                card.classList.remove("is-hiding");
            });
        });
    });

    // Muestra fichas de misión con sus detalles y enlaces de repositorio.
    const projectDetails = {
        "kid-fit": {
            title: "Kid-Fit",
            description: "Aplicación móvil y web interactiva para niños de 5 a 12 años enfocada en promover la actividad física y la hidratación mediante captura de movimiento en tiempo real.",
            technologies: ["React Native", "MediaPipe Pose", "Firebase"],
            repository: "https://github.com/irm338"
        },
        campusshop: {
            title: "CampusShop",
            description: "Maquetación estática de plataforma e-commerce.",
            technologies: ["HTML5", "CSS3"],
            repository: "https://github.com/irm338"
        },
        campusparking: {
            title: "CampusParking",
            description: "Interfaz para administración de estacionamiento.",
            technologies: ["HTML5", "CSS3", "JavaScript"],
            repository: "https://github.com/irm338"
        },
        edutrack: {
            title: "EduTrack",
            description: "Landing page y dashboard educativo.",
            technologies: ["HTML5", "CSS3", "JavaScript"],
            repository: "https://github.com/irm338"
        },
        karenflix: {
            title: "KarenFlix - Catálogo",
            description: "Sistema de gestión de base de datos para un catálogo de películas estructurado bajo relaciones 3NF.",
            technologies: ["Node.js", "Express", "ClickUp"],
            repository: "https://github.com/irm338/karen-flix"
        },
        fitcorecli: {
            title: "FitCoreCLI-Yani",
            description: "Aplicación modular de consola para la gestión integral de un gimnasio con patrones de repositorio.",
            technologies: ["Node.js", "JavaScript", "CLI"],
            repository: "https://github.com/irm338"
        }
    };

    const projectModal = document.querySelector("#project-modal");
    const modalTitle = document.querySelector("#modal-title");
    const modalDescription = document.querySelector("#modal-description");
    const modalTechnologies = document.querySelector("#modal-technologies");
    const modalRepository = document.querySelector("#modal-repository");
    document.querySelectorAll(".mission-open").forEach(button => {
        button.addEventListener("click", () => {
            const project = projectDetails[button.dataset.project];
            if (!project) {
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
            modalRepository.href = project.repository;
            projectModal.showModal();
        });
    });
    document.querySelector("#modal-close").addEventListener("click", () => projectModal.close());
    projectModal.addEventListener("click", event => {
        if (event.target === projectModal) {
            projectModal.close();
        }
    });

    // Inclina las tarjetas y botones para responder al movimiento del puntero.
    if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        projectCards.forEach(card => {
            card.addEventListener("pointermove", event => {
                if (card.hidden) {
                    return;
                }
                const bounds = card.getBoundingClientRect();
                const tiltX = (0.5 - (event.clientY - bounds.top) / bounds.height) * 5;
                const tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
                card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px)`;
            });
            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    // Presenta la descripción de cada tecnología en el panel de arsenal.
    const techReadout = document.querySelector("#tech-readout");
    document.querySelectorAll(".tech-badge").forEach(badge => {
        badge.addEventListener("click", () => {
            const willActivate = !badge.classList.contains("is-active");
            document.querySelectorAll(".tech-badge").forEach(item => {
                item.classList.remove("is-active");
                item.setAttribute("aria-expanded", "false");
            });
            badge.classList.toggle("is-active", willActivate);
            badge.setAttribute("aria-expanded", String(willActivate));
            techReadout.textContent = willActivate
                ? `${badge.textContent.toUpperCase()} · ${badge.dataset.description}`
                : "ELIGE UNA TECNOLOGÍA PARA VER SUS DATOS.";
        });
    });

    // Acelera la moto mientras el botón permanece presionado.
    const bikeButton = document.querySelector("#bike-accelerate");
    const bikeRpm = document.querySelector("#bike-rpm");
    const bikeSpeed = document.querySelector("#bike-speed");
    const rpmFill = document.querySelector("#rpm-fill");
    let rpm = 1200;
    let throttleTimer;
    const accelerate = () => {
        rpm = Math.min(9500, rpm + 460);
        bikeRpm.textContent = String(rpm);
        bikeSpeed.textContent = String(Math.min(280, Math.floor((rpm - 1200) / 31)));
        rpmFill.style.width = `${((rpm - 1200) / 8300) * 100}%`;
    };
    const releaseThrottle = () => {
        window.clearInterval(throttleTimer);
        throttleTimer = undefined;
    };
    bikeButton.addEventListener("pointerdown", event => {
        event.preventDefault();
        accelerate();
        releaseThrottle();
        throttleTimer = window.setInterval(accelerate, 180);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(eventName => {
        bikeButton.addEventListener(eventName, releaseThrottle);
    });
    bikeButton.addEventListener("keydown", event => {
        if (event.key === " " || event.key === "Enter") {
            accelerate();
        }
    });

    // Enciende el nitro y reproduce una breve secuencia visual.
    const carCard = document.querySelector("#car-card");
    const turboButton = document.querySelector("#turbo-button");
    const turboFill = document.querySelector("#turbo-gauge-fill");
    const turboLabel = document.querySelector("#turbo-label");
    turboButton.addEventListener("click", () => {
        carCard.classList.add("is-turbo");
        turboFill.style.transform = "scaleX(1)";
        turboLabel.textContent = "¡NITRO ACTIVADO!";
        window.setTimeout(() => {
            carCard.classList.remove("is-turbo");
            turboFill.style.transform = "scaleX(0.15)";
            turboLabel.textContent = "NITRO LISTO";
        }, 1200);
    });

    // Anima los tiros a gol y actualiza el marcador.
    let goals = 0;
    const goalButton = document.querySelector("#goal-button");
    const goalMessage = document.querySelector("#goal-message");
    goalButton.addEventListener("click", () => {
        goals += 1;
        document.querySelector("#goal-count").textContent = String(goals);
        goalMessage.textContent = goals % 3 === 0 ? "¡GOLAZO!" : "¡GOOOL!";
        goalButton.classList.remove("is-kicking");
        void goalButton.offsetWidth;
        goalButton.classList.add("is-kicking");
        window.setTimeout(() => goalButton.classList.remove("is-kicking"), 450);
    });

    // Enciende la pista de baile durante una breve secuencia de destellos.
    const danceCard = document.querySelector("#dance-card");
    document.querySelector("#dance-button").addEventListener("click", () => {
        danceCard.classList.add("is-dancing");
        window.setTimeout(() => danceCard.classList.remove("is-dancing"), 1300);
    });

    // Responde a comandos seguros predefinidos en la terminal de perfil.
    const terminalForm = document.querySelector("#terminal-form");
    const terminalInput = document.querySelector("#terminal-input");
    const terminalOutput = document.querySelector("#terminal-output");
    const terminalCommands = {
        ayuda: "Comandos: perfil, stack, misiones, contacto.",
        perfil: "Irma Yaneht Arias García · desarrolladora de software en formación en Campuslands.",
        stack: "HTML5 · CSS3 · JavaScript · Node.js · Express · PostgreSQL · Git · GitHub · n8n.",
        misiones: "Kid-Fit · CampusShop · CampusParking · EduTrack · KarenFlix.",
        contacto: "yanehtarias12@gmail.com · github.com/irm338."
    };
    terminalForm.addEventListener("submit", event => {
        event.preventDefault();
        const command = terminalInput.value.trim().toLowerCase();
        if (!command) {
            return;
        }
        const response = terminalCommands[command] || "Comando no encontrado. Escribe ayuda para ver las opciones.";
        terminalOutput.replaceChildren();
        [`> ${command}`, `> ${response}`].forEach(line => {
            const outputLine = document.createElement("span");
            outputLine.textContent = line;
            terminalOutput.appendChild(outputLine);
        });
        terminalInput.value = "";
    });

    // Conserva el récord personal del minijuego en el navegador.
    const highScoreLabel = document.querySelector("#high-score");
    const gameScoreLabel = document.querySelector("#game-score");
    const gameStatus = document.querySelector("#game-status");
    const gameCanvas = document.querySelector("#game-canvas");
    const gameContext = gameCanvas.getContext("2d");
    const gameOverlay = document.querySelector("#game-overlay");
    let highScore = 0;
    try {
        highScore = Number(window.localStorage.getItem("yaniTurboRunHighScore")) || 0;
    } catch (error) {
        console.warn("El navegador no permitió leer el récord guardado.", error);
    }
    highScoreLabel.textContent = String(highScore).padStart(4, "0");

    let gameRunning = false;
    let gameFrame;
    let gameScore = 0;
    let gameSpeed = 3;
    let gameTick = 0;
    let playerX = 0.5;
    const gameItems = [];
    const gameKeys = new Set();
    const collectibles = ["{ }", "⚽", "♫"];

    const drawGameScene = () => {
        const width = gameCanvas.width;
        const height = gameCanvas.height;
        gameContext.clearRect(0, 0, width, height);
        gameContext.fillStyle = "#080d1c";
        gameContext.fillRect(0, 0, width, height);
        const horizon = height * 0.38;
        gameContext.fillStyle = "#101933";
        gameContext.beginPath();
        gameContext.moveTo(width * 0.38, horizon);
        gameContext.lineTo(width * 0.62, horizon);
        gameContext.lineTo(width * 0.98, height);
        gameContext.lineTo(width * 0.02, height);
        gameContext.closePath();
        gameContext.fill();

        gameContext.strokeStyle = "#00f5d46b";
        gameContext.lineWidth = 3;
        gameContext.beginPath();
        gameContext.moveTo(width * 0.38, horizon);
        gameContext.lineTo(width * 0.02, height);
        gameContext.moveTo(width * 0.62, horizon);
        gameContext.lineTo(width * 0.98, height);
        gameContext.stroke();

        for (let marker = 0; marker < 8; marker += 1) {
            const depth = ((marker / 8 + gameTick * 0.003) % 1);
            const y = horizon + depth * depth * (height - horizon);
            gameContext.strokeStyle = "#ffffff36";
            gameContext.lineWidth = Math.max(1, depth * 4);
            gameContext.beginPath();
            gameContext.moveTo(width * 0.5 - depth * width * 0.46, y);
            gameContext.lineTo(width * 0.5 + depth * width * 0.46, y);
            gameContext.stroke();
        }

        if (gameRunning) {
            if (gameKeys.has("ArrowLeft") || gameKeys.has("a")) {
                playerX = Math.max(0.1, playerX - 0.012);
            }
            if (gameKeys.has("ArrowRight") || gameKeys.has("d")) {
                playerX = Math.min(0.9, playerX + 0.012);
            }
            gameTick += 1;
            if (gameTick % Math.max(24, Math.floor(72 - gameSpeed * 4)) === 0) {
                const obstacle = Math.random() < 0.38;
                gameItems.push({
                    x: 0.12 + Math.random() * 0.76,
                    y: horizon,
                    collectible: !obstacle,
                    icon: collectibles[Math.floor(Math.random() * collectibles.length)]
                });
            }
            gameItems.forEach(item => {
                item.y += gameSpeed + (item.y / height) * 5;
                const itemX = width * (0.5 + (item.x - 0.5) * (item.y / height + 0.45));
                const itemSize = 12 + item.y / height * 16;
                gameContext.fillStyle = item.collectible ? "#fee440" : "#ff2a85";
                gameContext.shadowColor = item.collectible ? "#fee440" : "#ff2a85";
                gameContext.shadowBlur = 12;
                gameContext.font = `bold ${itemSize}px monospace`;
                gameContext.textAlign = "center";
                gameContext.fillText(item.collectible ? item.icon : "■", itemX, item.y);
                gameContext.shadowBlur = 0;
                const playerScreenX = width * (0.5 + (playerX - 0.5) * 1.35);
                if (item.y > height * 0.8 && item.y < height * 0.94 && Math.abs(itemX - playerScreenX) < 34) {
                    if (item.collectible) {
                        gameScore += 10;
                        gameScoreLabel.textContent = String(gameScore).padStart(4, "0");
                    } else {
                        endGame();
                    }
                    item.y = height + 100;
                }
            });
            for (let index = gameItems.length - 1; index >= 0; index -= 1) {
                if (gameItems[index].y > height + 30) {
                    gameItems.splice(index, 1);
                }
            }
        }

        const carX = width * (0.5 + (playerX - 0.5) * 1.35);
        const carY = height * 0.85;
        gameContext.fillStyle = "#00f5d4";
        gameContext.shadowColor = "#00f5d4";
        gameContext.shadowBlur = 20;
        gameContext.beginPath();
        gameContext.moveTo(carX, carY - 25);
        gameContext.lineTo(carX + 22, carY + 18);
        gameContext.lineTo(carX - 22, carY + 18);
        gameContext.closePath();
        gameContext.fill();
        gameContext.shadowBlur = 0;

        if (gameRunning) {
            gameFrame = window.requestAnimationFrame(drawGameScene);
        }
    };

    const endGame = () => {
        if (!gameRunning) {
            return;
        }
        gameRunning = false;
        window.cancelAnimationFrame(gameFrame);
        gameStatus.textContent = "FIN DE LA CARRERA";
        gameOverlay.classList.remove("is-hidden");
        gameOverlay.querySelector("p").textContent = `PUNTAJE FINAL: ${String(gameScore).padStart(4, "0")}`;
        gameOverlay.querySelector("h3").textContent = "¡INTENTA SUPERAR TU RÉCORD!";
        gameOverlay.querySelector("#game-start").textContent = "↻ VOLVER A JUGAR";
        if (gameScore > highScore) {
            highScore = gameScore;
            highScoreLabel.textContent = String(highScore).padStart(4, "0");
            try {
                window.localStorage.setItem("yaniTurboRunHighScore", String(highScore));
            } catch (error) {
                console.warn("El navegador no permitió guardar el récord.", error);
            }
            showToast("¡Nuevo récord desbloqueado!");
        }
        drawGameScene();
    };

    const startGame = () => {
        window.cancelAnimationFrame(gameFrame);
        gameRunning = true;
        gameScore = 0;
        gameSpeed = 3;
        gameTick = 0;
        playerX = 0.5;
        gameItems.length = 0;
        gameScoreLabel.textContent = "0000";
        gameStatus.textContent = "¡EN CARRERA!";
        gameOverlay.classList.add("is-hidden");
        drawGameScene();
    };
    document.querySelector("#game-start").addEventListener("click", startGame);
    drawGameScene();

    document.addEventListener("keydown", event => {
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            gameKeys.add(event.key);
        }
        if (event.key.toLowerCase() === "a" || event.key.toLowerCase() === "d") {
            gameKeys.add(event.key.toLowerCase());
        }
    });
    document.addEventListener("keyup", event => {
        gameKeys.delete(event.key);
        gameKeys.delete(event.key.toLowerCase());
    });
    document.querySelectorAll("[data-game-direction]").forEach(button => {
        const direction = button.dataset.gameDirection === "left" ? "ArrowLeft" : "ArrowRight";
        button.addEventListener("pointerdown", event => {
            event.preventDefault();
            gameKeys.add(direction);
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach(eventName => {
            button.addEventListener(eventName, () => gameKeys.delete(direction));
        });
    });

    // Copia el correo y anuncia el logro con un mensaje visible.
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
            showToast("¡Logro desbloqueado: Correo copiado!");
        } catch (error) {
            console.error("No se pudo copiar el correo:", error);
            showToast("No se pudo copiar. Selecciona el correo y cópialo manualmente.");
        }
    });
});

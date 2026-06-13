document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar with Glass Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass-navbar', 'py-2');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('glass-navbar', 'py-2');
            navbar.classList.add('py-4');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const menuIcon = mobileMenuBtn.querySelector('i');

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times', 'text-white');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times', 'text-white');
            document.body.style.overflow = 'auto';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // --- Active Link Switching on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active', 'text-blue-400');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active', 'text-blue-400');
            }
        });
    });

    // --- Typing Effect ---
    const typingText = document.querySelector('.typing-text');
    const words = [
        "Computer Science Engineer", 
        "AI Developer", 
        "Web Developer",
        "Problem Solver"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRun() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeRun, typeSpeed);
    }
    
    // Start typing effect
    if(typingText) setTimeout(typeRun, 1000);


    // --- Scroll Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class for general reveals
                entry.target.classList.add('active');
                
                // Animate skill bars specifically if they are part of the target or inside it
                if (entry.target.id === 'resume' || entry.target.contains(document.querySelector('.skill-progress'))) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Set Current Year in Footer ---
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // --- Backend Integration ---
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isDevelopment 
        ? 'http://localhost:5000/api' 
        : 'https://newportfolio-ds4r.onrender.com/api';

    // Fetch and render projects
    async function fetchProjects() {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;
        
        try {
            const res = await fetch(`${API_URL}/projects`);
            if (!res.ok) throw new Error('Failed to load projects');
            
            const projects = await res.json();
            
            if (projects.length === 0) {
                projectsContainer.innerHTML = '<p class="text-gray-400">No featured projects found.</p>';
                return;
            }
            
            let projectsHTML = '';
            
            projects.forEach((proj, index) => {
                const color = proj.colorTheme || 'blue';
                const colorValue = color === 'purple' ? 'purple' : (color === 'indigo' ? 'indigo' : 'blue');
                const hoverColorHex = colorValue === 'purple' ? '168,85,247' : (colorValue === 'indigo' ? '99,102,241' : '59,130,246');
                const revealClass = index % 2 === 0 ? 'reveal-left' : 'reveal-right';
                
                let tagsHTML = '';
                if (proj.techStack && proj.techStack.length > 0) {
                    proj.techStack.forEach(tech => {
                        tagsHTML += `<span class="px-3 py-1 bg-${colorValue}-500/10 text-${colorValue}-300 border border-${colorValue}-500/20 rounded-full text-xs">${tech}</span> `;
                    });
                }

                projectsHTML += `
                <div class="group glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-${colorValue}-500/50 transition-all duration-500 ${revealClass} hover:shadow-[0_0_30px_rgba(${hoverColorHex},0.15)] flex flex-col h-full active">
                    <div class="relative h-60 w-full bg-gradient-to-br from-${colorValue}-900/50 to-${colorValue === 'blue' ? 'indigo' : 'pink'}-900/50 flex items-center justify-center overflow-hidden">
                        <div class="absolute inset-0 bg-[#0f1115]/40 group-hover:bg-transparent transition-all z-10"></div>
                        <i class="${proj.iconClass} text-6xl text-${colorValue}-400/50 group-hover:scale-110 group-hover:text-${colorValue}-400 transition-all duration-500 z-0"></i>
                        <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-30"></div>
                    </div>
                    
                    <div class="p-8 flex flex-col flex-grow">
                        <h3 class="text-2xl font-bold font-outfit text-white mb-3 group-hover:text-${colorValue}-400 transition-colors">${proj.title}</h3>
                        <p class="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                            ${proj.description}
                        </p>
                        
                        <div class="pt-4 border-t border-white/10">
                            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tech Stack</h4>
                            <div class="flex flex-wrap gap-2">
                                ${tagsHTML}
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });
            
            projectsContainer.innerHTML = projectsHTML;
        } catch (error) {
            console.error(error);
            projectsContainer.innerHTML = '<p class="text-red-400">Failed to load projects. Please ensure the backend server is running.</p>';
        }
    }

    // Call fetchProjects immediately
    fetchProjects();

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                alert('Please fill out all fields.');
                return;
            }

            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>';
            submitBtn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const data = await res.json();
                
                if (res.ok) {
                    alert(data.message || 'Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert(data.error || 'Failed to send message.');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred. Make sure the backend server is running.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

});

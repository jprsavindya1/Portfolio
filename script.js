document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       STICKY HEADER SCROLL STATE
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
            });
        });
    }

    /* ==========================================================================
       TYPEWRITER EFFECT (HERO SUBTITLE)
       ========================================================================== */
    const textElement = document.getElementById('typing-text');
    const phrases = [
        'Software Engineering Student',
        'Full-Stack Developer',
        'Laravel & React Developer',
        'Creative Problem Solver'
    ];
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Delete text
            textElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            // Add text
            textElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 100; // normal speed
        }

        // State changes
        if (!isDeleting && characterIndex === currentPhrase.length) {
            // End of phrase reached, pause before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && characterIndex === 0) {
            // Deleted all characters, shift to next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // brief pause before writing next
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (textElement) {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       ACTIVE NAV LINK HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for nav header height
            const sectionId = current.getAttribute('id');
            const targetLink = document.getElementById(`link-${sectionId}`);
            
            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveLink);

    /* ==========================================================================
       PROJECT DETAIL MODALS (POPUPS)
       ========================================================================== */
    const triggers = document.querySelectorAll('.btn-detail-trigger');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const backdrops = document.querySelectorAll('.modal-backdrop');

    // Open Modal
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                targetModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Disable background scrolling
            }
        });
    });

    // Close Modal helper
    function closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable background scrolling
    }

    // Close on Click X button
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Close on Backdrop Click
    backdrops.forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    // Modal Tab Switching Logic
    const tabButtons = document.querySelectorAll('.modal-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabContainer = btn.closest('.modal-body');
            if (!tabContainer) return;
            
            const targetTabId = btn.getAttribute('data-tab');
            const targetContent = tabContainer.querySelector(`#${targetTabId}`);
            if (!targetContent) return;
            
            // Deactivate all tab buttons & contents in this modal
            tabContainer.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            tabContainer.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
            
            // Activate target
            btn.classList.add('active');
            targetContent.classList.add('active');
            
            // Scroll to top of modal-body on tab change
            tabContainer.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION FEEDBACK
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('btn-send-message');

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            // Set sending state
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
            
            formStatus.className = 'form-status-message';
            formStatus.textContent = '';
            
            // Send form data via Web3Forms API
            const formData = new FormData(contactForm);
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Success message
                    formStatus.className = 'form-status-message status-success';
                    formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                } else {
                    // Error message
                    formStatus.className = 'form-status-message status-error';
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${json.message || 'Something went wrong.'}`;
                }
            })
            .catch(error => {
                formStatus.className = 'form-status-message status-error';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Error sending message. Please try again later.';
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.querySelector('span').textContent = 'Send Message';
                submitBtn.querySelector('i').className = 'fa-regular fa-paper-plane';
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status-message';
                }, 5000);
            });
        });
    }

    /* ==========================================================================
       SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a card container with progress bars inside, animate them
                const bars = entry.target.querySelectorAll('.skill-progress.animate-progress');
                bars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-progress');
                    bar.style.width = targetWidth;
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       MOUSE SPOTLIGHT HOVER EFFECT
       ========================================================================== */
    const spotlightCards = document.querySelectorAll('.skill-category-card, .project-card, .stat-card, .contact-card, .about-image-container');
    
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', `-999px`);
            card.style.setProperty('--mouse-y', `-999px`);
        });
    });

    /* ==========================================================================
       SCROLL TO TOP BUTTON
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       FORM REAL-TIME VALIDATION INDICATORS
       ========================================================================== */
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            input.classList.add('touched');
        });
        
        input.addEventListener('input', () => {
            if (input.value === '') {
                input.classList.remove('touched');
            }
        });
    });

});

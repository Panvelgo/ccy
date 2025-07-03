// js/script.js - Main JavaScript file for global functionalities

document.addEventListener('DOMContentLoaded', function() {

    /**
     * Loads HTML content from a specified file into a placeholder element.
     * @param {string} placeholderId - The ID of the HTML element where the content will be injected.
     * @param {string} filePath - The path to the HTML file to load.
     */
    async function loadContent(placeholderId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = html;

                // Specific setup after navbar is loaded
                if (placeholderId === 'navbar-placeholder') {
                    setupNavbarInteractions();
                }
            } else {
                console.warn(`Placeholder with ID '${placeholderId}' not found.`);
            }
        } catch (error) {
            console.error(`Failed to load ${filePath}:`, error);
            // Optionally, display a user-friendly fallback message
        }
    }

    /**
     * Sets up the hamburger menu toggle and highlights the active navigation link.
     * This function should be called ONLY after the navbar HTML has been loaded into the DOM.
     */
    function setupNavbarInteractions() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navBar = document.querySelector('.nav-bar');

        if (hamburgerMenu && navBar) {
            hamburgerMenu.addEventListener('click', () => {
                navBar.classList.toggle('active');
            });
        } else {
            console.error('Hamburger menu or nav bar elements not found for interaction setup.');
        }

        // Highlight active link based on current page
        const currentPath = window.location.pathname.split('/').pop(); // Get current page filename (e.g., 'donation.html')
        const navLinks = navBar.querySelectorAll('ul li a'); // Select all <a> tags within the nav list

        navLinks.forEach(link => {
            // Remove 'active' class from all links first to ensure only one is highlighted
            link.classList.remove('active');

            // Check if the link's href matches the current page's filename
            // Handle 'index.html' case for the root path ('')
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
                link.classList.add('active'); // Add 'active' class directly to the <a> tag
            }
        });
    }

    // --- Core Page Load Operations ---
    // Load navbar and footer components when the DOM is fully ready
    loadContent('navbar-placeholder', 'navbar.html');
    loadContent('footer-placeholder', 'footer.html'); // Assuming you have a footer.html and footer-placeholder


    // --- Global Utility Functions ---

    /**
     * Copies text from a specified HTML element to the clipboard.
     * Displays a temporary notification on success.
     * This function is made global so it can be called directly from inline `onclick` attributes.
     * @param {string} elementId - The ID of the element whose innerText content should be copied.
     */
    window.copyToClipboard = function(elementId) {
        const textToCopy = document.getElementById(elementId).innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const notification = document.getElementById('copy-notification');
            if (notification) {
                notification.classList.add('show');
                // Hide the notification after 2 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy text:', err);
            // Fallback for older browsers or if permissions are denied
            alert('Could not copy text. Please manually copy: ' + textToCopy);
        });
    };


    // --- Home Page Specific Scripting (Conditionally Executed) ---

    // Image Carousel for Home Hero Section
    const slides = document.querySelectorAll('.home-hero .slide');
    const prevButton = document.querySelector('.home-hero .prev-slide');
    const nextButton = document.querySelector('.home-hero .next-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    if (slides.length > 0 && prevButton && nextButton) { // Only run if hero slides and buttons exist
        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        });

        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        });

        // Auto-advance slides
        setInterval(() => {
            currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        }, 5000); // Change slide every 5 seconds

        showSlide(currentSlide); // Initialize the first slide on load
    }


    // --- FAQ Accordion (Conditionally Executed) ---

    const faqQuestions = document.querySelectorAll('.faq-question');

    if (faqQuestions.length > 0) { // Only run if FAQ questions exist on the page
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');

                // Close all other open answers
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                        otherQuestion.classList.remove('active');
                        otherQuestion.nextElementSibling.classList.remove('show');
                        otherQuestion.querySelector('i').style.transform = 'rotate(0deg)';
                    }
                });

                // Toggle current answer
                question.classList.toggle('active');
                answer.classList.toggle('show');
                if (question.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }


    // --- Testimonial Carousel (Conditionally Executed) ---

    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevTestimonialButton = document.querySelector('.prev-testimonial');
    const nextTestimonialButton = document.querySelector('.next-testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    if (testimonialSlides.length > 0 && prevTestimonialButton && nextTestimonialButton) { // Only run if testimonials and buttons exist
        prevTestimonialButton.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial === 0) ? testimonialSlides.length - 1 : currentTestimonial - 1;
            showTestimonial(currentTestimonial);
        });

        nextTestimonialButton.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial === testimonialSlides.length - 1) ? 0 : currentTestimonial + 1;
            showTestimonial(currentTestimonial);
        });

        // Auto-advance testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial === testimonialSlides.length - 1) ? 0 : currentTestimonial + 1;
            showTestimonial(currentTestimonial);
        }, 7000); // Change testimonial every 7 seconds

        showTestimonial(currentTestimonial); // Initialize the first testimonial on load
    }
});
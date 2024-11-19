// Get all section elements and navbar links
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

// Function to detect the section in view and highlight the corresponding navbar link
function highlightNav() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 50; // Offset to trigger highlight earlier
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active'); // Remove active class from all links
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active'); // Add active class to the current link
        }
    });
}

// Listen to scroll event to trigger the highlightNav function
window.addEventListener('scroll', highlightNav);

// Initial call to highlight the link when the page loads
highlightNav();

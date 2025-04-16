document.addEventListener('DOMContentLoaded', function() {
    // Fetch the data from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Generate HTML content from the JSON data
            generateContent(data);
            // Initialize interactive features
            initializeInteractivity();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            // Display fallback message if data can't be loaded
            document.querySelector('.container').innerHTML = `
                <div class="error-message">
                    <h2>Unable to load content</h2>
                    <p>Please check that data.json is available and correctly formatted.</p>
                </div>
            `;
        });
});

// Function to generate HTML content from JSON data
function generateContent(data) {
    const container = document.querySelector('.container');
    container.innerHTML = ''; // Clear any existing content
    
    // Loop through each diffusion type and create a section
    data.diffusionTypes.forEach(type => {
        const section = document.createElement('section');
        section.className = 'section';
        section.id = type.id;
        
        // Create section header
        const header = document.createElement('h2');
        header.textContent = type.title;
        section.appendChild(header);
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'content';
        
        // Create examples container
        const examples = document.createElement('div');
        examples.className = 'examples';
        
        // Create each example
        type.examples.forEach(example => {
            const exampleEl = document.createElement('div');
            exampleEl.className = 'example';
            
            // Create image container and image
            const imageContainer = document.createElement('div');
            imageContainer.className = 'example-image';
            
            const image = document.createElement('img');
            image.src = example.imageUrl;
            image.alt = example.title;
            image.addEventListener('error', function() {
                // Fallback image if the specified one fails to load
                this.src = 'https://source.unsplash.com/featured/?abstract,blue';
            });
            
            imageContainer.appendChild(image);
            exampleEl.appendChild(imageContainer);
            
            // Create title
            const title = document.createElement('h4');
            title.textContent = example.title;
            exampleEl.appendChild(title);
            
            // Create description
            const description = document.createElement('p');
            description.textContent = example.description;
            exampleEl.appendChild(description);
            
            examples.appendChild(exampleEl);
        });
        
        content.appendChild(examples);
        section.appendChild(content);
        container.appendChild(section);
    });
}

// Function to initialize interactive features
function initializeInteractivity() {
    // Get all section elements
    const sections = document.querySelectorAll('.section');
    
    // Add click event listeners to each section
    sections.forEach(section => {
        section.addEventListener('click', function() {
            // Check if this section is already active
            const isActive = this.classList.contains('active');
            
            // Remove active class from all sections
            sections.forEach(s => {
                s.classList.remove('active');
                // Reset flex to default
                s.style.flex = '1';
                // Subtle transition back
                s.style.transition = 'all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)';
                
                // Reset image scale in non-active sections
                const images = s.querySelectorAll('.example-image img');
                images.forEach(img => {
                    img.style.transform = 'scale(1)';
                    img.style.transition = 'transform 0.5s ease';
                });
            });
            
            // If section wasn't active, make it active
            if (!isActive) {
                this.classList.add('active');
                
                // Expand this section with a nice easing
                this.style.flex = '2.5'; // Increased for better image viewing
                this.style.transition = 'all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)';
                
                // Scroll to top of this section for better content viewing
                setTimeout(() => {
                    this.scrollTop = 0;
                }, 100);
                
                // Sequential animation for examples
                const examples = this.querySelectorAll('.example');
                examples.forEach((example, i) => {
                    example.style.opacity = '0';
                    example.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        example.style.opacity = '1';
                        example.style.transform = 'translateY(0)';
                        example.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        
                        // Subtle image zoom effect after example appears
                        const img = example.querySelector('.example-image img');
                        if (img) {
                            setTimeout(() => {
                                img.style.transform = 'scale(1.02)';
                                img.style.transition = 'transform 1.2s ease';
                            }, 200);
                        }
                    }, 150 + (i * 200)); // Staggered animation
                });
            }
        });
        
        // Refined hover effects
        section.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.flex = '1.1';
                this.style.transition = 'all 0.3s ease';
                
                // Subtle image effect on hover
                const firstImage = this.querySelector('.example-image img');
                if (firstImage) {
                    firstImage.style.transform = 'scale(1.03)';
                    firstImage.style.transition = 'transform 0.5s ease';
                }
            }
        });
        
        section.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.flex = '1';
                this.style.transition = 'all 0.3s ease';
                
                // Reset image on mouse leave
                const firstImage = this.querySelector('.example-image img');
                if (firstImage) {
                    firstImage.style.transform = 'scale(1)';
                    firstImage.style.transition = 'transform 0.5s ease';
                }
            }
        });
    });
    
    // Subtle fade-in animation on page load
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(15px)';
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            // Animate first image in each section after section appears
            setTimeout(() => {
                const firstImage = section.querySelector('.example-image img');
                if (firstImage) {
                    firstImage.style.transform = 'scale(1.05)';
                    firstImage.style.transition = 'transform 0.8s ease';
                    
                    setTimeout(() => {
                        firstImage.style.transform = 'scale(1)';
                        firstImage.style.transition = 'transform 0.8s ease';
                    }, 800);
                }
            }, 500);
        }, 100 + (index * 150)); // Staggered timing
    });
    
    // Keyboard navigation with refined transitions
    document.addEventListener('keydown', function(e) {
        const activeIndex = Array.from(sections).findIndex(section => 
            section.classList.contains('active'));
        
        let targetIndex = -1;
        
        // Left arrow key
        if (e.key === 'ArrowLeft' && activeIndex > 0) {
            targetIndex = activeIndex - 1;
        }
        // Right arrow key
        else if (e.key === 'ArrowRight' && activeIndex < sections.length - 1 && activeIndex >= 0) {
            targetIndex = activeIndex + 1;
        }
        // If no section is active and right/left is pressed, activate first/last
        else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && activeIndex === -1) {
            targetIndex = e.key === 'ArrowRight' ? 0 : sections.length - 1;
        }
        
        if (targetIndex >= 0) {
            // Reset all sections first
            sections.forEach(s => {
                s.classList.remove('active');
                s.style.flex = '1';
                
                // Reset image transformations
                const images = s.querySelectorAll('.example-image img');
                images.forEach(img => {
                    img.style.transform = 'scale(1)';
                });
            });
            
            // Activate target
            sections[targetIndex].classList.add('active');
            sections[targetIndex].style.flex = '2.5';
            sections[targetIndex].scrollTop = 0; // Scroll to top of section
            
            // Animate images in target section
            const targetExamples = sections[targetIndex].querySelectorAll('.example');
            targetExamples.forEach((example, i) => {
                example.style.opacity = '0';
                example.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    example.style.opacity = '1';
                    example.style.transform = 'translateY(0)';
                    example.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    // Subtle image zoom effect
                    const img = example.querySelector('.example-image img');
                    if (img) {
                        setTimeout(() => {
                            img.style.transform = 'scale(1.02)';
                            img.style.transition = 'transform 1s ease';
                        }, 200);
                    }
                }, 150 + (i * 200));
            });
            
            // Focus section for accessibility
            sections[targetIndex].focus();
            sections[targetIndex].setAttribute('tabindex', '-1');
        }
    });
    
    // Simplified responsive behavior
    const handleResponsive = () => {
        if (window.innerWidth <= 768) {
            sections.forEach(section => {
                section.style.flex = 'none'; // Remove flex properties on mobile
                
                // Ensure example animations work well on mobile
                const examples = section.querySelectorAll('.example');
                examples.forEach(example => {
                    example.style.transition = 'transform 0.3s ease';
                });
            });
        } else {
            sections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.style.flex = '2.5';
                } else {
                    section.style.flex = '1';
                }
            });
        }
    };
    
    // Check on load and resize
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
}
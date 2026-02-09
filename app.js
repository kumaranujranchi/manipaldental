document.addEventListener('DOMContentLoaded', () => {
    // 0. Infinite Testimonial Carousel
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    if (track && prevBtn && nextBtn) {
        const cards = Array.from(track.children);
        const cardCount = cards.length;
        
        // Clone first and last few cards for infinite effect
        const firstClones = cards.slice(0, 3).map(card => card.cloneNode(true));
        const lastClones = cards.slice(-3).map(card => card.cloneNode(true));
        
        lastClones.reverse().forEach(clone => track.prepend(clone));
        firstClones.forEach(clone => track.append(clone));

        const getCardWidth = () => track.querySelector('.testimonial-card').offsetWidth + 32;
        
        // Initial position: skip the prepended clones
        track.scrollLeft = getCardWidth() * 3;

        const handleInfiniteScroll = () => {
            const width = getCardWidth();
            if (track.scrollLeft <= 0) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = width * cardCount;
                track.style.scrollBehavior = 'smooth';
            } else if (track.scrollLeft >= width * (cardCount + 3)) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = width * 3;
                track.style.scrollBehavior = 'smooth';
            }
        };

        track.addEventListener('scroll', handleInfiniteScroll);

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });

        // Auto-scroll
        let autoScroll = setInterval(() => {
            track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        }, 5000);

        track.addEventListener('mouseenter', () => clearInterval(autoScroll));
        track.addEventListener('mouseleave', () => {
             autoScroll = setInterval(() => {
                track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
            }, 5000);
        });
    }

    // 1. Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = mobileMenu?.querySelectorAll('a');
    
    const toggleMenu = (show) => {
        if (!mobileMenu) return;
        mobileMenu.classList.toggle('hidden', !show);
        mobileMenu.classList.toggle('flex', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    if (menuBtn) {
        menuBtn.addEventListener('click', () => toggleMenu(true));
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleMenu(false));
    }

    // Close menu when a link is clicked
    menuLinks?.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // 2. Statistics Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 100;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.innerText = target;
        }
    };

    // Trigger counters when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));


    // 3. Hero Image Parallax (Interactive)
    const heroContainer = document.getElementById('hero-img-container');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContainer && heroImage) {
        heroContainer.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 50;
            const y = (window.innerHeight - e.pageY * 2) / 50;
            
            heroImage.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });

        heroContainer.addEventListener('mouseleave', () => {
            heroImage.style.transform = 'translateX(0) translateY(0)';
        });
    }

    // 4. Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("progress-bar").style.width = scrolled + "%";
    });

    // 5. Scroll Reveal Animation for Cards
    const cards = document.querySelectorAll('.card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        cardObserver.observe(card);
    });

    // 6. Service Modal Logic
    const serviceDetails = {
        'orthodontics': {
            title: 'Orthodontics',
            badge: 'Expert Braces & Aligners',
            icon: 'ph-smiley-sticker',
            description: 'Achieve the perfect alignment with our expert orthodontic care. We specialize in both traditional braces and modern clear aligners (Invisalign) to correct crowding, gaps, and bite issues for patients of all ages.',
            benefits: [
                { icon: 'ph-users', title: 'Ages 7+', text: 'Early treatment & adult care' },
                { icon: 'ph-sparkle', title: 'Clear aligners', text: 'Invisible teeth straightening' },
                { icon: 'ph-clock', title: 'Fast results', text: 'Optimized treatment plans' },
                { icon: 'ph-shield-check', title: 'Health focus', text: 'Prevents future decay/wear' }
            ]
        },
        'cosmetic': {
            title: 'Cosmetic Dentistry',
            badge: 'Smile Makeover',
            icon: 'ph-sparkle',
            description: 'Our cosmetic treatments combine art and science to create the smile you’ve always dreamed of. From professional whitening to high-quality porcelain veneers, we focus on aesthetics that look and feel completely natural.',
            benefits: [
                { icon: 'ph-lightning', title: 'Fast Whitening', text: 'Visible results in one visit' },
                { icon: 'ph-palette', title: 'Veneers', text: 'Custom-crafted for your face' },
                { icon: 'ph-confetti', title: 'Smile Design', text: 'Complete digital planning' },
                { icon: 'ph-heart', title: 'Confidence', text: 'Boost your self-esteem' }
            ]
        },
        'jaw': {
            title: 'Jaw Treatments',
            badge: 'Specialized TMJ Care',
            icon: 'ph-first-aid',
            description: 'We diagnose and treat complex issues related to the jaw and temporomandibular joint (TMJ). Whether it’s chronic pain, clicking, or misalignment, our dentofacial orthopedic expertise offers relief and restoration.',
            benefits: [
                { icon: 'ph-briefcase-metal', title: 'TMJ Relief', text: 'End chronic jaw and neck pain' },
                { icon: 'ph-activity', title: 'Alignment', text: 'Correct jaw position issues' },
                { icon: 'ph-warning-circle', title: 'Prevention', text: 'Stop tooth wear from grinding' },
                { icon: 'ph-first-aid-kit', title: 'Specialists', text: 'Expert orthopedic approach' }
            ]
        },
        'root-canal': {
            title: 'Root Canal',
            badge: 'Painless Restoration',
            icon: 'ph-tooth',
            description: 'Forget everything you’ve heard about root canals. With modern anesthesia and microscopes, our RCT procedure is as painless as a filling. We save your natural tooth and prevent extractions by treating deep infections.',
            benefits: [
                { icon: 'ph-activity', title: 'Pain Relief', text: 'Immediate end to toothaches' },
                { icon: 'ph-shield-plus', title: 'Save Teeth', text: 'The best tooth is your natural one' },
                { icon: 'ph-magic-wand', title: 'Painless', text: 'Advanced numbing technology' },
                { icon: 'ph-clock-afternoon', title: 'Quick', text: 'Often completed in one visit' }
            ]
        },
        'pediatric': {
            title: 'Pediatric Dentistry',
            badge: 'Gentle Child Care',
            icon: 'ph-baby',
            description: 'We believe a positive dental experience during childhood sets the foundation for a lifetime of healthy smiles. Our team is trained to handle little patients with extra care, patience, and a friendly environment.',
            benefits: [
                { icon: 'ph-balloon', title: 'Kid-Friendly', text: 'Fun and anxiety-free visits' },
                { icon: 'ph-shield-checkered', title: 'Prevention', text: 'Sealants and fluoride treatments' },
                { icon: 'ph-chalkboard-teacher', title: 'Education', text: 'Teaching kids how to brush' },
                { icon: 'ph-hand-heart', title: 'Soft Touch', text: 'Gentle, patient approach' }
            ]
        },
        'implants': {
            title: 'Dental Implants',
            badge: 'Permanent Replacement',
            icon: 'ph-shield-check',
            description: 'Dental implants are the gold standard for replacing missing teeth. They look, feel, and function like real teeth, providing a lifelong solution that preserves your jawbone and facial structure.',
            benefits: [
                { icon: 'ph-infinity', title: 'Lifelong', text: 'Durable and permanent solution' },
                { icon: 'ph-apple', title: 'Eat Anything', text: 'Restored chewing power' },
                { icon: 'ph-smiley', title: 'Natural Look', text: 'Matches your other teeth' },
                { icon: 'ph-anchor', title: 'Stable', text: 'No slipping like dentures' }
            ]
        }
    };

    const modal = document.getElementById('service-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scroll
    };

    // Open modal function
    const openServiceModal = (serviceId) => {
        const data = serviceDetails[serviceId];
        if (!data) return;

        // Populate content
        document.getElementById('modal-badge').innerText = data.badge;
        document.getElementById('modal-title').innerText = data.title;
        document.getElementById('modal-description').innerText = data.description;
        document.getElementById('modal-icon').innerHTML = `<i class="ph-fill ${data.icon}"></i>`;
        
        // Populate benefits
        const benefitsGrid = document.getElementById('modal-benefits');
        benefitsGrid.innerHTML = data.benefits.map(benefit => `
            <div class="benefit-item">
                <i class="ph-fill ${benefit.icon}"></i>
                <div>
                    <h5 class="font-bold text-gray-800">${benefit.title}</h5>
                    <p class="text-sm text-gray-500">${benefit.text}</p>
                </div>
            </div>
        `).join('');

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    // Event Listeners
    document.querySelectorAll('.card[data-service]').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.getAttribute('data-service');
            openServiceModal(serviceId);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });
});

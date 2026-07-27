// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    // Replace with your GitHub username
    githubUsername: 'MohammadAlsadiq',
    // How many repos to fetch (max 100)
    maxRepos: 10,
    // Animation delays
    animationDelay: 100,
    // Stats animation duration
    statsAnimationDuration: 2000
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
    projects: [],
    filteredProjects: [],
    currentFilter: 'all',
    currentSort: 'recent'
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const elements = {
    nav: document.getElementById('mainNav'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    projectsGrid: document.getElementById('projectsGrid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    sortSelect: document.getElementById('sortSelect'),
    statNumbers: document.querySelectorAll('.stat-number')
};

// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================
function initNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            elements.nav.classList.add('scrolled');
        } else {
            elements.nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    elements.navToggle.addEventListener('click', () => {
        elements.navMenu.classList.toggle('active');

        // Animate hamburger
        const spans = elements.navToggle.querySelectorAll('span');
        if (elements.navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Smooth scroll for nav links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu
                elements.navMenu.classList.remove('active');
                const spans = elements.navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';

                // Scroll to section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
function animateStats() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                elements.statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = CONFIG.statsAnimationDuration;
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ==========================================
// GITHUB API INTEGRATION
// ==========================================
async function fetchGitHubProjects() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${CONFIG.githubUsername}/repos?sort=updated&per_page=${CONFIG.maxRepos}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub repositories');
        }

        const repos = await response.json();

        // Transform GitHub data to our project format
        state.projects = repos.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || 'No description provided',
            url: repo.html_url,
            homepage: repo.homepage,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || 'Unknown',
            topics: repo.topics || [],
            updated: new Date(repo.updated_at),
            created: new Date(repo.created_at),
            // Categorize based on topics or language
            category: categorizeRepo(repo)
        }));

        state.filteredProjects = [...state.projects];

        // Update stats
        updateStats();

        // Render projects
        renderProjects();

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        showFallbackProjects();
    }
}

function categorizeRepo(repo) {
    const topics = repo.topics || [];
    const language = (repo.language || '').toLowerCase();

    // Check topics first
    if (topics.some(t => ['html', 'css', 'javascript', 'web', 'frontend'].includes(t.toLowerCase()))) {
        return 'web';
    }
    if (topics.some(t => ['algorithm', 'data-structure', 'leetcode'].includes(t.toLowerCase()))) {
        return 'algorithms';
    }
    if (topics.some(t => ['tool', 'cli', 'utility'].includes(t.toLowerCase()))) {
        return 'tools';
    }

    // Check language
    if (['html', 'css', 'javascript'].includes(language)) {
        return 'web';
    }
    if (['python', 'java', 'c++'].includes(language)) {
        return 'algorithms';
    }

    return 'tools';
}

function updateStats() {
    if (state.projects.length === 0) return;

    const stats = {
        repos: state.projects.length,
        linesOfCode: state.projects.length * 500, // Estimate
        projects: state.projects.filter(p => p.stars > 0 || p.forks > 0).length
    };

    elements.statNumbers[0].dataset.count = stats.repos;
    elements.statNumbers[1].dataset.count = stats.linesOfCode;
    elements.statNumbers[2].dataset.count = stats.projects;
}

// ==========================================
// PROJECT RENDERING
// ==========================================
function renderProjects() {
    elements.projectsGrid.innerHTML = '';

    if (state.filteredProjects.length === 0) {
        elements.projectsGrid.innerHTML = `
            <div class="project-loader">
                <p>No projects found matching your filters.</p>
            </div>
        `;
        return;
    }

    state.filteredProjects.forEach((project, index) => {
        const card = createProjectCard(project);
        card.style.animationDelay = `${index * CONFIG.animationDelay}ms`;
        elements.projectsGrid.appendChild(card);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;

    // Get icon based on language
    const icon = getLanguageIcon(project.language);

    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon">${icon}</div>
            <div class="project-links">
                ${project.homepage ? `
                    <a href="${project.homepage}" target="_blank" rel="noopener" class="project-link" title="Live Demo">
                        <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7z"/></svg>
                    </a>
                ` : ''}
                <a href="${project.url}" target="_blank" rel="noopener" class="project-link" title="View on GitHub">
                    <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
            </div>
        </div>
        <h3 class="project-title">${project.name}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">
            <span class="project-tag">${project.language}</span>
            ${project.topics.slice(0, 3).map(topic => `
                <span class="project-tag">${topic}</span>
            `).join('')}
        </div>
        <div class="project-stats">
            <span class="project-stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                ${project.stars}
            </span>
            <span class="project-stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                ${project.forks}
            </span>
        </div>
    `;

    return card;
}

function getLanguageIcon(language) {
    const icons = {
        'JavaScript': '{ }',
        'Python': '🐍',
        'Java': '☕',
        'C++': 'C++',
        'HTML': '</>',
        'CSS': '🎨',
        'TypeScript': 'TS',
        'Go': 'Go',
        'Rust': '🦀',
        'Ruby': '💎'
    };

    return icons[language] || '📦';
}

// ==========================================
// FILTERING & SORTING
// ==========================================
function initProjectControls() {
    // Filter buttons
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            const filter = btn.dataset.filter;
            state.currentFilter = filter;
            filterProjects();
        });
    });

    // Sort select
    elements.sortSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        sortProjects();
    });
}

function filterProjects() {
    if (state.currentFilter === 'all') {
        state.filteredProjects = [...state.projects];
    } else {
        state.filteredProjects = state.projects.filter(
            project => project.category === state.currentFilter
        );
    }

    sortProjects();
}

function sortProjects() {
    switch (state.currentSort) {
        case 'recent':
            state.filteredProjects.sort((a, b) => b.updated - a.updated);
            break;
        case 'stars':
            state.filteredProjects.sort((a, b) => b.stars - a.stars);
            break;
        case 'name':
            state.filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    renderProjects();
}

// ==========================================
// FALLBACK PROJECTS
// ==========================================
function showFallbackProjects() {
    elements.projectsGrid.innerHTML = `
        <div class="project-loader">
            <p>Unable to load projects from GitHub. Please check the username in the configuration.</p>
            <p style="margin-top: 1rem; color: var(--color-text-muted);">
                Update <code>CONFIG.githubUsername</code> in script.js with your GitHub username.
            </p>
        </div>
    `;

    // You can also add manual project cards here
    const manualProjects = [
        {
            id: 1,
            name: 'Portfolio Website',
            description: 'A responsive portfolio website built with vanilla HTML, CSS, and JavaScript featuring GitHub API integration and dynamic filtering.',
            url: '#',
            homepage: null,
            stars: 0,
            forks: 0,
            language: 'JavaScript',
            topics: ['html', 'css', 'javascript', 'portfolio'],
            category: 'web',
            updated: new Date(),
            created: new Date()
        }
        // Add more manual projects here
    ];

    state.projects = manualProjects;
    state.filteredProjects = [...manualProjects];

    // Uncomment to show manual projects instead of error message:
    // renderProjects();
}

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// INITIALIZATION
// ==========================================
function init() {
    console.log('🚀 Initializing portfolio website...');

    // Initialize navigation
    initNavigation();

    // Initialize animations
    initScrollAnimations();
    animateStats();

    // Initialize project controls
    initProjectControls();

    // Fetch and display GitHub projects
    fetchGitHubProjects();

    console.log('✅ Portfolio website initialized!');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==========================================
// EXPORTS (if using modules)
// ==========================================
// export { init, fetchGitHubProjects, filterProjects, sortProjects };

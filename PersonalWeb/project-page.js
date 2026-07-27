// ==========================================
// PROJECT PAGE FUNCTIONALITY
// ==========================================

// Get project info from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');
const githubUsername = urlParams.get('user') || 'yourusername'; // Fallback to config

// State
let projectData = null;

// ==========================================
// FETCH PROJECT DATA FROM GITHUB
// ==========================================
async function fetchProjectDetails() {
    if (!projectName) {
        showError('No project specified in URL');
        return;
    }

    try {
        // Fetch main repo data
        const repoResponse = await fetch(
            `https://api.github.com/repos/${githubUsername}/${projectName}`
        );

        if (!repoResponse.ok) {
            throw new Error('Repository not found');
        }

        projectData = await repoResponse.json();

        // Fetch additional data in parallel
        const [languagesData, readmeData, commitsData] = await Promise.all([
            fetchLanguages(),
            fetchReadme(),
            fetchRecentCommits()
        ]);

        // Populate the page
        populateProjectInfo(projectData);
        populateLanguages(languagesData);
        populateReadme(readmeData);
        populateRepoInfo(projectData, commitsData);

        // Fetch related projects
        fetchRelatedProjects();

    } catch (error) {
        console.error('Error fetching project:', error);
        showError('Failed to load project details. Please check the project name and try again.');
    }
}

// ==========================================
// FETCH ADDITIONAL DATA
// ==========================================
async function fetchLanguages() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${githubUsername}/${projectName}/languages`
        );
        return response.ok ? await response.json() : {};
    } catch (error) {
        console.error('Error fetching languages:', error);
        return {};
    }
}

async function fetchReadme() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${githubUsername}/${projectName}/readme`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3.html'
                }
            }
        );
        return response.ok ? await response.text() : null;
    } catch (error) {
        console.error('Error fetching README:', error);
        return null;
    }
}

async function fetchRecentCommits() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${githubUsername}/${projectName}/commits?per_page=1`
        );
        if (response.ok) {
            const commits = await response.json();
            return commits[0] || null;
        }
        return null;
    } catch (error) {
        console.error('Error fetching commits:', error);
        return null;
    }
}

// ==========================================
// POPULATE PAGE CONTENT
// ==========================================
function populateProjectInfo(data) {
    // Update document title
    document.title = `${data.name} - Your Name`;

    // Breadcrumb
    document.getElementById('breadcrumbName').textContent = data.name;

    // Header
    document.getElementById('projectTitle').textContent = data.name;
    document.getElementById('projectDescription').textContent =
        data.description || 'No description available';
    document.getElementById('projectLanguage').textContent = data.language || 'N/A';
    document.getElementById('projectDate').textContent = formatDate(new Date(data.updated_at));

    // Status badge
    const statusBadge = document.getElementById('projectStatus');
    if (data.archived) {
        statusBadge.textContent = 'Archived';
        statusBadge.style.background = 'rgba(245, 158, 11, 0.1)';
        statusBadge.style.color = 'var(--color-warning)';
    } else {
        statusBadge.textContent = 'Active';
    }

    // Stats
    document.getElementById('projectStars').textContent = formatNumber(data.stargazers_count);
    document.getElementById('projectForks').textContent = formatNumber(data.forks_count);
    document.getElementById('projectWatchers').textContent = formatNumber(data.watchers_count);

    // Action buttons
    const viewGithubBtn = document.getElementById('viewGithubBtn');
    viewGithubBtn.href = data.html_url;

    const viewLiveBtn = document.getElementById('viewLiveBtn');
    if (data.homepage) {
        viewLiveBtn.href = data.homepage;
        viewLiveBtn.style.display = 'flex';
    }

    // Tags
    const tagsContainer = document.getElementById('projectTags');
    if (data.topics && data.topics.length > 0) {
        tagsContainer.innerHTML = data.topics.map(topic =>
            `<span class="project-page-tag">${topic}</span>`
        ).join('');
    } else {
        tagsContainer.innerHTML = '<span class="project-page-tag">No tags</span>';
    }

    // Quick links
    document.getElementById('issuesLink').href = `${data.html_url}/issues`;
    document.getElementById('pullsLink').href = `${data.html_url}/pulls`;
    document.getElementById('commitsLink').href = `${data.html_url}/commits`;
}

function populateRepoInfo(data, latestCommit) {
    document.getElementById('createdDate').textContent = formatDate(new Date(data.created_at));

    if (latestCommit) {
        const commitDate = new Date(latestCommit.commit.author.date);
        document.getElementById('lastCommit').textContent = formatRelativeTime(commitDate);
    } else {
        document.getElementById('lastCommit').textContent = 'Unknown';
    }

    document.getElementById('license').textContent =
        data.license ? data.license.name : 'No license';

    document.getElementById('repoSize').textContent = formatSize(data.size);
}

function populateLanguages(languages) {
    const chartContainer = document.getElementById('languagesChart');
    chartContainer.innerHTML = '';

    if (Object.keys(languages).length === 0) {
        chartContainer.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">No language data available</p>';
        return;
    }

    // Calculate total bytes
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

    // Sort by percentage and take top 5
    const sortedLanguages = Object.entries(languages)
        .map(([name, bytes]) => ({
            name,
            bytes,
            percentage: (bytes / total * 100).toFixed(1)
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 5);

    // Create language bars
    sortedLanguages.forEach((lang, index) => {
        const bar = document.createElement('div');
        bar.className = 'language-bar';
        bar.innerHTML = `
            <div class="language-header">
                <span class="language-name">${lang.name}</span>
                <span class="language-percent">${lang.percentage}%</span>
            </div>
            <div class="language-bar-track">
                <div class="language-bar-fill" style="width: 0%; animation: fillBar 1s ease ${index * 0.1}s forwards; --fill-width: ${lang.percentage}%;"></div>
            </div>
        `;
        chartContainer.appendChild(bar);
    });

    // Add CSS animation
    if (!document.getElementById('languageBarAnimation')) {
        const style = document.createElement('style');
        style.id = 'languageBarAnimation';
        style.textContent = `
            @keyframes fillBar {
                to { width: var(--fill-width); }
            }
        `;
        document.head.appendChild(style);
    }
}

function populateReadme(readmeHtml) {
    const readmeContainer = document.getElementById('readmeContent');

    if (readmeHtml) {
        readmeContainer.innerHTML = readmeHtml;

        // Extract features from README if available
        extractFeatures(readmeContainer);

        // Extract tech stack
        extractTechStack();
    } else {
        readmeContainer.innerHTML = '<p style="color: var(--color-text-muted);">No README available for this project.</p>';
    }
}

function extractFeatures(readmeContainer) {
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = '';

    // Try to find a features section in the README
    const headings = readmeContainer.querySelectorAll('h2, h3');
    let featuresSection = null;

    headings.forEach(heading => {
        const text = heading.textContent.toLowerCase();
        if (text.includes('feature') || text.includes('highlights')) {
            featuresSection = heading.nextElementSibling;
        }
    });

    if (featuresSection && featuresSection.tagName === 'UL') {
        const items = featuresSection.querySelectorAll('li');
        if (items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.textContent;
                featuresList.appendChild(li);
            });
            return;
        }
    }

    // Fallback: create generic features
    const genericFeatures = [
        'Built with modern web technologies',
        'Responsive and mobile-friendly design',
        'Clean and maintainable code',
        'Well-documented and easy to understand'
    ];

    genericFeatures.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
}

function extractTechStack() {
    if (!projectData) return;

    const techStack = document.getElementById('techStack');
    const technologies = new Set();

    // Add primary language
    if (projectData.language) {
        technologies.add(projectData.language);
    }

    // Add technologies from topics
    if (projectData.topics) {
        const techTopics = ['html', 'css', 'javascript', 'react', 'vue', 'python',
            'java', 'typescript', 'nodejs', 'express', 'mongodb',
            'postgresql', 'docker', 'aws', 'git'];

        projectData.topics.forEach(topic => {
            if (techTopics.includes(topic.toLowerCase())) {
                technologies.add(topic);
            }
        });
    }

    // Convert to array and create tech items
    const techArray = Array.from(technologies);

    if (techArray.length === 0) {
        techStack.innerHTML = '<p style="color: var(--color-text-muted);">No specific technologies detected</p>';
        return;
    }

    techStack.innerHTML = techArray.map(tech => {
        const icon = getTechIcon(tech);
        return `
            <div class="tech-item">
                <span class="tech-icon">${icon}</span>
                <span class="tech-name">${tech}</span>
            </div>
        `;
    }).join('');
}

// ==========================================
// FETCH RELATED PROJECTS
// ==========================================
async function fetchRelatedProjects() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=20`
        );

        if (!response.ok) return;

        const repos = await response.json();

        // Filter out current project and get 3 related ones
        const related = repos
            .filter(repo => repo.name !== projectName)
            .slice(0, 3);

        displayRelatedProjects(related);

    } catch (error) {
        console.error('Error fetching related projects:', error);
    }
}

function displayRelatedProjects(projects) {
    const container = document.getElementById('relatedProjects');

    if (projects.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">No related projects found</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <a href="project.html?project=${project.name}&user=${githubUsername}" class="related-card">
            <h3>${project.name}</h3>
            <p>${project.description || 'No description available'}</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem; font-size: 0.875rem; color: var(--color-text-muted);">
                <span>⭐ ${project.stargazers_count}</span>
                <span>🔱 ${project.forks_count}</span>
                ${project.language ? `<span>📦 ${project.language}</span>` : ''}
            </div>
        </a>
    `).join('');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) {
        return formatDate(date);
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function formatSize(kb) {
    if (kb >= 1024) {
        return (kb / 1024).toFixed(1) + ' MB';
    }
    return kb + ' KB';
}

function getTechIcon(tech) {
    const icons = {
        'JavaScript': '🟨',
        'Python': '🐍',
        'Java': '☕',
        'C++': '⚙️',
        'HTML': '🌐',
        'CSS': '🎨',
        'TypeScript': '🔷',
        'React': '⚛️',
        'Vue': '💚',
        'Node.js': '🟢',
        'nodejs': '🟢',
        'Express': '🚂',
        'express': '🚂',
        'MongoDB': '🍃',
        'mongodb': '🍃',
        'PostgreSQL': '🐘',
        'postgresql': '🐘',
        'Docker': '🐳',
        'docker': '🐳',
        'Git': '📦',
        'git': '📦',
        'AWS': '☁️',
        'aws': '☁️'
    };

    return icons[tech] || '📦';
}

function showError(message) {
    const container = document.querySelector('.project-hero .container');
    container.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">😕</h1>
            <h2 style="color: var(--color-text); margin-bottom: 1rem;">Oops! Something went wrong</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">${message}</p>
            <a href="index.html" class="btn btn-primary">← Back to Portfolio</a>
        </div>
    `;

    // Hide other sections
    document.querySelector('.project-content').style.display = 'none';
    document.querySelector('.related-projects').style.display = 'none';
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('mainNav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ==========================================
// INITIALIZE
// ==========================================
function init() {
    console.log('🚀 Loading project page...');
    console.log('Project:', projectName);
    console.log('User:', githubUsername);

    initNavigation();
    fetchProjectDetails();
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

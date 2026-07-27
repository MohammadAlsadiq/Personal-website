# Personal Portfolio Website

A modern, responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Features GitHub API integration, dynamic filtering, smooth animations, and a blog section.

## 🌟 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **GitHub Integration**: Automatically fetches and displays your repositories
- **Dynamic Filtering**: Filter projects by category (Web, Algorithms, Tools)
- **Smart Sorting**: Sort projects by date, stars, or name
- **Smooth Animations**: Professional entrance animations and transitions
- **Blog Section**: Showcase your technical writing and learning journey
- **No Frameworks**: Pure HTML, CSS, and JavaScript - demonstrates fundamental web skills
- **Modern CSS**: CSS Grid, Flexbox, custom properties, animations
- **ES6+ JavaScript**: Async/await, arrow functions, template literals, modules

## 🚀 Quick Start

### 1. Customize Your Information

**In `index.html`:**
- Replace "Your Name" with your actual name (multiple locations)
- Update the hero section text
- Modify the About section with your background
- Update skills to match your expertise
- Replace placeholder links in the Contact section
- Add your email, GitHub, and LinkedIn URLs

**In `script.js`:**
```javascript
const CONFIG = {
    githubUsername: 'yourusername', // ← Change this to your GitHub username
    maxRepos: 10,
    animationDelay: 100,
    statsAnimationDuration: 2000
};
```

**In `styles.css` (optional):**
- Adjust color scheme by modifying CSS variables at the top
- Current theme: Dark with cyan accents
- Easy to customize entire color palette

### 2. Add Your Blog Posts

Replace the sample blog posts in `index.html` (search for `<article class="blog-card">`):

```html
<article class="blog-card">
    <div class="blog-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
    <div class="blog-content">
        <div class="blog-meta">
            <span class="blog-date">Your Date</span>
            <span class="blog-category">Your Category</span>
        </div>
        <h3 class="blog-title">Your Blog Title</h3>
        <p class="blog-excerpt">Your blog post summary...</p>
        <a href="your-blog-link.html" class="blog-link">Read More →</a>
    </div>
</article>
```

### 3. Deploy Your Site

**Option A: GitHub Pages (Recommended)**
1. Create a new repository named `yourusername.github.io`
2. Push your files to the repository
3. Your site will be live at `https://yourusername.github.io`

**Option B: Netlify**
1. Sign up at netlify.com
2. Drag and drop your folder
3. Get instant hosting with custom domain support

**Option C: Vercel**
1. Sign up at vercel.com
2. Import your GitHub repository
3. Automatic deployments on every push

## 📚 Learning Roadmap

This project is designed to help you master web fundamentals. Here's what you'll learn:

### Phase 1: Understanding the Structure (Week 1)
- [ ] Study the HTML semantic structure
- [ ] Understand how sections are organized
- [ ] Learn about accessibility (ARIA labels, semantic tags)
- [ ] Explore the meta tags and SEO basics

**Tasks:**
- Change all the placeholder text to your own
- Add a new section (e.g., "Education" or "Certifications")
- Experiment with reordering sections

### Phase 2: Mastering CSS (Week 2-3)
- [ ] Understand CSS custom properties (variables)
- [ ] Learn CSS Grid for layout
- [ ] Master Flexbox for component alignment
- [ ] Study CSS animations and transitions
- [ ] Explore responsive design with media queries

**Tasks:**
- Create your own color scheme
- Design a new project card style
- Add hover effects to different elements
- Make the site work on very small screens (320px)

### Phase 3: JavaScript Fundamentals (Week 3-4)
- [ ] Understand DOM manipulation
- [ ] Learn event listeners and handlers
- [ ] Master array methods (map, filter, sort)
- [ ] Study async/await and Promises
- [ ] Explore the Fetch API

**Tasks:**
- Add a dark/light theme toggle
- Create a search feature for projects
- Add pagination to project cards
- Build a working contact form

### Phase 4: Advanced Features (Week 5-6)
- [ ] Implement local storage for user preferences
- [ ] Add more complex animations with Intersection Observer
- [ ] Create a smooth page transition system
- [ ] Build a working blog with routing
- [ ] Add performance optimizations

**Tasks:**
- Save filter/sort preferences
- Add a "back to top" button
- Create animated statistics counters
- Build a tag-based filtering system

## 🔧 Advanced Customization

### Adding Manual Projects

If you want to add projects that aren't on GitHub, modify the `showFallbackProjects()` function:

```javascript
const manualProjects = [
    {
        id: 1,
        name: 'My Amazing Project',
        description: 'Description of your project',
        url: 'https://github.com/...',
        homepage: 'https://project-demo.com',
        stars: 5,
        forks: 2,
        language: 'JavaScript',
        topics: ['web', 'frontend'],
        category: 'web',
        updated: new Date(),
        created: new Date()
    }
];
```

### Customizing Project Categories

In `script.js`, modify the `categorizeRepo()` function to change how projects are categorized:

```javascript
function categorizeRepo(repo) {
    const topics = repo.topics || [];
    
    // Add your own logic
    if (topics.includes('machine-learning')) {
        return 'ml';
    }
    
    // ... rest of function
}
```

Then add a new filter button in `index.html`:
```html
<button class="filter-btn" data-filter="ml">Machine Learning</button>
```

### Changing Fonts

Current fonts:
- **Display**: Fraunces (serif, for headings)
- **Body**: JetBrains Mono (monospace, for text)

To change fonts, update the Google Fonts link in `index.html` and CSS variables:

```css
:root {
    --font-display: 'Your Display Font', serif;
    --font-body: 'Your Body Font', sans-serif;
}
```

## 🎨 Color Schemes

Here are alternative color schemes you can try:

### Light Mode
```css
:root {
    --color-bg: #ffffff;
    --color-text: #1a1a1a;
    --color-accent: #2563eb;
    /* ... update all colors */
}
```

### Minimal Monochrome
```css
:root {
    --color-bg: #000000;
    --color-text: #ffffff;
    --color-accent: #ffffff;
    --color-border: #333333;
}
```

### Warm Sunset
```css
:root {
    --color-bg: #1a0f0f;
    --color-accent: #ff6b35;
    --color-accent-secondary: #f7931e;
}
```

## 💡 Tips for Success

1. **Start Simple**: Don't try to understand everything at once
2. **Break It Down**: Focus on one section at a time
3. **Experiment**: Change things and see what happens
4. **Use DevTools**: Chrome/Firefox DevTools are your best friend
5. **Read Comments**: The code is heavily commented to help you learn
6. **Build on It**: Add features gradually as you learn new concepts
7. **Share Your Work**: Deploy early and get feedback

## 🐛 Troubleshooting

### Projects Not Loading from GitHub
- Check that `CONFIG.githubUsername` matches your GitHub username exactly
- Open browser DevTools (F12) → Console to see errors
- GitHub API has rate limits (60 requests/hour without authentication)

### Styles Not Applying
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that `styles.css` is in the same folder as `index.html`
- Verify the `<link>` tag in the HTML

### JavaScript Not Working
- Open DevTools Console to see errors
- Ensure `script.js` is in the same folder
- Check that the `<script>` tag is at the bottom of `<body>`

## 🎓 Next Steps

Once you're comfortable with this project, consider:

1. **Add Backend Integration**
   - Create a contact form that sends emails
   - Build a CMS for your blog posts
   - Add analytics to track visitors

2. **Optimize Performance**
   - Lazy load images
   - Minimize CSS/JS files
   - Implement service workers for offline support

3. **Enhance Accessibility**
   - Add keyboard navigation
   - Improve screen reader support
   - Ensure proper color contrast

4. **Learn a Framework**
   - Rebuild this in React, Vue, or Svelte
   - Compare the approaches
   - Understand when frameworks add value

## 📖 Resources for Learning

- **HTML**: [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- **CSS**: [CSS-Tricks](https://css-tricks.com/) and [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **JavaScript**: [JavaScript.info](https://javascript.info/) and [Eloquent JavaScript](https://eloquentjavascript.net/)
- **Git**: [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- **APIs**: [GitHub REST API Docs](https://docs.github.com/en/rest)

## 🤝 Show Your Work

When sharing your portfolio:
- ✅ Make sure all links work
- ✅ Test on multiple devices
- ✅ Check for typos and grammar
- ✅ Add a custom domain if possible
- ✅ Include a link in your resume and LinkedIn

## 📄 License

This project is open source and available for anyone to use and customize. No attribution required, but always appreciated!

---

**Built with ❤️ using pure web fundamentals - no frameworks, just skills.**

Good luck with your portfolio, and happy coding! 🚀

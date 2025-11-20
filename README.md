# Decardy - Modern Website

A modern, mobile-friendly website built with vanilla HTML, CSS, and JavaScript, deployable on Cloudflare Pages (via GitHub) or Cloudflare Workers.

## Features

- **Modern Design**: Clean, professional design with smooth animations and transitions
- **Mobile-First**: Fully responsive design that works beautifully on all devices
- **Fast Performance**: Optimized for speed with efficient CSS and JavaScript
- **Cloudflare Ready**: Deploy via GitHub to Cloudflare Pages or Workers for global edge distribution
- **Accessible**: Built with web accessibility best practices
- **SEO Friendly**: Semantic HTML and proper meta tags

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with variables, Grid, and Flexbox
- **JavaScript**: Vanilla JS with modern ES6+ features
- **Cloudflare Pages/Workers**: Edge computing for fast global delivery with GitHub integration

## Project Structure

```
Decardy/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with responsive design
├── script.js           # Interactive JavaScript functionality
├── _headers            # Cloudflare Pages headers configuration
├── _redirects          # Cloudflare Pages redirect rules
├── worker.js           # Cloudflare Worker script (alternative deployment)
├── wrangler.toml       # Cloudflare Workers configuration
├── package.json        # Node.js dependencies
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/taddiemason/Decardy.git
cd Decardy
```

2. Open `index.html` in your browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or simply open the file
open index.html
```

3. The website should now be running at `http://localhost:8000`

## Deployment Options

### Option 1: Cloudflare Pages (Recommended - GitHub Integration)

This is the easiest method with automatic deployments from GitHub.

#### Prerequisites
- [GitHub Account](https://github.com)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)

#### Step-by-Step Deployment

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Go to Cloudflare Pages**:
   - Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "Workers & Pages" in the left sidebar
   - Click "Create application"
   - Select "Pages" tab
   - Click "Connect to Git"

3. **Connect your GitHub repository**:
   - Authorize Cloudflare to access your GitHub account
   - Select the `Decardy` repository
   - Click "Begin setup"

4. **Configure build settings**:
   - **Project name**: `decardy` (or your preferred name)
   - **Production branch**: `main` (or your default branch)
   - **Build command**: Leave empty (static site)
   - **Build output directory**: `/` (root)
   - Click "Save and Deploy"

5. **Your site is live!**
   - Cloudflare will build and deploy your site
   - You'll get a URL like: `https://decardy.pages.dev`
   - Every push to your main branch will auto-deploy

6. **Add a custom domain** (Optional):
   - In your Pages project, go to "Custom domains"
   - Click "Set up a custom domain"
   - Follow the instructions to add your domain

#### Automatic Deployments

Once set up, Cloudflare Pages will automatically:
- Deploy on every push to your main branch
- Create preview deployments for pull requests
- Provide unique URLs for each deployment
- Apply the security headers from `_headers` file
- Handle redirects from `_redirects` file

### Option 2: Cloudflare Workers

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Setup

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Update `wrangler.toml` with your settings:
```toml
name = "decardy-website"  # Change to your preferred name
```

### Deploy

Deploy to Cloudflare Workers:

```bash
wrangler deploy
```

Your site will be live at: `https://decardy-website.YOUR_SUBDOMAIN.workers.dev`

### Custom Domain (Optional)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your Worker
3. Go to "Triggers" tab
4. Add a custom domain under "Routes"

## Configuration

### Customization

- **Colors**: Edit CSS variables in `styles.css` (lines 1-13)
- **Content**: Update text in `index.html`
- **Caching**: Adjust cache settings in `worker.js`

### Cache Configuration

Default cache times in `worker.js`:
- HTML: 1 hour (browser), 1 day (edge)
- CSS/JS: 1 day (browser), 1 week (edge)
- Images: 1 week (browser), 30 days (edge)

## Features Breakdown

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Hamburger menu for mobile devices

### Animations
- Smooth scroll navigation
- Fade-in effects on scroll
- Animated statistics counters
- Floating card animation

### Interactivity
- Mobile navigation toggle
- Form validation
- Smooth scrolling
- Active navigation states
- Parallax effects

### Performance
- Minimal dependencies
- Optimized CSS and JavaScript
- Lazy loading for animations
- Efficient caching strategy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Reduced motion support
- Proper color contrast

## Security

- Content Security Policy (CSP) headers
- XSS protection
- HTTPS only
- Security headers via Cloudflare Worker

## Performance Optimizations

- Minified and cached assets
- CDN distribution via Cloudflare
- Efficient CSS with no unused styles
- Vanilla JavaScript (no heavy frameworks)
- Optimized images and assets

## Development Commands

```bash
# Install dependencies
npm install

# Deploy to Cloudflare
wrangler deploy

# Preview deployment
wrangler dev

# Check worker logs
wrangler tail
```

## Environment Variables

If you need environment variables, add them to `wrangler.toml`:

```toml
[env.production]
vars = { API_URL = "https://api.example.com" }
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Email: contact@decardy.com

## Roadmap

- [ ] Add dark/light theme toggle
- [ ] Integrate contact form with backend API
- [ ] Add blog section
- [ ] Implement PWA features
- [ ] Add more animations
- [ ] Integrate analytics

## Acknowledgments

- Built with modern web standards
- Inspired by contemporary web design trends
- Deployed on Cloudflare's edge network

---

Made with ❤️ by Decardy

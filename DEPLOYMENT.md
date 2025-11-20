# Deploying Decardy Website to Cloudflare Pages via GitHub

This guide will walk you through deploying your Decardy website to Cloudflare Pages using GitHub integration for automatic deployments.

## Why Cloudflare Pages?

- **Free hosting** for static websites
- **Automatic deployments** on every push to GitHub
- **Global CDN** for fast loading worldwide
- **Preview deployments** for pull requests
- **Free SSL** certificate
- **No build step required** for this site
- **Custom domains** supported

## Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account
- ✅ Your Decardy repository on GitHub
- ✅ A Cloudflare account (free tier is fine)

## Step-by-Step Deployment Guide

### Step 1: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# Make sure you're in the Decardy directory
cd Decardy

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Ready for deployment"

# Push to GitHub (replace 'main' with your default branch if different)
git push origin main
```

### Step 2: Access Cloudflare Dashboard

1. Go to [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Log in to your Cloudflare account (or create one if you don't have it)
3. You'll see the Cloudflare Dashboard homepage

### Step 3: Navigate to Workers & Pages

1. In the left sidebar, click on **"Workers & Pages"**
2. You'll see a page showing any existing Workers or Pages projects
3. Click the **"Create application"** button (blue button on the right)

### Step 4: Choose Pages

1. You'll see two tabs: "Workers" and "Pages"
2. Click on the **"Pages"** tab
3. Click **"Connect to Git"** button

### Step 5: Connect Your GitHub Account

1. Click **"Connect GitHub"**
2. A popup window will appear asking you to authorize Cloudflare
3. Click **"Authorize Cloudflare"** in the GitHub authorization page
4. You may be asked to select which repositories Cloudflare can access:
   - Choose "All repositories" OR
   - Choose "Only select repositories" and select your **Decardy** repository
5. Click **"Install & Authorize"**

### Step 6: Select Your Repository

1. You'll be redirected back to Cloudflare
2. You'll see a list of your GitHub repositories
3. Find and click on **"Decardy"** (or whatever you named your repository)
4. Click **"Begin setup"**

### Step 7: Configure Build Settings

You'll see a configuration page. Fill it in as follows:

**Project name:**
```
decardy
```
(or whatever you want your subdomain to be)

**Production branch:**
```
main
```
(or your default branch name)

**Framework preset:**
```
None
```
(select from dropdown)

**Build command:**
```
(leave empty)
```

**Build output directory:**
```
/
```
(just a forward slash)

**Root directory (optional):**
```
(leave empty)
```

### Step 8: Set Environment Variables (Optional)

For this project, you don't need any environment variables, so you can skip this section.

### Step 9: Deploy!

1. Click **"Save and Deploy"** button at the bottom
2. Cloudflare will now:
   - Clone your repository
   - Deploy your files to their edge network
   - Generate a URL for your site

3. Wait for the deployment to complete (usually takes 30-60 seconds)
4. You'll see a success message with your site URL

### Step 10: Access Your Live Website

Your site will be live at:
```
https://decardy.pages.dev
```
(or whatever project name you chose)

Click the URL to visit your live website!

## Automatic Deployments

Now that your site is connected to GitHub:

- **Every push to main branch** = Automatic deployment
- **Every pull request** = Preview deployment with unique URL
- **Merge to main** = Automatically deployed to production

### Making Updates

1. Edit your files locally
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```
3. Cloudflare automatically detects the push and deploys within 1-2 minutes

## Adding a Custom Domain

Once your site is deployed, you can add your own domain (like decardy.com):

### If your domain is already on Cloudflare:

1. Go to your Pages project in the Cloudflare dashboard
2. Click on **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Enter your domain name (e.g., `www.decardy.com` or `decardy.com`)
5. Click **"Continue"**
6. Cloudflare will automatically configure DNS
7. Your site will be live on your custom domain in a few minutes

### If your domain is NOT on Cloudflare:

1. Follow the same steps as above
2. Cloudflare will provide you with DNS records to add
3. Go to your domain registrar (GoDaddy, Namecheap, etc.)
4. Add the DNS records Cloudflare provides
5. Wait for DNS propagation (can take up to 24 hours, usually much faster)

## Viewing Deployment History

To see all your deployments:

1. Go to your Pages project in Cloudflare dashboard
2. Click on **"Deployments"** tab
3. You'll see:
   - Every deployment with timestamp
   - Git commit message
   - Deployment status (success/failed)
   - URLs for preview deployments

## Previewing Pull Requests

When you create a pull request on GitHub:

1. Cloudflare automatically creates a preview deployment
2. The preview URL is posted as a comment on your PR
3. You can test changes before merging to main
4. Once merged, the changes go to production

## Monitoring and Analytics

Cloudflare Pages provides analytics:

1. Go to your Pages project
2. Click on **"Analytics"** tab
3. View:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Top pages

## Troubleshooting

### Deployment Failed

1. Check the build logs in the Cloudflare dashboard
2. Make sure all files are committed and pushed to GitHub
3. Verify the build settings (they should match Step 7)

### Site Not Updating

1. Check that your changes were pushed to the correct branch
2. Look at the Deployments tab to see if a new deployment was triggered
3. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Custom Domain Not Working

1. Make sure DNS records are correctly configured
2. Wait for DNS propagation (can take up to 24 hours)
3. Check the Custom Domains tab for any errors

## Configuration Files

The Decardy project includes two special files for Cloudflare Pages:

### `_headers`
Controls HTTP headers for security and caching:
- Security headers (XSS protection, content type options, etc.)
- Cache-Control headers for optimal performance
- Content Security Policy for enhanced security

### `_redirects`
Handles URL redirects and routing:
- SPA fallback to serve index.html for all routes
- Ensures proper navigation

These files are automatically applied by Cloudflare Pages when you deploy.

## Advanced: Branch Previews

You can set up different branches for different environments:

**Production:** `main` branch → `https://decardy.pages.dev`
**Staging:** `staging` branch → `https://staging.decardy.pages.dev`
**Development:** `dev` branch → `https://dev.decardy.pages.dev`

To set this up:
1. Go to your Pages project settings
2. Add preview branches
3. Each branch gets its own URL

## Cost

Cloudflare Pages is **completely free** for:
- Unlimited sites
- Unlimited requests
- Unlimited bandwidth
- 500 builds per month
- 100 custom domains per project

## Support

If you run into issues:
- Check [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
- Visit [Cloudflare Community](https://community.cloudflare.com/)
- Check your project's build logs for errors

## Next Steps

Now that your site is deployed:
- Set up a custom domain
- Enable Web Analytics in Cloudflare
- Set up branch previews for testing
- Add more content and features
- Monitor your site's performance

---

🎉 **Congratulations!** Your Decardy website is now live on Cloudflare's global network!

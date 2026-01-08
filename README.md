# cabbagekobe.info

Personal blog site built with Astro.

## 🚀 Deployment

This site is automatically deployed to GitHub Pages at [https://cabbagekobe.info](https://cabbagekobe.info).

### Initial Setup (One-time)

1. **Enable GitHub Pages:**
   - Go to your repository settings: https://github.com/cabbagekobe/cabbagekobe.info/settings/pages
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"
   - Save the settings

2. **Configure Custom Domain:**
   - In the same GitHub Pages settings page
   - Under "Custom domain", enter: `cabbagekobe.info`
   - Click "Save"
   - Check "Enforce HTTPS" (after DNS propagates)

3. **DNS Settings (at your domain registrar):**
   - Add the following DNS records for `cabbagekobe.info`:
   
   ```
   Type: A
   Name: @ (or leave blank)
   Value: 185.199.108.153
   
   Type: A
   Name: @ (or leave blank)
   Value: 185.199.109.153
   
   Type: A
   Name: @ (or leave blank)
   Value: 185.199.110.153
   
   Type: A
   Name: @ (or leave blank)
   Value: 185.199.111.153
   
   Type: CNAME
   Name: www
   Value: cabbagekobe.github.io
   ```

4. **Push to GitHub:**
   - Commit the new workflow and CNAME files
   - Push to the `main` (or `master`) branch
   - GitHub Actions will automatically build and deploy

### Auto Deployment

The site automatically deploys when you push to the main branch. You can monitor the deployment status in the "Actions" tab of your repository.

## 🧞 Development Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start local dev server at `localhost:4321`       |
| `npm run build`           | Build production site to `./dist/`               |
| `npm run preview`         | Preview build locally before deploying           |
| `npm run new:article`     | Create a new article                             |
| `npm run format`          | Format code with Biome                           |
| `npm run lint`            | Lint and fix code with Biome                     |
| `npm run test`            | Run tests                                        |
| `npm run check-all`       | Build, lint, and test                            |


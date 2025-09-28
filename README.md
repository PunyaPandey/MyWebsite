# Punya Parashar Pandey – Portfolio

A clean, recruiter-friendly portfolio for an EDI Integration Developer & Azure Specialist.

## Structure
- `index.html` – Content and sections (Hero, About, Skills, Experience, Projects, Education, Certifications, Contact)
- `styles.css` – Responsive styling, blue/white/gray palette, timeline, cards, tiles
- `script.js` – Smooth scroll, active navigation, basic contact form handling
- `assets/Punya_Parashar_Pandey_Resume.pdf` – Placeholder resume (replace with your PDF)

## Edit Content
- Update social links in `index.html` and `script.js` (`#linkedin-link`, `#github-link`).
- Replace `assets/Punya_Parashar_Pandey_Resume.pdf` with your actual resume file.

## Run Locally
Open `index.html` directly in a browser, or serve with a simple static server:

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy
- GitHub Pages: Push to a repo and enable Pages (root folder). 
- Netlify/Vercel: Drag-and-drop the folder or connect the repo (no build needed).

### Deploy on Render (Static Site)
This repo includes `render.yaml` for one-click deploys on Render.

Steps:
1. Commit and push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. Create a new Static Site on Render and select your repo, or click "New +" → "Blueprint" and point to the repo containing `render.yaml`.
3. Ensure settings detect:
   - Type: Static
   - Build command: empty (no build)
   - Publish directory: `.`
4. Deploy. Render will serve the site from the root and cache assets under `assets/` per headers in `render.yaml`.

Notes:
- Custom domain can be configured in Render → Settings → Custom Domains.
- Update `render.yaml` to change the service name or headers.

## SEO & Accessibility
- Includes semantic HTML, meta tags, and JSON-LD Person schema.
- Mobile-first, accessible labels, and ARIA roles for dynamic status.

## License
MIT

# Deployment

The website is a self-contained static directory. Serve index.html, assets/, favicon.svg and data/resources.json as-is.

## GitHub Pages (manual)
After confirming organization account health and public repository visibility, an owner can open website -> Settings -> Pages and choose deploy from the main branch/root. Do not create a GitHub Actions workflow. If branch deployment is unavailable, use a user-controlled static host and explicit manual publish.

## Local proof
Run python -m http.server 8000 from website. Test keyboard interactions, links, filters and the browser console. Do not claim a live deployment until an actual URL has been verified.

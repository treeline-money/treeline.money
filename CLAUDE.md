# Claude AI Development Guide

## Creating Pull Requests

This project uses Vercel for deployments, which automatically creates preview deployments for every PR. You don't need to take screenshots or record videos - the PR preview link will show the actual working site.

### PR Creation Workflow

```bash
# 1. Make your changes to the code
# ... edit files ...

# 2. Test locally (optional but recommended)
npm run dev
# Visit http://localhost:4321 to verify changes

# 3. Commit your changes
git add .
git commit -m "Description of changes"

# 4. Push to your branch
git push -u origin <branch-name>

# 5. Create PR with gh CLI
gh pr create --title "Your PR title" --body "$(cat <<EOF
## Summary
Brief description of what changed

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [x] Tested locally
- [x] Verified Vercel preview deployment

## Preview
The Vercel preview deployment will be available at the link below once the build completes.
EOF
)"
```

### After PR is Created

Vercel will automatically:
1. Build your changes
2. Deploy to a preview URL
3. Post a comment on the PR with the preview link

Reviewers can click the Vercel preview link to see the actual site with your changes - no screenshots needed!

### Tips

- **Keep PRs focused** - One feature or fix per PR
- **Test locally first** - Run `npm run dev` to verify changes work
- **Include context** - Explain why the change was made, not just what changed
- **Check the preview** - Verify the Vercel preview looks correct before requesting review

## Project Structure

This is an **Astro static site** for the Treeline landing page:
- Simple setup, fast builds
- Static pages (no database or backend)
- Deployed via Vercel

Main pages:
- Homepage (`/`)
- Blog (`/blog`)
- Plugin pages (`/plugins/*`)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

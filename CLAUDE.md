# Claude AI Development Guide

This guide enables autonomous UI testing, screenshot/video capture, and PR creation in Claude Code web sandboxes for the Treeline landing page.

## ⚠️ REQUIRED: PR Creation Workflow

**When creating ANY pull request, you MUST:**

1. ✅ **Run the dev server** - `npm run dev` to start the Astro landing page
2. ✅ **Verify the site loads** - Open browser or take screenshot to confirm it works
3. ✅ **Capture visual evidence** - Take screenshots and/or record GIF/video of the changes
4. ✅ **Upload to Supabase** - Use `./scripts/upload-media.sh` to get signed URLs
5. ✅ **Embed media in PR** - Include screenshots/videos in the PR description using markdown
6. ✅ **Use `gh pr create`** - Create PRs with visual evidence embedded

**Why this is required:**
- Provides visual proof the changes work without human testing
- Makes PRs merge-ready with confidence
- Creates a permanent visual record for future reference
- Shows how UI changes actually look

**Do NOT:**
- ❌ Create PRs without testing the site first
- ❌ Skip screenshots/videos for UI changes
- ❌ Create text-only PR descriptions for visual changes

---

## Quick Reference

```bash
# 1. Start the dev server in background
DISPLAY=:99 npm run dev &

# 2. Wait for server to start
sleep 5

# 3. Open in browser (if available) or take screenshot
# For headless browser screenshots:
DISPLAY=:99 scrot /tmp/screenshot.png

# 4. Record video/GIF (5 seconds)
DISPLAY=:99 ffmpeg -f x11grab -video_size 1920x1080 -framerate 15 -i :99 -t 5 -y /tmp/demo.gif

# 5. Upload to Supabase and get signed URL
./scripts/upload-media.sh /tmp/screenshot.png

# 6. Create PR with images
gh pr create --title "Your changes" --body "![Screenshot]($URL)"
```

## Environment Setup

The session-start hook (`.claude/hooks/session-start.sh`) automatically:
- Configures apt proxy for network access in sandboxed environments
- Installs required packages (scrot, ffmpeg, xdotool, xvfb, etc.)
- Starts Xvfb virtual display on `:99`
- Configures GitHub CLI authentication

**Required environment variables** (set in Claude Code web):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SECRET_KEY` - Secret key (not publishable) for storage access

**Optional:**
- `GH_TOKEN` - GitHub token for CLI authentication (auto-configured if set)

## Running the Astro Dev Server

```bash
# Install dependencies (if needed)
npm install

# Start dev server in background
DISPLAY=:99 npm run dev &

# Wait for server to start
sleep 5

# Verify it's running
curl -I http://localhost:4321 || curl -I http://localhost:3000
```

The dev server typically runs on `http://localhost:4321` (Astro default).

## Taking Screenshots

### Browser Screenshots (Preferred)

For the most accurate screenshots showing the actual rendered site, you can use a headless browser:

```bash
export DISPLAY=:99

# Using Firefox (if installed)
firefox --headless --screenshot /tmp/screenshot.png http://localhost:4321

# Using Chrome/Chromium (if installed)
chromium-browser --headless --screenshot=/tmp/screenshot.png http://localhost:4321
```

### Display Screenshots

Capture the entire virtual display:

```bash
export DISPLAY=:99

# Full screen screenshot
scrot /tmp/screenshot.png

# Screenshot with delay (gives time for things to load)
scrot -d 2 /tmp/screenshot.png
```

## Recording Videos

```bash
export DISPLAY=:99

# Record GIF (auto-plays in GitHub, good for short demos < 10s)
ffmpeg -f x11grab -video_size 1920x1080 -framerate 15 -i :99 \
  -t 5 -vf "fps=10,scale=960:-1" -y /tmp/demo.gif

# Record MP4 (better quality, larger files)
ffmpeg -f x11grab -video_size 1920x1080 -framerate 30 -i :99 \
  -t 10 -c:v libx264 -preset fast -crf 23 -y /tmp/demo.mp4
```

## Browser Automation (Optional)

If you need to interact with the page, you can use headless browser automation:

```bash
# Using xdotool for basic mouse/keyboard automation
export DISPLAY=:99

# Click at coordinates
xdotool mousemove 600 400 click 1

# Type text
xdotool type "Hello World"

# Keyboard shortcuts
xdotool key Tab Return
```

For more complex automation, consider:
- Playwright (headless browser automation)
- Puppeteer (Chrome DevTools Protocol)
- Selenium (browser automation)

## Uploading Media to Supabase

Media files are uploaded to Supabase Storage with signed URLs (1 year expiration).

### Using Helper Script (Recommended)

```bash
# Upload and get URL in one command
./scripts/upload-media.sh /tmp/screenshot.png
./scripts/upload-media.sh /tmp/demo.gif
```

The script automatically:
- Detects content type (PNG, GIF, MP4, etc.)
- Uploads to Supabase with retries (handles sandbox network issues)
- Generates a signed URL with 1-year expiration
- Returns the full URL ready to embed in markdown

### Manual Upload

```bash
# Generate unique filename
FILENAME="screenshot-$(date +%s).png"

# Upload file
curl -k --proxy-insecure -X POST "$SUPABASE_URL/storage/v1/object/pr-screenshots/$FILENAME" \
  -H "apikey: $SUPABASE_SECRET_KEY" \
  -H "Content-Type: image/png" \
  --data-binary @/tmp/screenshot.png

# Get signed URL (1 year = 31536000 seconds)
curl -k --proxy-insecure -X POST "$SUPABASE_URL/storage/v1/object/sign/pr-screenshots/$FILENAME" \
  -H "apikey: $SUPABASE_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"expiresIn": 31536000}'
```

## Creating PRs with Media

```bash
# Get media URLs first
IMG_URL=$(./scripts/upload-media.sh /tmp/screenshot.png)

# Create PR with embedded media
gh pr create --title "Update landing page hero section" --body "$(cat <<EOF
## Summary
Updated the hero section with new tagline and improved styling

## Screenshot
![Landing page hero section]($IMG_URL)

## Changes
- Updated hero tagline
- Improved responsive layout
- Added animation to CTA button

## Test Plan
- [x] Tested on desktop (screenshot above)
- [x] Verified responsive layout
- [x] Checked all links work
EOF
)"
```

### Updating PR Description

```bash
# Update PR body using gh api (more reliable in sandbox)
gh api repos/treeline-money/treeline.money/pulls/PR_NUMBER --method PATCH \
  -f body="## Summary
Updated design

## Screenshot
![Updated design]($IMG_URL)"
```

## Fallback: Commit Screenshots to Repo

If Supabase is not configured:

```bash
# Save to repo
mkdir -p .github/screenshots
cp /tmp/screenshot.png .github/screenshots/

# Commit
git add .github/screenshots/
git commit -m "Add PR screenshots"
git push

# Reference in PR
# ![Screenshot](https://raw.githubusercontent.com/treeline-money/treeline.money/branch/.github/screenshots/screenshot.png)
```

## Testing Workflow Example

Here's a complete workflow for testing a UI change:

```bash
# 1. Make your changes to the code
# ... edit files ...

# 2. Start dev server
DISPLAY=:99 npm run dev &
sleep 5

# 3. Take screenshots of different pages
DISPLAY=:99 scrot -d 2 /tmp/homepage.png

# 4. Test responsive layouts (if using browser)
firefox --headless --window-size=375,667 --screenshot /tmp/mobile.png http://localhost:4321

# 5. Record a quick demo
DISPLAY=:99 ffmpeg -f x11grab -video_size 1920x1080 -framerate 15 -i :99 -t 5 -y /tmp/demo.gif

# 6. Upload media
HOME_URL=$(./scripts/upload-media.sh /tmp/homepage.png)
MOBILE_URL=$(./scripts/upload-media.sh /tmp/mobile.png)
DEMO_URL=$(./scripts/upload-media.sh /tmp/demo.gif)

# 7. Create PR with all media
gh pr create --title "Redesign homepage hero" --body "$(cat <<EOF
## Summary
Complete redesign of the homepage hero section

## Desktop View
![Desktop homepage]($HOME_URL)

## Mobile View
![Mobile homepage]($MOBILE_URL)

## Demo
![Interaction demo]($DEMO_URL)

## Changes
- New hero layout
- Improved typography
- Better mobile responsiveness
- Added animations

## Test Plan
- [x] Desktop layout (Chrome, Firefox, Safari)
- [x] Mobile layout (375px, 768px, 1024px)
- [x] All interactive elements work
- [x] Animations smooth at 60fps
EOF
)"
```

## Troubleshooting

### Dev server won't start
- Check port isn't in use: `lsof -i :4321`
- Try different port: `npm run dev -- --port 3000`
- Check logs: `npm run dev` (without background)

### Screenshots are blank/black
- Ensure Xvfb is running: `pgrep Xvfb`
- Set DISPLAY: `export DISPLAY=:99`
- Wait longer before screenshot: `sleep 5 && scrot /tmp/test.png`
- Use browser screenshot instead of scrot

### Browser not installed
```bash
# Install Firefox
sudo apt-get install -y firefox

# Install Chromium
sudo apt-get install -y chromium-browser
```

### Network issues (apt-get fails)
- The session-start hook configures apt proxy automatically
- Manually configure if needed:
  ```bash
  echo "Acquire::http::Proxy \"$http_proxy\";" | sudo tee /etc/apt/apt.conf.d/proxy.conf
  ```

### Supabase upload fails
- **TLS errors**: Use `curl -k --proxy-insecure` (handled by script)
- **Auth errors**: Use `apikey` header, not `Authorization: Bearer`
- **Retries**: The upload script automatically retries up to 4 times
- **Fallback**: Commit screenshots to `.github/screenshots/` instead

### GitHub CLI issues
- **`gh pr edit` fails**: Use `gh api` directly (see examples above)
- **Auth fails**: Check `GH_TOKEN` environment variable is set

## Tips for Autonomous AI Workflows

### Best Practices
1. **Always start the dev server** before taking screenshots
2. **Wait for page to load** before capturing (use `sleep` or check with `curl`)
3. **Take multiple screenshots** for different pages/states
4. **Use GIFs for interactions** - shows animations and user flows
5. **Verify uploads succeeded** - check the URL returned is valid
6. **Include before/after** screenshots for UI changes

### Common Patterns

#### Testing a new component
```bash
# Start server
npm run dev &
sleep 5

# Navigate to component page (if using browser)
firefox --headless --screenshot /tmp/component.png http://localhost:4321/components/new-widget

# Upload and use in PR
URL=$(./scripts/upload-media.sh /tmp/component.png)
```

#### Testing responsive design
```bash
# Desktop
firefox --headless --window-size=1920,1080 --screenshot /tmp/desktop.png http://localhost:4321

# Tablet
firefox --headless --window-size=768,1024 --screenshot /tmp/tablet.png http://localhost:4321

# Mobile
firefox --headless --window-size=375,667 --screenshot /tmp/mobile.png http://localhost:4321
```

#### Recording user interaction
```bash
# Start recording first
DISPLAY=:99 ffmpeg -f x11grab -video_size 1920x1080 -framerate 15 -i :99 -t 10 /tmp/demo.gif &
RECORDING_PID=$!

# Perform actions (open browser, click things, etc.)
firefox http://localhost:4321 &
sleep 2
# ... xdotool commands for interaction ...

# Wait for recording to finish
wait $RECORDING_PID
```

## Project-Specific Notes

This is an **Astro static site** for the Treeline landing page:
- Simple setup (no complex build like Tauri)
- Fast dev server startup (< 5 seconds)
- Static pages - no database or backend needed
- Focus on visual testing of UI/UX changes

Main pages to test:
- Homepage (`/`)
- Blog (`/blog`)
- Plugin pages (`/plugins/*`)

When testing, pay attention to:
- Typography and spacing
- Responsive layouts (mobile, tablet, desktop)
- Images and assets loading correctly
- Navigation and links working
- Any animations or transitions

#!/bin/bash

# UI Testing Setup for Claude Code Web Sandbox
# This hook configures the environment for automated UI testing of the Astro landing page

set -e

echo "🚀 Setting up UI testing environment..."

# 1. Configure apt proxy for sandbox network access
if [ -n "$http_proxy" ]; then
    echo "📡 Configuring apt proxy..."
    echo "Acquire::http::Proxy \"$http_proxy\";" | sudo tee /etc/apt/apt.conf.d/proxy.conf > /dev/null
    echo "Acquire::https::Proxy \"$http_proxy\";" | sudo tee -a /etc/apt/apt.conf.d/proxy.conf > /dev/null
fi

# 2. Install required packages
echo "📦 Installing UI testing tools (scrot, ffmpeg, xdotool, xvfb)..."
sudo apt-get update -qq
sudo apt-get install -y -qq scrot ffmpeg xdotool xvfb dbus-x11 > /dev/null 2>&1

# 3. Start Xvfb (X virtual framebuffer) on display :99
echo "🖥️  Starting Xvfb on display :99..."
if ! pgrep Xvfb > /dev/null; then
    Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
    sleep 2
    echo "✅ Xvfb started"
else
    echo "✅ Xvfb already running"
fi

# 4. Verify DISPLAY is set
export DISPLAY=:99
echo "export DISPLAY=:99" >> ~/.bashrc

# 5. Configure GitHub CLI (if GH_TOKEN is set)
if [ -n "$GH_TOKEN" ]; then
    echo "🔑 Configuring GitHub CLI..."
    echo "$GH_TOKEN" | gh auth login --with-token 2>/dev/null || true
    gh auth status 2>/dev/null && echo "✅ GitHub CLI authenticated" || echo "⚠️  GitHub CLI auth check skipped"
fi

# 6. Verify Supabase environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SECRET_KEY" ]; then
    echo "⚠️  WARNING: Supabase environment variables not set"
    echo "   Set SUPABASE_URL and SUPABASE_SECRET_KEY in Claude Code settings"
    echo "   Screenshots will need to be committed to the repo instead"
else
    echo "✅ Supabase environment configured"
fi

echo ""
echo "✅ UI testing environment ready!"
echo ""
echo "Quick start:"
echo "  1. npm run dev                      # Start Astro dev server"
echo "  2. DISPLAY=:99 scrot /tmp/test.png  # Take screenshot"
echo "  3. ./scripts/upload-media.sh /tmp/test.png  # Upload to Supabase"
echo ""

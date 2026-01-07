#!/bin/bash

# Upload media files to Supabase Storage and get signed URLs
# Usage: ./scripts/upload-media.sh /path/to/file.png

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <file_path>"
    echo "Example: $0 /tmp/screenshot.png"
    exit 1
fi

FILE_PATH="$1"
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File not found: $FILE_PATH"
    exit 1
fi

# Check environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SECRET_KEY" ]; then
    echo "Error: SUPABASE_URL and SUPABASE_SECRET_KEY environment variables must be set"
    echo "Set these in Claude Code web settings"
    exit 1
fi

# Generate unique filename
ORIGINAL_NAME=$(basename "$FILE_PATH")
EXTENSION="${ORIGINAL_NAME##*.}"
TIMESTAMP=$(date +%s)
FILENAME="screenshot-${TIMESTAMP}.${EXTENSION}"

# Detect content type
case "$EXTENSION" in
    png) CONTENT_TYPE="image/png" ;;
    jpg|jpeg) CONTENT_TYPE="image/jpeg" ;;
    gif) CONTENT_TYPE="image/gif" ;;
    mp4) CONTENT_TYPE="video/mp4" ;;
    webm) CONTENT_TYPE="video/webm" ;;
    *) CONTENT_TYPE="application/octet-stream" ;;
esac

echo "📤 Uploading $ORIGINAL_NAME to Supabase..."

# Upload with retries (sandbox environments can have intermittent TLS issues)
MAX_RETRIES=4
RETRY_COUNT=0
UPLOAD_SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if [ $RETRY_COUNT -gt 0 ]; then
        WAIT_TIME=$((2 ** RETRY_COUNT))
        echo "⏳ Retry $RETRY_COUNT/$MAX_RETRIES after ${WAIT_TIME}s..."
        sleep $WAIT_TIME
    fi

    # Upload file (use -k and --proxy-insecure for sandbox environments)
    if curl -k --proxy-insecure -s -X POST \
        "$SUPABASE_URL/storage/v1/object/pr-screenshots/$FILENAME" \
        -H "apikey: $SUPABASE_SECRET_KEY" \
        -H "Content-Type: $CONTENT_TYPE" \
        --data-binary @"$FILE_PATH" > /tmp/upload-response.json 2>&1; then

        # Check if upload was successful (non-error response)
        if ! grep -q "error" /tmp/upload-response.json; then
            UPLOAD_SUCCESS=true
            break
        fi
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ "$UPLOAD_SUCCESS" = false ]; then
    echo "❌ Upload failed after $MAX_RETRIES retries"
    cat /tmp/upload-response.json
    exit 1
fi

echo "✅ Upload successful"

# Get signed URL (1 year expiration = 31536000 seconds)
echo "🔗 Generating signed URL..."

SIGN_SUCCESS=false
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if [ $RETRY_COUNT -gt 0 ]; then
        WAIT_TIME=$((2 ** RETRY_COUNT))
        echo "⏳ Retry $RETRY_COUNT/$MAX_RETRIES after ${WAIT_TIME}s..."
        sleep $WAIT_TIME
    fi

    if curl -k --proxy-insecure -s -X POST \
        "$SUPABASE_URL/storage/v1/object/sign/pr-screenshots/$FILENAME" \
        -H "apikey: $SUPABASE_SECRET_KEY" \
        -H "Content-Type: application/json" \
        -d '{"expiresIn": 31536000}' > /tmp/sign-response.json 2>&1; then

        if ! grep -q "error" /tmp/sign-response.json; then
            SIGN_SUCCESS=true
            break
        fi
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ "$SIGN_SUCCESS" = false ]; then
    echo "❌ Failed to generate signed URL after $MAX_RETRIES retries"
    cat /tmp/sign-response.json
    exit 1
fi

# Extract signed path and construct full URL
SIGNED_PATH=$(grep -o '"signedURL":"[^"]*"' /tmp/sign-response.json | cut -d'"' -f4)

if [ -z "$SIGNED_PATH" ]; then
    echo "❌ Failed to extract signed URL from response"
    cat /tmp/sign-response.json
    exit 1
fi

# Construct full URL (signed path needs /storage/v1 prefix)
FULL_URL="${SUPABASE_URL}/storage/v1${SIGNED_PATH}"

echo "✅ Signed URL generated"
echo ""
echo "$FULL_URL"
echo ""

# Clean up
rm -f /tmp/upload-response.json /tmp/sign-response.json

exit 0

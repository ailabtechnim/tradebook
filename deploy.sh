#!/bin/bash

# TradeBook Deployment Script
# Usage: ./deploy.sh [vercel|netlify|railway|docker]

set -e

PLATFORM=${1:-vercel}

echo "🚀 TradeBook Deployment Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔨 Building for production..."
npm run build

echo ""
echo "✅ Build successful!"
echo ""

case $PLATFORM in
    vercel)
        echo "🌐 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        echo ""
        echo "🎉 Deployed to Vercel!"
        echo "   Your app will be available at the URL shown above."
        ;;
    
    netlify)
        echo "🌐 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        echo ""
        echo "🎉 Deployed to Netlify!"
        ;;
    
    railway)
        echo "🌐 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "📦 Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        railway login
        railway init
        railway up
        echo ""
        echo "🎉 Deployed to Railway!"
        ;;
    
    docker)
        echo "🐳 Building Docker image..."
        docker build -t tradebook .
        echo ""
        echo "✅ Docker image built successfully!"
        echo ""
        echo "To run locally:"
        echo "  docker run -p 3000:3000 tradebook"
        echo ""
        echo "To push to Docker Hub:"
        echo "  docker tag tradebook yourusername/tradebook:latest"
        echo "  docker push yourusername/tradebook:latest"
        ;;
    
    local)
        echo "🖥️  Starting local production server..."
        npm start
        ;;
    
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo ""
        echo "Usage: ./deploy.sh [vercel|netlify|railway|docker|local]"
        echo ""
        echo "Platforms:"
        echo "  vercel   - Deploy to Vercel (recommended, free)"
        echo "  netlify  - Deploy to Netlify (free)"
        echo "  railway  - Deploy to Railway"
        echo "  docker   - Build Docker image"
        echo "  local    - Start local production server"
        exit 1
        ;;
esac

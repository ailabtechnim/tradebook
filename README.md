# 🏪 TradeBook — Africa's Wholesale Social Commerce Platform

> **Buy Wholesale. Direct from Manufacturers. Transparent Prices.**

TradeBook is a social-commerce B2B platform connecting manufacturers directly with retailers through transparent wholesale pricing. Built for Rwanda and designed to scale across Africa and globally.

---

## 🌟 Key Features

### For Retailers
- **Browse Wholesale Products** — See factory-direct prices, compare across manufacturers
- **Follow Manufacturers** — Get price alerts, new product notifications, stories
- **Group Buying** — Pool orders with other retailers for bulk discounts
- **Escrow Protection** — Payments held securely until delivery confirmed
- **Suggested Retail Price** — See manufacturer-recommended retail prices
- **Volume Discounts** — Tiered pricing based on order quantity

### For Manufacturers
- **Facebook-style Profiles** — Showcase products, share stories, build following
- **Transparent Pricing** — Publish wholesale prices openly to build trust
- **Price Guarantee** — Commit to stable prices for 30-90 days
- **Analytics Dashboard** — Track followers, orders, fulfillment rates
- **Manufacturer Stories** — Short-form video/image content
- **WhatsApp Integration** — Direct communication with buyers

### Platform Features
- 🔒 **Escrow Payment System** — 100% buyer protection
- ✅ **Verified Manufacturers** — Physical verification, business registration
- 🤝 **Group Buying** — Small retailers unite for bulk discounts
- 📊 **Price Transparency** — Wholesale vs retail pricing visible
- 📱 **Mobile-First** — Responsive design for all devices
- 🌍 **Multi-Language** — English, French, Kinyarwanda support
- 💳 **Local Payments** — MTN MoMo, Airtel Money, Visa, Bank Transfer

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommend 20+)
- npm or yarn

### Installation

```bash
# Clone or copy the project
cd tradebook

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
tradebook/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout
│   │   ├── client-layout.tsx  # Client-side layout with providers
│   │   ├── globals.css        # Global styles
│   │   ├── products/          # Products pages
│   │   │   ├── page.tsx       # Product catalog
│   │   │   └── [id]/page.tsx  # Product detail
│   │   ├── manufacturers/     # Manufacturers pages
│   │   │   ├── page.tsx       # Manufacturer directory
│   │   │   └── [id]/page.tsx  # Manufacturer profile
│   │   ├── group-buy/         # Group buying page
│   │   ├── stories/           # Manufacturer stories
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout with escrow
│   │   └── dashboard/         # User dashboard
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Toast, AuthModal
│   ├── context/
│   │   └── AppContext.tsx      # Global state management
│   └── data/
│       ├── types.ts           # TypeScript interfaces
│       └── mockData.ts        # Mock data (Rwanda manufacturers)
├── vercel.json                # Vercel deployment config
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
└── package.json
```

---

## 🌍 Deployment

### Option 1: Vercel (Recommended — Free)

The easiest way to deploy TradeBook:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts. That's it!
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments.

### Option 2: Netlify (Free)

1. Build the project: `npm run build`
2. Drag the `.next` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Or connect your GitHub repo at [netlify.com](https://netlify.com)

### Option 3: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 4: DigitalOcean App Platform

1. Push code to GitHub
2. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
3. Connect your repo and deploy

### Option 5: Self-Hosted (VPS)

```bash
# On your server (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Copy project files to server
scp -r tradebook/ user@your-server:/var/www/tradebook/

# On server
cd /var/www/tradebook
npm install
npm run build

# Run with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "tradebook" -- start
pm2 startup
pm2 save
```

### Option 6: Docker

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t tradebook .
docker run -p 3000:3000 tradebook
```

---

## 🔧 Environment Variables

Create a `.env.local` file for production:

```env
# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=TradeBook

# Payments (when integrating real payment providers)
MTN_MOMO_API_KEY=your_key
AIRTEL_MONEY_API_KEY=your_key
STRIPE_SECRET_KEY=your_key

# Database (when adding real backend)
DATABASE_URL=your_database_url

# WhatsApp Business API
WHATSAPP_API_TOKEN=your_token
```

---

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- [x] Homepage with all sections
- [x] Product catalog with search & filters
- [x] Product detail with tiered pricing
- [x] Manufacturer directory & profiles
- [x] Group buying system
- [x] Shopping cart & checkout
- [x] Escrow payment flow
- [x] User dashboard
- [x] Manufacturer stories
- [x] Follow/unfollow system

### Phase 2: Backend Integration
- [ ] Real database (PostgreSQL/MongoDB)
- [ ] User authentication (NextAuth.js)
- [ ] Real payment integration (MTN MoMo API, Stripe)
- [ ] WhatsApp Business API integration
- [ ] Email notifications
- [ ] Image upload (Cloudinary/S3)

### Phase 3: Advanced Features
- [ ] Real-time chat between buyers and manufacturers
- [ ] AI-powered price recommendations
- [ ] Logistics tracking integration
- [ ] Mobile app (React Native)
- [ ] Multi-language (i18n) full support
- [ ] Review & rating system
- [ ] Dispute resolution system

### Phase 4: Scale
- [ ] East African expansion (Kenya, Uganda, Tanzania)
- [ ] Pan-African expansion
- [ ] Cross-border payments
- [ ] Import/export documentation
- [ ] API for third-party integrations

---

## 💰 Business Model

| Revenue Stream | Description |
|---------------|-------------|
| **Manufacturer Subscriptions** | $10-50/month for verified profiles |
| **Transaction Fees** | 1.5% on each order |
| **Featured Listings** | Prominent placement in search |
| **Advertising** | Banner ads, promoted products |
| **Premium Analytics** | Market data for manufacturers |

---

## 🤝 Contributing

This is an open-source project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this for your own projects.

---

## 📞 Contact

- **Website**: [tradebook.rw](https://tradebook.rw)
- **Email**: hello@tradebook.rw
- **WhatsApp**: +250 788 000 000
- **Location**: Kigali, Rwanda

---

**Built with ❤️ in Rwanda 🇷🇼**

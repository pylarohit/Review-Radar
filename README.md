██████╗ ███████╗██╗   ██╗██╗███████╗██╗    ██╗    ██████╗  █████╗ ██████╗  █████╗ ██████╗ 
██╔══██╗██╔════╝██║   ██║██║██╔════╝██║    ██║    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
██████╔╝█████╗  ██║   ██║██║█████╗  ██║ █╗ ██║    ██████╔╝███████║██║  ██║███████║██████╔╝
██╔══██╗██╔══╝  ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║    ██╔══██╗██╔══██║██║  ██║██╔══██║██╔══██╗
██║  ██║███████╗ ╚████╔╝ ██║███████╗╚███╔███╔╝    ██║  ██║██║  ██║██████╔╝██║  ██║██║  ██║
╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
AI-Powered Product Review Sentiment Analyzer
Personalized. Intelligent. Instant.

Next.js TypeScript Prisma MongoDB Gemini AI TailwindCSS

✦ What is Review Radar?
Review Radar is an intelligent product analysis platform that automatically fetches, extracts, and summarizes customer reviews from any product URL. Powered by Gemini AI, it generates a comprehensive sentiment score, breakdowns of pros and cons, synthesizes key opinion highlights, and produces realistic verified purchase reviews.

Whether you're shopping online, looking for genuine customer feedback, or analyzing competitor products — Review Radar saves you time by cutting straight through the noise to deliver the insights that matter.

✦ Core Features
🧠 AI Sentiment Analysis
Powered by the Gemini 2.5 Flash API. Review Radar parses product pages and synthesizes customer opinions, providing an exact percentage split of Positive, Neutral, and Negative sentiments.

🗺️ Interactive Dashboard
A modern, dynamic user dashboard showing all your analyzed products. Filter by categories, search through previous scans, view comprehensive analysis reports, and browse individual AI-synthesized verified reviews.

🎯 Category-specific Highlights
Highlights key pros and cons in an intuitive side-by-side card list, letting you instantly evaluate a product's main selling points and potential deal-breakers.

🔐 Secure Custom Authentication
Includes custom password hashing (`bcryptjs`), JWT-based secure sessions, cookie verification middleware, and a sleek "Remember Me" email auto-fill flow for rapid next-time logins.

📊 User-specific Data Isolation
Each product scan is tied to the authenticated user's profile, ensuring that your dashboard contains only the products and reports that you care about.

✦ Tech Stack
| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB (via Prisma ORM) |
| **AI Integration** | Gemini 2.5 Flash API (Google Generative AI) |
| **Styling** | TailwindCSS v4 + Vanilla CSS Variables |
| **Authentication** | Custom JWT Session Cookies (`jose`) + Password Hashing (`bcryptjs`) |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

✦ Architecture
┌─────────────────────────────────────────────────────────────┐
│                    Review Radar Platform                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Next.js App Router                                        │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐     │
│   │  Landing    │  │  Dashboard  │  │ History/Scanner │     │
│   └──────┬──────┘  └──────┬──────┘  └────────┬────────┘     │
│          │                │                   │             │
│   ┌──────▼──────────────────────────────────▼───────────┐   │
│   │           Next.js Server Actions & API Routes       │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                           │                                 │
│   ┌───────────────────────▼──────────────────────────────┐  │
│   │                Prisma Client & Middleware            │  │
│   └──┬────────────┬──────────────────┬───────────────────┘  │
│      │            │                  │                      │
│   ┌──▼───┐  ┌─────▼─────┐   ┌───────▼───────┐               │
│   │ Auth │  │ Gemini AI │   │ MongoDB Atlas │               │
│   │      │  │ API Key   │   │  Database     │               │
│   └──┬───┘  └─────┬─────┘   └───────┬───────┘               │
│      │            │                  │                      │
│   ┌──▼────────────▼──────────────────▼───────────────────┐  │
│   │                  Client localStorage                 │  │
│   │              (User State & Prefill Email)            │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

✦ Project Structure
review-radar/
├── prisma/
│   └── schema.prisma        # Database schema definitions
├── public/
│   ├── darkLogo.png         # Light-theme compatible logo
│   └── lightLogo.png        # Dark-theme compatible logo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts  # Gemini review extraction API
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── signup/
│   │   │   │       └── route.ts
│   │   │   └── products/
│   │   │   │   └── route.ts
│   │   │   └── reviews/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Main dashboard page
│   │   ├── history/
│   │   │   └── page.tsx      # History / new review analysis trigger
│   │   ├── login/
│   │   │   └── page.tsx      # Login form router page
│   │   ├── signup/
│   │   │   └── page.tsx      # Signup page
│   │   ├── globals.css       # Core design tokens and imports
│   │   ├── layout.tsx        # Base page layout with Toast notifications
│   │   └── page.tsx          # Default landing home page
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthForm.tsx  # Shared Auth login/signup with Remember Me
│   │   ├── landing/          # Core landing page items (Hero, Navbar, Footer)
│   │   ├── main/             # Profile menu, logout button, layout elements
│   │   └── ui/               # Primary components (DashboardView, Logo, Navbar, ProductAnalyzer)
│   │
│   └── lib/
│       ├── auth.ts           # Token verification & JWT helpers
│       ├── prisma.ts         # Prisma client singleton
│       └── utils.ts          # Utility classes (cn, etc.)
├── middleware.ts             # Auth check and route protection middleware
├── package.json
└── tailwind.config.ts

✦ Gemini Integration
Review Radar uses the Gemini API to analyze URLs and return structured JSON conforming to a specific database schema.

```typescript
// src/app/api/analyze/route.ts
const prompt = `
  You are a professional product reviewer and sentiment analyst.
  Analyze the following product URL and synthesize customer feedback and reviews.
  Product URL: "${productUrl}"

  Please generate a realistic set of customer reviews, pros, cons, and overall sentiment analysis.
  You must respond with raw JSON only.
  
  The JSON must strictly conform to the following schema:
  {
    "name": "Detailed Product Name",
    "category": "A single word category name",
    "description": "A concise overview.",
    "overallSentiment": "Positive | Neutral | Negative | Mixed",
    "positivePercent": 80,
    "neutralPercent": 10,
    "negativePercent": 10,
    "summary": "Detailed summary...",
    "pros": ["Pro 1", "Pro 2"],
    "cons": ["Con 1", "Con 2"],
    "reviews": [
      {
        "reviewer": "John Doe",
        "rating": 5,
        "reviewText": "Detailed feedback...",
        "sentiment": "positive | neutral | negative"
      }
    ]
  }
`;
```

✦ Getting Started
### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Gemini API Key (obtain from Google AI Studio)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/review-radar.git
   cd review-radar
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the root:
   ```env
   DATABASE_URL="your_mongodb_connection_string"
   JWT_SECRET="your_custom_jwt_secret_key"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

### Database Setup
1. Push the database schema to your MongoDB database using Prisma:
   ```bash
   npx prisma db push
   ```
2. Generate the Prisma Client library:
   ```bash
   npx prisma generate
   ```

### Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

✦ Key Data Models
Review Radar uses MongoDB via Prisma. Below are the key data models configured in `prisma/schema.prisma`:

```prisma
model User {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  email     String    @unique
  password  String
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  category    String
  description String?
  imageUrl    String?
  productUrl  String?
  userId      String     @db.ObjectId
  user        User       @relation(fields: [userId], references: [id])
  reviews     Review[]
  analyses    Analysis[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Review {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  productId  String   @db.ObjectId
  product    Product  @relation(fields: [productId], references: [id])
  reviewer   String?
  rating     Float
  reviewText String
  sentiment  String?
  createdAt  DateTime @default(now())
}
```

✦ Roadmap
- [x] JWT Session Authentication Flow
- [x] Remember Me Auto-fill login memory
- [x] Gemini-powered Review Sentiment Scraper
- [x] Responsive Dashboard Workspace & Categorization
- [x] Multi-theme (Light/Dark mode) responsive support
- [ ] Export analysis reports to PDF / Excel
- [ ] Browser Extension for instant scanning directly on Amazon/eBay pages
- [ ] Live charts & Graphs for sentiment historical tracking
- [ ] Email alerts when a product's average score drops

✦ Contributing
Contributions are welcome! Please open an issue or pull request to discuss potential changes.

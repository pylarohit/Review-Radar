# 🔍 Review Radar

**AI-Powered Product Review Analysis Platform**

Review Radar is a full-stack web application that helps users analyze product reviews, understand customer sentiment, identify common pros and cons, and manage previously analyzed products through a personalized dashboard.

Built with **Next.js, TypeScript, Prisma, MongoDB, Gemini AI, and Tailwind CSS**.

---

## ✨ Overview

Online products can have hundreds or thousands of customer reviews, making it difficult for users to understand the overall customer opinion.

Review Radar simplifies this process by using AI to generate structured product insights such as:

- Overall sentiment
- Positive, neutral, and negative percentages
- Executive summary
- Common pros and cons
- Review-level sentiment
- Personalized analysis history

Each analyzed product is associated with the authenticated user, allowing users to access only their own product analysis data.

---

## 🚀 Features

### 🧠 AI-Powered Review Analysis

Review Radar integrates Gemini AI to process product information and review data and return structured analysis results.

The generated analysis includes:

- Overall sentiment
- Positive sentiment percentage
- Neutral sentiment percentage
- Negative sentiment percentage
- Product summary
- Common advantages
- Common disadvantages
- Individual review sentiment

---

### 📊 Personalized Dashboard

Authenticated users can access a dashboard containing their analyzed products.

Users can:

- Analyze a new product
- View previously analyzed products
- Search products
- Filter products by category
- Open detailed analysis reports
- View sentiment results
- Browse associated customer reviews

---

### 🎯 Pros and Cons Analysis

Review Radar summarizes recurring customer opinions into simple insights.

Users can quickly understand:

**Pros**

- Frequently appreciated product features
- Positive customer experiences
- Strong product qualities

**Cons**

- Common complaints
- Product limitations
- Frequently reported problems

---

### 🔐 Custom Authentication

Review Radar includes a custom authentication system using:

- Password hashing with `bcryptjs`
- JWT session tokens using `jose`
- HTTP cookies for session management
- Protected application routes
- User-specific database queries
- Remember Me email prefill

---

### 👤 User-Specific Data Isolation

Each product is associated with a user.

The application filters database queries using the authenticated user's ID.

```text
User
 │
 ├── Product
 │     ├── Reviews
 │     └── Analysis
 │
 ├── Product
 │     ├── Reviews
 │     └── Analysis
 │
 └── Product

| Layer             | Technology              |
| ----------------- | ----------------------- |
| Framework         | Next.js 16 (App Router) |
| Language          | TypeScript              |
| Frontend          | React                   |
| Styling           | Tailwind CSS v4         |
| Database          | MongoDB Atlas           |
| ORM               | Prisma ORM              |
| AI Integration    | Gemini API              |
| Authentication    | JWT (`jose`)            |
| Password Security | `bcryptjs`              |
| Icons             | Lucide React            |
| Notifications     | React Hot Toast         |


                         USER
                           │
                           ▼
                  Next.js Application
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼

      Landing Page    Authentication     Dashboard
                           │                │
                           ▼                ▼
                    Login / Signup    Product Analyzer
                           │                │
                           ▼                ▼
                     JWT Session       API Routes
                           │                │
                           └──────┬─────────┘
                                  │
                                  ▼
                           Server Logic
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼

                 Prisma       Gemini API    Authentication
                    │
                    ▼
              MongoDB Atlas
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼

        Users    Products   Reviews
                      │
                      ▼
                   Analysis


⚙️ Getting Started
Prerequisites

Install the following:

Node.js 18 or later
npm
Git
MongoDB Atlas account or local MongoDB server
Gemini API key




1. Clone the Repository
git clone <YOUR_REPOSITORY_URL>

cd review-radar
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file in the project root.

DATABASE_URL="YOUR_MONGODB_CONNECTION_STRING"

JWT_SECRET="YOUR_SECURE_RANDOM_SECRET"

GEMINI_API_KEY="YOUR_GEMINI_API_KEY"



4. Configure Prisma

Generate Prisma Client:

npx prisma generate

Push the database schema:

npx prisma db push
5. Start the Development Server
npm run dev

# ESM AI RAG

A modern AI-powered SaaS platform built with Next.js 15 and React 19, featuring modular architecture, advanced UI with TailwindCSS and Shadcn/UI, and robust data management using Prisma and PostgreSQL.

## 🚀 Project Overview

This project leverages the latest Next.js app directory, React Server/Client Components, and a clean, scalable codebase for rapid development and deployment of AI-driven features.

## ✨ Features

- Modular feature-based structure for scalability
- AI chat and file management
- History and tagging system
- Pinecone vector search integration
- Modern UI with TailwindCSS and Shadcn/UI
- Type-safe forms with Zod
- PostgreSQL database via Prisma ORM
- Streaming and optimized loading

## 🛠️ Tech Stack

- **Framework:** Next.js 15, React 19
- **Styling:** TailwindCSS, Shadcn/UI
- **Database:** PostgreSQL (via Prisma)
- **AI/Vector Search:** Pinecone
- **Validation:** Zod
- **State/Query:** React Query, NUQS
- **Forms:** React Hook Form, Zod

## 📁 Project Structure (excerpt)

```
app/
  (navigation)/
  chat/
  files/
  api/
    chat/
    pinecone/
    tags/
prisma/
  schema/
src/
  components/
  features/
  hooks/
  lib/
  types/
```

## 🏁 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Run the development server:**
   ```bash
   pnpm dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

You can start editing the app by modifying files in `app/` or `src/`.

## 🛡️ Environment Variables

Create a `.env` file at the root of the project with the following variables (example):

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

## Pinecone
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
INDEX_INIT_TIMEOUT=10000

OPENAI_API_KEY=sk-proj-jzehfiuehf

```

Adjust the values as needed for your local or production environment. Refer to the documentation for each service for more details.

## 📜 Scripts

- `pnpm dev`

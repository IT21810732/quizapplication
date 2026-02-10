# Quiz Optimizer App

A full-stack web application where users can attempt quizzes. Each quiz has multiple questions with a score and time required. The app also suggests the optimal set of questions a user can answer within a given time limit to maximize total score.

---

## 🧰 Tech Stack

- **Frontend:** Next.js (App Router) + TypeScript + React  
- **Backend/API:** Next.js API routes + Supabase  
- **Database:** Supabase PostgreSQL  
- **Authentication:** Supabase Auth (optional, implemented)  
- **Algorithm:** Dynamic Programming (0/1 Knapsack for optimal question selection)

---

## ⚡ Features Implemented

- List all quizzes  
- Display quiz questions  
- Submit user answers  
- Compute optimal question set based on a time limit  

---

## 🛠️ Setup Instructions

1. **Clone Repository**

```bash
git clone [https://github.com/IT21810732/quizapplication.git]
cd quizapplication 
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
Create a .env.local file at the root of the project:

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY

4. **Run Development Server**
```bash
npm run dev
```






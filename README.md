# Move37 — Polling Backend (Internshala assignment Move 37 Productions)
- A real-time polling backend built with Node.js, Express, Prisma ORM, PostgreSQL, and Socket.IO.
- Users can create polls, vote, and see live poll results without refreshing.
- Backend API using Node.js, Express, PostgreSQL, Prisma and Socket.IO for real-time votes.

# Features
- User authentication (signup/login with hashed passwords using bcrypt)
- Create, fetch, and publish polls -- REST API
- Cast votes (one per poll per user)
- Real-time poll updates via Socket.IO so that user viewing do have to refresh.
- PostgreSQL database managed with Prisma

# Tech Stack
- Backend: Node.js, Express.js
- Database: PostgreSQL
- ORM: Prisma
- Real-time: Socket.IO
- Other: bcrypt, dotenv, cors

# Folder Structure
- .
- ├── prisma/
- │   └── schema.prisma
- ├── src/
- │   ├── routes/
- │   │   ├── users.js
- │   │   ├── polls.j
- │   │   └── votes.js
- │   └── index.js
- ├── .env
- ├── package.json
- └── README.md

## Requirements
- Node.js 18+
- PostgreSQL database
- DATABASE_URL env var pointing to your PostgreSQL database

## Setup
1. Clone repo git remote add origin https://github.com/alamehtab/Move37-Real-Time-Polling.git
2. cd MOVE37-Real-Time-Polling
3. npm install or npm i to install dependencies and node modules
4. Set DATABASE_URL and PORT in .env
- DATABASE_URL="postgresql://<username>:<password>@localhost:5432/postgres" (insert user and password)
- PORT=4000
5. Setup database prisma
- npx prisma generate
- npx prisma migrate dev --name init
6. Start the server by running -- npm run dev


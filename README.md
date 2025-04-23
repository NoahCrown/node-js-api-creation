# Node.js API Creation Assessment

Answer to the assessment for the software developer position

## Features

- CRUD on Todo list

## 📋 Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v17 or later)
- Docker (optional)
- npm or yarn package manager

# 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**: Jest
- **Validation**: express-validator
- **Documentation**: Postman
- **Code Quality**: ESLint, Prettier

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files and environment setup
├── modules/         # Routes, Controller, and Services
├── middlewares/     # Custom middleware functions
├── schemas/         # Request validation schemas
├── utils/           # Utility functions and helpers
├── prisma/          # Database models and interfaces
└── tests/            # Test files
```

# 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd node-js-api-creation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration.

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

# 🧪 Running Tests

```bash
# Run all tests
npm test


## 📝 API Endpoints

- `POST /api/v1/todo/` - Create a new user
- `GET /api/v1/todo/` - Get all users
- `GET /api/v1/todo/:id` - Get user by ID
- `PUT /api/v1/todo/:id` - Update user
- `DELETE /api/v1/todo/:id` - Delete user
```

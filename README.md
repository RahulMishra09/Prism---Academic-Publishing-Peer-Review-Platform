# Prism - Academic Publishing & Peer Review Platform

**Prism** symbolizes how peer review works: one paper, multiple perspectives. Like light through a prism, research is examined from different angles by independent reviewers, revealing its complete spectrum of quality, validity, and contribution to the field.

## Overview

Prism is a comprehensive academic publishing and peer review platform designed to streamline the research paper submission, review, and approval process. It supports multiple user roles with distinct permissions and implements a double-blind peer review system.

## Features

- **Multi-Role System**: READER, AUTHOR, REVIEWER, EDITOR, and ADMIN roles
- **Paper Lifecycle Management**: Draft → Submit → Review → Approve/Reject workflow
- **Double-Blind Peer Review**: Reviewer identity hidden from authors
- **Reviewer Assignment**: Editors can assign multiple reviewers to papers
- **Comment System**: Threaded discussions on approved papers
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Granular permissions for different user types

## Tech Stack

### Backend
- **Runtime**: Node.js (ESM)
- **Language**: TypeScript (strict mode)
- **Framework**: Express.js v5
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma v7
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Security**: Helmet (security headers), CORS
- **Logging**: Morgan

## Project Structure

```
prism/
├── backend/
│   ├── src/
│   │   ├── app.ts                    # Express app setup
│   │   ├── server.ts                 # Entry point
│   │   ├── config/                   # Configuration files
│   │   ├── middleware/               # Authentication, roles, error handling
│   │   ├── modules/                  # Feature modules (auth, papers, reviews, editor, comments)
│   │   ├── types/                    # TypeScript type definitions
│   │   └── utils/                    # Helper functions
│   ├── prisma/
│   │   └── schema.prisma             # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── ARCHITECTURE.md               # Detailed technical documentation
└── README.md                         # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database (or Neon account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Prism---Academic-Publishing-Peer-Review-Platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   JWT_SECRET="your-secure-secret-key"
   PORT=5000
   NODE_ENV=development
   JWT_EXPIRES_IN=7d
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000` (or the port specified in your `.env` file).

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npx prisma studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and receive JWT token

### Papers (`/papers`)
- `POST /papers` - Create new paper (AUTHOR)
- `GET /papers/my` - List own papers (AUTHOR)
- `GET /papers` - List papers (role-filtered visibility)
- `GET /papers/:id` - Get single paper details
- `PATCH /papers/:id` - Update draft paper (AUTHOR)
- `POST /papers/:id/submit` - Submit paper for review (AUTHOR)
- `POST /papers/:id/approve` - Approve paper (EDITOR/ADMIN)
- `POST /papers/:id/reject` - Reject paper with reason (EDITOR/ADMIN)

### Reviews (`/reviews`)
- `GET /reviews/my-assignments` - List assigned papers (REVIEWER)
- `POST /reviews/assignments/:assignmentId` - Submit review (REVIEWER)
- `GET /reviews/my-reviews` - List submitted reviews (REVIEWER)
- `GET /reviews/papers/:paperId` - Get all reviews for a paper

### Editor (`/editor`)
- `GET /editor/papers` - List all papers with filters (EDITOR/ADMIN)
- `GET /editor/papers/:paperId` - Get paper details with reviews
- `POST /editor/papers/:paperId/assign-reviewer` - Assign reviewer to paper
- `GET /editor/papers/:paperId/assignments` - List paper assignments
- `DELETE /editor/papers/:paperId/assignments/:reviewerId` - Remove pending assignment

### Comments (`/comments`)
- `GET /comments/papers/:paperId` - Get comments for a paper
- `POST /comments/papers/:paperId` - Post comment or reply
- `DELETE /comments/:commentId` - Delete comment

For detailed API documentation, refer to [ARCHITECTURE.md](backend/ARCHITECTURE.md).

## User Roles & Permissions

| Role | Description |
|------|-------------|
| **READER** | Can view approved papers and post comments |
| **AUTHOR** | Can create, edit, and submit papers |
| **REVIEWER** | Can review papers assigned by editors |
| **EDITOR** | Can manage papers, assign reviewers, approve/reject submissions |
| **ADMIN** | Full system access (future: user management) |

## Paper Workflow

```
DRAFT → SUBMITTED → [REVIEW PROCESS] → APPROVED/REJECTED
```

1. **AUTHOR** creates paper (status: DRAFT)
2. **AUTHOR** can edit draft and submit when ready (status: SUBMITTED)
3. **EDITOR** assigns reviewers
4. **REVIEWERS** submit reviews (strengths, weaknesses, score, recommendation)
5. **EDITOR** approves or rejects based on reviews (status: APPROVED/REJECTED)
6. **READERS** can view and comment on APPROVED papers

## Database Schema

Key tables:
- **users** - User accounts with roles and authentication
- **papers** - Research papers with metadata and status
- **reviewer_assignments** - Links reviewers to papers
- **reviews** - Review submissions with scores and recommendations
- **comments** - Discussion threads on approved papers

See [ARCHITECTURE.md](backend/ARCHITECTURE.md) for complete schema details.

## Security Features

- JWT-based stateless authentication
- Bcrypt password hashing (10 salt rounds)
- Helmet for security headers
- CORS configuration
- Role-based access control
- Double-blind peer review (reviewer identity hidden from authors)

## Development

### Code Style
- TypeScript strict mode enabled
- ESM module system
- Modular architecture (routes → controllers → services → Prisma)
- Zod for runtime validation
- Consistent error handling with custom AppError class

### Database Operations
- Prisma ORM for type-safe queries
- Transaction support for atomic operations
- Indexed fields for performance

## Roadmap & Planned Features

- [ ] PDF/DOCX file upload (Supabase Storage or AWS S3)
- [ ] Admin user management (ban/unban, role changes)
- [ ] JWT token revocation
- [ ] Rate limiting and security enhancements
- [ ] Email notifications
- [ ] AI-powered features (paper summaries, review suggestions)
- [ ] Full-text search
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit and integration tests

## Documentation

- [Backend Architecture](backend/ARCHITECTURE.md) - Comprehensive technical documentation
- API Examples - Coming soon
- Deployment Guide - Coming soon

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Follow existing code style and conventions
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## License

ISC License

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with precision. Reviewed with care. Published with confidence.**

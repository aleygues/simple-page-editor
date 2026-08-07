# Simple Page Editor

A modern, markdown-powered page editor with versioning, media management, and multi-user collaboration. Built with React, Express, and TypeORM.

## Features

| Feature                     | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| **Rich Text Editing**       | Markdown/MDX editor with live preview and syntax highlighting     |
| **Version History**         | Full version tracking for all page edits with rollback capability |
| **Media Management**        | Upload, process, and embed images in your content                 |
| **User Authentication**     | JWT-based authentication with secure password hashing             |
| **Role-Based Access**       | Three permission levels: User, Contributor, Admin                 |
| **Real-time Collaboration** | WebSocket integration for live updates                            |
| **SEO Friendly**            | Automatic slug generation and metadata support                    |

## Tech Stack

### Backend

- **Runtime**: Node.js 26 (Alpine)
- **Framework**: Express.js 5.x
- **Database**: SQLite (better-sqlite3) with TypeORM 1.0
- **Authentication**: JWT (jsonwebtoken) with SHA-256 password hashing
- **File Processing**: Sharp (image transformation and caching)
- **Real-time**: WebSocket (ws) for live collaboration
- **Scheduling**: Cron jobs for cache cleanup
- **Email**: Resend for password reset and validation emails

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8.x
- **Editor**: @mdxeditor/editor 4.x with CodeMirror integration
- **Styling**: Linaria (CSS-in-JS) for zero-runtime styles
- **UI Components**: Custom component library with React Icons
- **State Management**: React hooks and context
- **HTTP Client**: Axios for API communication
- **Notifications**: react-hot-toast for user feedback

### DevOps

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for development
- **Environment**: .env file configuration

## Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│      Frontend       │    │      Backend         │    │     Database        │
│   (React + Vite)    │◄──►│   (Express + TS)     │◄──►│   (SQLite)         │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
          ▲                            ▲
          │                            │
          ▼                            ▼
┌─────────────────────┐    ┌─────────────────────┐
│   Browser (Client)   │    │   Docker Container   │
└─────────────────────┘    └─────────────────────┘
```

## Data Models

### Page

| Field         | Type   | Description              |
| ------------- | ------ | ------------------------ |
| `id`          | number | Primary key              |
| `title`       | string | Page title (3-255 chars) |
| `slug`        | string | Unique URL identifier    |
| `description` | string | Optional SEO description |
| `createdAt`   | Date   | Creation timestamp       |
| `createdBy`   | User   | Author of the page       |
| `updatedAt`   | Date   | Last update timestamp    |
| `updatedBy`   | User   | Last editor              |

### Version

| Field       | Type   | Description                |
| ----------- | ------ | -------------------------- |
| `id`        | number | Primary key                |
| `content`   | string | Markdown/MDX content       |
| `page`      | Page   | Parent page reference      |
| `createdAt` | Date   | Version creation timestamp |
| `createdBy` | User   | Version author             |
| `updatedAt` | Date   | Last update timestamp      |
| `updatedBy` | User   | Last editor                |

### Media

| Field       | Type   | Description       |
| ----------- | ------ | ----------------- |
| `id`        | number | Primary key       |
| `name`      | string | Original filename |
| `path`      | string | Storage path      |
| `mimetype`  | string | File MIME type    |
| `createdAt` | Date   | Upload timestamp  |
| `createdBy` | User   | Uploader          |

### User

| Field                    | Type   | Description                 |
| ------------------------ | ------ | --------------------------- | ----------- | ------- |
| `id`                     | number | Primary key                 |
| `email`                  | string | Unique email address        |
| `password`               | string | SHA-256 hashed              |
| `role`                   | enum   | USER                        | CONTRIBUTOR | ADMIN   |
| `state`                  | enum   | pending                     | active      | blocked |
| `passwordToken`          | string | Reset token (optional)      |
| `passwordTokenExpiresAt` | Date   | Token expiration (optional) |

## API Endpoints

### Authentication

| Method | Endpoint             | Description       | Access |
| ------ | -------------------- | ----------------- | ------ |
| POST   | `/api/users/signin`  | User login        | Public |
| POST   | `/api/users/signup`  | User registration | Public |
| POST   | `/api/users/refresh` | Refresh JWT token | Public |

### Pages

| Method | Endpoint               | Description            | Access       |
| ------ | ---------------------- | ---------------------- | ------------ |
| GET    | `/api/pages/`          | List all pages         | Public       |
| POST   | `/api/pages/`          | Create a new page      | Contributor+ |
| GET    | `/api/pages/:slugOrId` | Get page by slug or ID | Public       |
| PATCH  | `/api/pages/:id`       | Update a page          | Contributor+ |
| DELETE | `/api/pages/:id`       | Delete a page          | Contributor+ |

### Versions

| Method | Endpoint                | Description          | Access       |
| ------ | ----------------------- | -------------------- | ------------ |
| GET    | `/api/versions/:pageId` | List page versions   | Public       |
| POST   | `/api/versions`         | Create a new version | Contributor+ |
| PATCH  | `/api/versions/:id`     | Update a version     | Contributor+ |
| DELETE | `/api/versions/:id`     | Delete a version     | Contributor+ |

### Media

| Method | Endpoint         | Description    | Access       |
| ------ | ---------------- | -------------- | ------------ |
| GET    | `/api/media/`    | List all media | Public       |
| POST   | `/api/media/`    | Upload a file  | Contributor+ |
| GET    | `/api/media/:id` | Get media file | Public       |
| DELETE | `/api/media/:id` | Delete media   | Contributor+ |

### Favicon

| Method | Endpoint            | Description      | Access |
| ------ | ------------------- | ---------------- | ------ |
| GET    | `/api/favicon/`     | Get favicon file | Public |

## Project Structure

```
simple-page-editor/
├── api/                          # Backend application
│   ├── src/
│   │   ├── entities/            # TypeORM entity definitions
│   │   │   ├── Media.ts
│   │   │   ├── Page.ts
│   │   │   ├── User.ts
│   │   │   ├── Version.ts
│   │   │   └── Relation.ts
│   │   ├── routes/              # Express route definitions
│   │   │   ├── medias.ts
│   │   │   ├── pages.ts
│   │   │   ├── users.ts
│   │   │   ├── versions.ts
│   │   │   └── favicon.ts
│   │   ├── controllers/          # Route controllers
│   │   ├── middlewares/         # Express middlewares
│   │   ├── services/            # Background services
│   │   ├── utils/               # Utility functions
│   │   ├── datasource.ts        # TypeORM configuration
│   │   ├── api.ts               # API router
│   │   └── index.ts             # Application entry point
│   └── package.json
│
├── web/                          # Frontend application
│   ├── src/
│   │   ├── pages/               # React page components
│   │   │   ├── Editor.tsx
│   │   │   ├── Page.tsx
│   │   │   └── Signin.tsx
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── interfaces.ts        # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── compose.yml                  # Docker Compose configuration
├── Dockerfile                   # Multi-stage Docker build
├── .env                         # Environment variables
└── README.md                    # This file
```

## Environment Variables

| Variable                 | Required | Default                       | Description                                     |
| ------------------------ | -------- | ----------------------------- | ----------------------------------------------- |
| `JWT_SECRET`             | ✅ Yes   | -                             | Secret key for JWT token signing                |
| `ADMIN_EMAIL`            | No       | -                             | Default admin email (auto-created on first run) |
| `ADMIN_PASSWORD`         | No       | -                             | Default admin password                          |
| `PORT`                   | No       | 3300                          | Server port                                     |
| `NODE_ENV`               | No       | development                   | Environment mode                                |
| `DB_PATH`                | No       | ./app-data/db/database.sqlite | SQLite database path                            |
| `UPLOADS_PATH`           | No       | ./uploads                     | File uploads directory                          |
| `CACHE_PATH`             | No       | ./cache                       | Image cache directory                           |
| `CACHE_DURATION`         | No       | 24                            | Cache duration in hours                         |
| `LOG_LEVEL`              | No       | INFO                          | Logging level (ERROR, WARN, INFO, DEBUG)        |
| `ACCESS_TOKEN_DURATION`  | No       | 15m                           | Access token validity duration                  |
| `REFRESH_TOKEN_DURATION` | No       | 7d                            | Refresh token validity duration                 |
| `FAVICON_PATH`           | No       | ./public/favicon.ico          | Path to favicon file for the API endpoint        |

## Getting Started

### Prerequisites

- Docker 20+
- Docker Compose 2+
- Node.js 26+ (for local development without Docker)
- Yarn or npm

### Quick Start with Docker

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd simple-page-editor
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. Start the application:

   ```bash
   docker compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3300

### Local Development

#### Backend Setup

```bash
cd api
yarn install
yarn dev
```

Server runs on http://localhost:3300

#### Frontend Setup

```bash
cd web
yarn install
yarn dev
```

Application runs on http://localhost:5173

## Build for Production

### Docker Build

```bash
# Build the production image
docker compose -f compose.yml build

# Or build manually
docker build -t simple-page-editor .
```

### Manual Build

#### Backend

```bash
cd api
yarn install
yarn build
yarn start
```

#### Frontend

```bash
cd web
yarn install
yarn build
# Serve the dist/ folder with a static server
```

## Scripts

### Backend (api/)

| Script       | Description                              |
| ------------ | ---------------------------------------- |
| `yarn dev`   | Start development server with hot reload |
| `yarn build` | Compile TypeScript to JavaScript         |
| `yarn start` | Start production server                  |

### Frontend (web/)

| Script         | Description                      |
| -------------- | -------------------------------- |
| `yarn dev`     | Start development server         |
| `yarn build`   | Build for production             |
| `yarn lint`    | Run OXLint for code quality      |
| `yarn preview` | Preview production build locally |

## Security Features

- **Password Hashing**: All passwords are hashed with SHA-256
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained permissions
- **CSRF Protection**: Built-in Express protections
- **Input Validation**: Class-validator for all inputs
- **SQL Injection Prevention**: TypeORM parameterized queries
- **Password Reset Tokens**: Time-limited, single-use tokens

## Performance Optimizations

- **Image Caching**: Sharp-based image processing with configurable cache
- **SQLite**: Fast, file-based database with no external dependencies
- **WebSockets**: Efficient real-time communication
- **Cron Jobs**: Scheduled cache cleanup
- **Zero-Runtime CSS**: Linaria compiles styles at build time
- **Code Splitting**: Vite automatic code splitting

## License

MIT License - Copyright (c) Aurélien Leygues

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

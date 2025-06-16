# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://docs.docker.com/get-docker/)

## Downloading

```bash
git clone {repository URL}
```

## Running Application with Docker

1. Navigate to the project directory:

```bash
cd nodejs2025Q2-service
```

2. Copy and configure environment file:

```bash
copy .env.example .env
```

3. Edit `.env` file if needed.

4. Build and start the containers:

```bash
npm run docker:build   # Build Docker images
npm run docker:up      # Start containers in detached mode
```

5. To stop the application:

```bash
npm run docker:down    # Stop and remove containers
```

## Scanning for Vulnerabilities

To scan Docker images for security vulnerabilities:

```bash
npm run docker:scan
```

## Database Migrations

To work with database migrations:

```bash
# Generate a new migration
npm run typeorm:migration:generate -- migration-name

# Run migrations
npm run typeorm:migration:run
```

## Container Information

The application runs two containers:

- `music_service_app`: Node.js application (port 4000)
- `music_service_db`: PostgreSQL database (port 5432)

Features:

- Auto-restart on crash
- Hot-reload for source code changes
- Database persistence with Docker volumes
- Custom bridge network for container communication

## API Documentation

After starting the application, you can access:

- **Swagger UI**: http://localhost:4000/doc/
- **API Base URL**: http://localhost:4000/

### Installing NPM modules

```bash
npm install
```

## Testing

The application includes comprehensive test suites for all functionality.

### Test Suites Available

#### With Authentication

```bash
npm run test:auth
```

#### Refresh Token Tests

```bash
npm run test:refresh
```

## Development Tools

```bash
npm run lint    # Lint and auto-fix code
npm run format  # Format code with Prettier
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

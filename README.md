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

2. Create `.env` file based on `.env.example` and adjust the values if needed.

3. Build and start the containers:

```bash
npm run docker:build   # Build Docker images
npm run docker:up      # Start containers in detached mode
```

4. To stop the application:

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

```

## Installing NPM modules

```

npm install

```

## Running application

```

npm start

```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```

npm run test

```

To run only one of all test suites

```

npm run test -- <path to suite>

```

To run all test with authorization

```

npm run test:auth

```

To run only specific test suite with authorization

```

npm run test:auth -- <path to suite>

```

### Auto-fix and format

```

npm run lint

```

```

npm run format

```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
```

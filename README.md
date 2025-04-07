# Registration & Push Microservices

App consisting of two NestJS microservices:

- **`registration`** (`/apps/registration`) — handles user registrations and saves data to PostgreSQL.
- **`push`** (`/apps/push`) — sends notifications through an external push notification service (mock implementation).

Both microservices communicate via RabbitMQ, with the ability to configure delay between user registration and notification sending.

---

## Prerequisites

Installed:

- Docker
- Docker Compose
- Node.js (if you'd like to run tests)

---

## Setup & Running

### 1. Clone the Repository

```bash
git clone https://github.com/NH1403/registration-push.git
cd registration-push
```

### 2. Run the App

To build and launch all services:

```bash
docker compose up
```

This will:

- Build Docker images
- Start PostgreSQL and RabbitMQ
- Launch microservices with registration accessible at [http://localhost:3000](http://localhost:3000)

Example usage:

```bash
POST localhost:3000
json body:
{"name":"SomeNewUser"}
```

To stop the app and services:

```bash
docker compose down
```

---

## Testing

Firstly, install dependencies:

```bash
npm install
```

Run unit tests:

```bash
npm run test
```

Run integration tests:

```bash
npm run test:e2e
```

---

## Development Mode

Run services in development mode (with NestJS auto-reload and ephemeral databases & queues):

```bash
docker compose -f docker-compose.dev.yml up --build
```

App will listen at [http://localhost:3000](http://localhost:3000).

To stop the dev environment:

```bash
docker compose -f docker-compose.dev.yml down
```

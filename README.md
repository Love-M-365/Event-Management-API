#  Event Management REST API

A complete Event Management system built with **Node.js**, **Express**, and **PostgreSQL**.

This API allows for:
- Creating and listing events
- Registering users
- Managing event registrations
- Fetching upcoming events with custom sorting

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Love-M-365/Event-Management-API.git
cd event-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure PostgreSQL

- Ensure PostgreSQL is installed and running.
- Create a database named `Event-Management`.

### 4. Create tables using pgAdmin or query tool

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  capacity INT CHECK (capacity > 0 AND capacity <= 1000)
);

CREATE TABLE registrations (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);
```

### 5. Create `.env` file

```env
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=Event-Management
DB_PORT=5432
```

### 6. Start the server

```bash
node app.js
```

Server will run at:  
**`http://localhost:5000`**

---

## 🧪 API Endpoints

### 📌 Users

#### ➕ Create User
`POST /api/users`

```json
Request:
{
  "name": "Love Maggo",
  "email": "love@example.com"
}

Response:
{
  "userId": 1
}
```

#### 📥 Get All Users
`GET /api/users`

```json
Response:
[
  {
    "id": 1,
    "name": "Love Maggo",
    "email": "love@example.com"
  }
]
```

#### 🔗 Register for Event
`POST /api/users/register`

```json
Request:
{
  "userId": 1,
  "eventId": 2
}

Response:
{
  "message": "User registered successfully"
}
```

#### ❌ Cancel Registration
`POST /api/users/cancel`

```json
Request:
{
  "userId": 1,
  "eventId": 2
}

Response:
{
  "message": "Registration cancelled"
}
```

---

### 📌 Events

#### ➕ Create Event
`POST /api/events`

```json
Request:
{
  "title": "AI Workshop",
  "datetime": "2025-07-20T10:00:00Z",
  "location": "Delhi",
  "capacity": 200
}

Response:
{
  "eventId": 1
}
```

#### 📥 Get Event Details
`GET /api/events/:id`

```json
Response:
{
  "id": 1,
  "title": "AI Workshop",
  "datetime": "2025-07-20T10:00:00.000Z",
  "location": "Delhi",
  "capacity": 200,
  "registrations": [
    {
      "id": 1,
      "name": "Love Maggo",
      "email": "love@example.com"
    }
  ]
}
```

#### 📅 List Upcoming Events
`GET /api/events/upcoming`

```json
Response:
[
  {
    "id": 2,
    "title": "Tech Meetup",
    "datetime": "2025-07-21T09:00:00.000Z",
    "location": "Mumbai",
    "capacity": 300
  },
  {
    "id": 3,
    "title": "Design Sprint",
    "datetime": "2025-07-21T09:00:00.000Z",
    "location": "Pune",
    "capacity": 150
  }
]
```

(Results are sorted by datetime first, then location alphabetically)

---

## 📏 Business Logic Rules

- Event capacity must be between 1–1000
- No duplicate registrations
- Cannot register for past events
- Cannot register if event is full
- Can cancel only if user was registered
- All inputs are validated
- Proper HTTP status codes and error messages are returned

---

## 📬 Responses & Status Codes

| Status Code      | Meaning                         |
|------------------|---------------------------------|
| 200 OK           | Request successful              |
| 201 Created      | New record created              |
| 400 Bad Request  | Validation/constraint failed    |
| 404 Not Found    | Resource not found              |
| 500 Server Error | Something went wrong internally |


## 📦 Tech Stack

- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- dotenv

---

## 👨‍💻 Author

Made with by **Love Maggo**

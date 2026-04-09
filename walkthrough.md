# CDR (Clinical Dementia Rating) — Complete Codebase Analysis

> **What is this app?** A web application for conducting Alzheimer's / dementia assessments using the Clinical Dementia Rating (CDR) scale. A patient's caretaker answers questions across 6 domains (Memory, Orientation, etc.), each answer gets a severity rating, and a final score determines the dementia severity level.

---

## 1. BACKEND ANALYSIS

### 1.1 Technology Stack

| Technology | Purpose |
|---|---|
| **Express.js** | Web server / API framework |
| **MongoDB + Mongoose** | Database & ODM |
| **bcrypt** | Password hashing |
| **jsonwebtoken (JWT)** | Authentication tokens |
| **cors** | Cross-origin requests |
| **dotenv** | Environment variables |

### 1.2 Database Models (3 total)

#### Model 1: [User](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/admin/AdminUserDetail.jsx#9-439) — [User.js](file:///home/rajvardhan/CDR2/CDR-main/backend/models/User.js)

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique |
| `passwordHash` | String | Required (bcrypt hash) |
| `dob` | Date | Optional — patient's date of birth |
| [age](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/TestPage.jsx#8-346) | Number | Optional — patient's age |
| `bloodGroup` | String | Optional (A+, B-, etc.) |
| `gender` | String | Optional |
| `otherHealthIssues` | String | Optional free text |
| `timestamps` | — | Auto-adds `createdAt` & `updatedAt` |

#### Model 2: [Test](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/TestPage.jsx#8-346) — [Test.js](file:///home/rajvardhan/CDR2/CDR-main/backend/models/Test.js)

| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId → User | Required — who this test belongs to |
| `caretaker` | Object | `{ name, gender, age, mobile, email, relation }` |
| `startedAt` | Date | Defaults to now |
| `finishedAt` | Date | Set when test is submitted |
| `answers` | Array | `[{ qId: String, rating: Number }]` |
| `score` | Number | Sum of all ratings |
| `timestamps` | — | Auto `createdAt` & `updatedAt` |

#### Model 3: [Domain](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ResultPage.jsx#59-122) — [Domain.js](file:///home/rajvardhan/CDR2/CDR-main/backend/models/Domain.js)

| Field | Type | Notes |
|---|---|---|
| `domain` | String | e.g. "Memory", "Orientation" |
| `description` | String | e.g. "Assesses ability to recall…" |
| `questions` | Array | `[{ id: String, text: String }]` |

There are **6 domains** with **5 questions each = 30 total questions**, seeded from [questions.json](file:///home/rajvardhan/CDR2/CDR-main/backend/questions.json).

---

### 1.3 All API Endpoints (14 total)

The server mounts 4 routers on these base paths (see [server.js](file:///home/rajvardhan/CDR2/CDR-main/backend/server.js)):

```
/api/auth    →  routes/auth.js
/api/test    →  routes/test.js
/api/domains →  routes/domain.js
/api/admin   →  routes/admin.js
```

Plus one inline root route.

#### Route Group 1: Root — [server.js](file:///home/rajvardhan/CDR2/CDR-main/backend/server.js)

| # | Method | Route | Auth? | Handler | What It Does |
|---|---|---|---|---|---|
| 1 | `GET` | `/` | No | Inline | Returns `{ message: "CDR backend (MongoDB) running" }` — a health check |

#### Route Group 2: Auth — [auth.js](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/auth.js)

| # | Method | Route | Auth? | Handler | What It Does |
|---|---|---|---|---|---|
| 2 | `POST` | `/api/auth/signup` | No | Inline | Creates a new user with hashed password, returns JWT token + user object |
| 3 | `POST` | `/api/auth/signin` | No | Inline | Verifies email+password, returns JWT token + user object |
| 4 | `GET` | `/api/auth/me` | Yes ([authMiddleware](file:///home/rajvardhan/CDR2/CDR-main/backend/middleware/auth.js#5-19)) | Inline | Returns the current logged-in user's full profile (excluding password) |

#### Route Group 3: Test — [test.js](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/test.js)

| # | Method | Route | Auth? | Handler | What It Does |
|---|---|---|---|---|---|
| 5 | `GET` | `/api/test/questions` | No | Inline | Returns all domains+questions from the [Domain](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ResultPage.jsx#59-122) collection |
| 6 | `POST` | `/api/test/start` | Yes | Inline | Creates a new Test record with caretaker details; requires `caretaker.email` and `caretaker.relation` |
| 7 | `POST` | `/api/test/submit` | Yes | Inline | Saves final answers, calculates total score, sets `finishedAt` |
| 8 | `POST` | `/api/test/save` | Yes | Inline | Saves partial answers (merges new answers with existing ones) without finishing |
| 9 | `GET` | `/api/test/my-tests` | Yes | Inline | Returns all tests belonging to the logged-in user, sorted newest first |
| 10 | `GET` | `/api/test/results/:id` | Yes | Inline | Returns a single test by ID (only if the logged-in user owns it) |

#### Route Group 4: Domain — [domain.js](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/domain.js)

| # | Method | Route | Auth? | Handler | What It Does |
|---|---|---|---|---|---|
| 11 | `GET` | `/api/domains` | No | Inline | Returns all domains |
| 12 | `GET` | `/api/domains/:domain` | No | Inline | Returns a single domain by name (e.g. "Memory") |
| 13 | `GET` | `/api/domains/question/:id` | No | Inline | Returns a single question by its [id](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Sidebar.jsx#6-144) (e.g. "mem1") |

#### Route Group 5: Admin — [admin.js](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js)

| # | Method | Route | Auth? | Handler | What It Does |
|---|---|---|---|---|---|
| 14 | `GET` | `/api/admin/users` | Yes + [adminOnly](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js#7-12) | Inline | Returns all users with their test count and average score |
| 15 | `GET` | `/api/admin/users/:userId` | Yes + [adminOnly](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js#7-12) | Inline | Returns a single user's profile including medical/patient fields |
| 16 | `GET` | `/api/admin/users/:userId/tests` | Yes + [adminOnly](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js#7-12) | Inline | Returns all tests for a user, sorted newest first |
| 17 | `GET` | `/api/admin/users/:userId/tests/:testId` | Yes + [adminOnly](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js#7-12) | Inline | Returns a specific test for a specific user |

> **Correction: That's actually 17 endpoints total** (1 root + 3 auth + 6 test + 3 domain + 4 admin).

---

## 2. FRONTEND ANALYSIS

### 2.1 Technology Stack

| Technology | Purpose |
|---|---|
| **React 18** (Vite) | UI framework |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP requests |
| **TailwindCSS v4** | Styling |

### 2.2 Frontend Architecture

```
main.jsx  →  AuthProvider wraps everything
               └── App.jsx  →  Router with routes
                    ├── Header.jsx     (hidden on /, /signin, /signup)
                    ├── Sidebar.jsx    (shown when logged in)
                    ├── Footer.jsx     (always shown)
                    └── <Routes>
                         ├── Home.jsx           (/)
                         ├── Signup.jsx          (/signup)
                         ├── Signin.jsx          (/signin)
                         ├── Dashboard.jsx       (/dashboard)
                         ├── Guidelines.jsx      (/guidelines)
                         ├── TestPage.jsx        (/test/:testId?)
                         ├── ResultPage.jsx      (/result/:testId)
                         ├── Profile.jsx         (/profile)
                         ├── Analytics.jsx       (/analytics)
                         ├── AdminDashboard.jsx  (/admin)
                         └── AdminUserDetail.jsx (/admin/user/:userId)
```

### 2.3 API Layer

[api.js](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/api.js) — Creates an Axios instance with `baseURL: "http://localhost:5000/api"`. An interceptor automatically attaches the JWT token from `localStorage` to every request's `Authorization: Bearer <token>` header.

[config.js](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/config.js) — Exports the same base URL. Used by [Signup.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Signup.jsx) and [Signin.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Signin.jsx) (which use raw `axios` instead of the `api` instance).

### 2.4 All Frontend API Calls (18 total)

| # | Component | Trigger | HTTP Call | Backend Endpoint | Data Sent |
|---|---|---|---|---|---|
| 1 | [AuthContext.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/context/AuthContext.jsx) | `useEffect` on mount | `api.get('/auth/me')` | `GET /api/auth/me` | Token in header |
| 2 | [Signup.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Signup.jsx) | Form submit | `axios.post(baseURL+'/auth/signup', payload)` | `POST /api/auth/signup` | `{ name, email, password, dob, age, bloodGroup, gender, otherHealthIssues }` |
| 3 | [Signin.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Signin.jsx) | Form submit | `axios.post(baseURL+'/auth/signin', form)` | `POST /api/auth/signin` | `{ email, password }` |
| 4 | [Dashboard.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Dashboard.jsx) | `useEffect` on mount | `api.get('/test/my-tests')` | `GET /api/test/my-tests` | Token in header |
| 5 | [Guidelines.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Guidelines.jsx) | Form submit (start assessment) | `api.post('/test/start', payload)` | `POST /api/test/start` | `{ caretaker: { name, gender, age, mobile, email, relation } }` |
| 6 | [TestPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/TestPage.jsx) | `useEffect` on mount | `api.get('/test/questions')` | `GET /api/test/questions` | None |
| 7 | [TestPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/TestPage.jsx) | `useEffect` on mount | `api.get('/test/my-tests')` | `GET /api/test/my-tests` | Token in header |
| 8 | [TestPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/TestPage.jsx) | `useEffect` (when testId + questions ready) | `api.get('/test/results/{testId}')` | `GET /api/test/results/:id` | Token in header |
| 9 | [TestPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/TestPage.jsx) | When user selects a rating | `api.post('/test/save', ...)` | `POST /api/test/save` | `{ testId, answers: [{ qId, rating }] }` |
| 10 | [TestPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/TestPage.jsx) | "Submit Assessment" button | `api.post('/test/submit', ...)` | `POST /api/test/submit` | `{ testId, answers: [{ qId, rating }] }` |
| 11 | [ResultPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ResultPage.jsx) | `useEffect` on mount | `api.get('/test/results/{testId}')` | `GET /api/test/results/:id` | Token in header |
| 12 | [ResultPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ResultPage.jsx) | `useEffect` (admin path) | `api.get('/admin/users/{userId}/tests/{testId}')` | `GET /api/admin/users/:userId/tests/:testId` | Token in header |
| 13 | [ResultPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ResultPage.jsx) | `useEffect` (admin — fetch user list) | `api.get('/admin/users')` | `GET /api/admin/users` | Token in header |
| 14 | [ResultPage.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ResultPage.jsx) | `useEffect` (after result loads) | `api.get('/domains')` | `GET /api/domains` | None |
| 15 | [Profile.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Profile.jsx) | `useEffect` on mount | `api.get('/test/my-tests')` | `GET /api/test/my-tests` | Token in header |
| 16 | [Profile.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Profile.jsx) | `useEffect` on mount | `api.get('/auth/me')` | `GET /api/auth/me` | Token in header |
| 17 | [Analytics.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/Analytics.jsx) | `useEffect` on mount | `api.get('/test/my-tests')` | `GET /api/test/my-tests` | Token in header |
| 18 | [AdminDashboard.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/admin/AdminDashboard.jsx) | `useEffect` on mount | `api.get('/admin/users')` | `GET /api/admin/users` | Token in header |
| 19 | [AdminUserDetail.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/admin/AdminUserDetail.jsx) | `useEffect` on mount | `api.get('/admin/users/{userId}')` | `GET /api/admin/users/:userId` | Token in header |
| 20 | [AdminUserDetail.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/admin/AdminUserDetail.jsx) | `useEffect` on mount | `api.get('/admin/users/{userId}/tests')` | `GET /api/admin/users/:userId/tests` | Token in header |
| 21 | [AdminUserDetail.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/admin/AdminUserDetail.jsx) | `useEffect` (if testId) | `api.get('/admin/users/{userId}/tests/{testId}')` | `GET /api/admin/users/:userId/tests/:testId` | Token in header |

> **Total: 21 API call sites across all components.**

---

## 3. COMPLETE REQUEST FLOWS

### Flow 1: User Signup

```
[Signup.jsx]  —  User fills form (name, email, password, DOB, etc.) and clicks "Create Account"
      ↓
handleSubmit() fires → validates password ≥ 8 chars
      ↓
axios.POST → http://localhost:5000/api/auth/signup
      ↓  body: { name, email, password, dob, age, bloodGroup, gender, otherHealthIssues }
[Express Route]  POST /api/auth/signup  (no middleware)
      ↓
[Controller Logic in routes/auth.js]
  1. Checks name, email, password exist
  2. User.findOne({ email }) — checks if user already exists
  3. bcrypt.hash(password, 10) — hashes password
  4. User.create({ name, email, passwordHash, dob, age, ... }) — saves to MongoDB
  5. jwt.sign({ id, email, name }, SECRET, { expiresIn: '7d' }) — creates token
      ↓
[MongoDB]  Inserts one document into `users` collection
      ↓
[Response]  { token: "jwt...", user: { id, name, email, dob, age, ... } }
      ↓
[Signup.jsx]  Shows alert "Signup successful!", navigates to /signin
```

### Flow 2: User Signin

```
[Signin.jsx]  —  User enters email + password, clicks "Sign In"
      ↓
handleSubmit() fires
      ↓
axios.POST → http://localhost:5000/api/auth/signin
      ↓  body: { email, password }
[Express Route]  POST /api/auth/signin  (no middleware)
      ↓
[Controller Logic]
  1. User.findOne({ email }) — finds user in DB
  2. bcrypt.compare(password, user.passwordHash) — verifies password
  3. jwt.sign({ id, email, name }, SECRET, expiresIn: '7d') — creates token
      ↓
[MongoDB]  Reads one document from `users` collection
      ↓
[Response]  { token: "jwt...", user: { id, name, email } }
      ↓
[Signin.jsx]
  1. Calls login(token, user) → saves to AuthContext state + localStorage
  2. If admin email → navigate('/admin'), otherwise navigate('/dashboard')
```

### Flow 3: Starting a Test (Assessment)

```
[Dashboard.jsx]  —  User clicks "Start New Assessment"
      ↓
startTest() → navigates to /guidelines
      ↓
[Guidelines.jsx]  —  User fills caretaker details + clicks "Start Assessment"
      ↓
handleStart() fires → validates caretaker.email and caretaker.relation
      ↓
api.POST → /api/test/start
      ↓  body: { caretaker: { name, gender, age, mobile, email, relation } }
[Express Route]  POST /api/test/start
      ↓
[Middleware]  authMiddleware runs → verifies JWT → attaches req.user = { id, email }
      ↓
[Controller Logic]
  1. Validates caretaker.email and caretaker.relation exist
  2. Test.create({ userId: req.user.id, caretaker }) — creates test in DB
      ↓
[MongoDB]  Inserts one document into `tests` collection
      ↓
[Response]  { testId: "...", startedAt: "date", test: { ...full test object } }
      ↓
[Guidelines.jsx]  navigates to /test/{testId}
```

### Flow 4: Answering Questions (Taking the Test)

```
[TestPage.jsx]  — Loads on mount
      ↓
useEffect #1: api.GET /api/test/questions
  → Returns all 6 domains with 30 questions
  → Stored in groupedQuestions state

useEffect #2: api.GET /api/test/my-tests
  → Finds any unfinished test, or creates new one via POST /api/test/start
  → Sets testId

useEffect #3: api.GET /api/test/results/{testId}
  → Loads any previously saved answers and resumes from where user left off

--- User interacts with a question ---

User clicks a severity button (None/Questionable/Mild/Moderate/Severe)
      ↓
handleChange(uniqueId, value) fires
  1. Updates local answers state: { [uniqueId]: rating }
  2. Immediately calls api.POST /api/test/save
       body: { testId, answers: [{ qId, rating }] }
      ↓
[Middleware]  authMiddleware
      ↓
[Controller]  Merges new answer with existing answers using a Map
      ↓
[MongoDB]  Updates the test document's `answers` array
      ↓
[Response]  { test: { ...updated test } }
```

### Flow 5: Submitting the Test

```
[TestPage.jsx]  — User clicks "Submit Assessment" on the last question
      ↓
handleSubmit() fires
  1. Checks all questions are answered
  2. Builds payload: [{ qId, rating }, { qId, rating }, ...]
  3. api.POST /api/test/submit
       body: { testId, answers: [...all 30 answers] }
      ↓
[Middleware]  authMiddleware
      ↓
[Controller Logic]
  1. Test.findById(testId)
  2. Sets test.answers = answers
  3. Sets test.finishedAt = new Date()
  4. Calculates score = sum of all ratings
  5. test.save()
      ↓
[MongoDB]  Updates test document with answers, finishedAt, score
      ↓
[Response]  { testId, finishedAt, score }
      ↓
[TestPage.jsx]  navigates to /result/{testId}
```

### Flow 6: Viewing Results

```
[ResultPage.jsx]  — Loads on mount
      ↓
useEffect #1: api.GET /api/test/results/{testId}
  → Gets the test with all answers and score
  (OR if admin: api.GET /api/admin/users/{userId}/tests/{testId})
      ↓
useEffect #2: api.GET /api/domains
  → Gets all domain/question metadata
  → Computes per-domain analytics (score, percent, severity, top concerning questions)
      ↓
Renders: Overall Score, Overall Severity, Questions Answered count,
         per-domain breakdowns, and a full list of individual answers
```

### Flow 7: Admin — View All Users

```
[AdminDashboard.jsx]  — Loads on mount (only if user.email === 'admin@gmail.com')
      ↓
useEffect: api.GET /api/admin/users
      ↓
[Middleware]  authMiddleware → adminOnly (checks email === 'admin@gmail.com')
      ↓
[Controller]
  1. User.find() — gets all users
  2. For each user: Test.find({ userId }) → counts tests, calculates avg score
      ↓
[MongoDB]  Reads from `users` and `tests` collections
      ↓
[Response]  { users: [{ _id, name, email, totalTests, avgScore }, ...] }
      ↓
[AdminDashboard.jsx]  Displays user list with stats; calculates total tests, avg score, active users
```

### Flow 8: Admin — View User Detail

```
[AdminUserDetail.jsx]  — Loads on mount
      ↓
api.GET /api/admin/users/{userId}        → gets user profile
api.GET /api/admin/users/{userId}/tests  → gets all their tests
(optional) api.GET /api/admin/users/{userId}/tests/{testId}  → gets specific test
      ↓
[Middleware]  authMiddleware → adminOnly on each request
      ↓
Renders user profile card (name, email, DOB, age, blood group, gender, health issues)
        + list of tests with scores and severity badges
        + when a test is clicked → navigates to /result/{testId}?userId={userId}
```

---

## 4. MIDDLEWARE EXPLANATION

### 4.1 Middleware List

There are **4 middleware** used in this app:

| # | Middleware | File | What It Does |
|---|---|---|---|
| 1 | `cors()` | [server.js](file:///home/rajvardhan/CDR2/CDR-main/backend/server.js) L15 | Allows the frontend (different origin/port) to talk to the backend. Applied globally to ALL routes. |
| 2 | `express.json()` | [server.js](file:///home/rajvardhan/CDR2/CDR-main/backend/server.js) L16 | Parses incoming JSON request bodies so `req.body` works. Applied globally to ALL routes. |
| 3 | [authMiddleware](file:///home/rajvardhan/CDR2/CDR-main/backend/middleware/auth.js#5-19) | [middleware/auth.js](file:///home/rajvardhan/CDR2/CDR-main/backend/middleware/auth.js) | Checks the `Authorization: Bearer <token>` header, verifies the JWT, and sets `req.user = { id, email }`. Applied per-route. |
| 4 | [adminOnly](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js#7-12) | [routes/admin.js](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js) L8-11 | Checks that `req.user.email === 'admin@gmail.com'`. If not, returns 403 Forbidden. Applied to all admin routes after [authMiddleware](file:///home/rajvardhan/CDR2/CDR-main/backend/middleware/auth.js#5-19). |

### 4.2 Execution Order

```
Every request:
  1. cors()           — allows cross-origin
  2. express.json()   — parses body

Protected routes (test/start, test/submit, test/save, test/my-tests, test/results/:id, auth/me):
  3. authMiddleware   — verifies JWT token

Admin routes (admin/users, admin/users/:userId, etc.):
  3. authMiddleware   — verifies JWT token
  4. adminOnly        — checks admin email
```

### 4.3 Which Routes Use Which Middleware

| Middleware | Routes |
|---|---|
| `cors()` + `express.json()` | **ALL routes** (global) |
| [authMiddleware](file:///home/rajvardhan/CDR2/CDR-main/backend/middleware/auth.js#5-19) | `GET /api/auth/me`, `POST /api/test/start`, `POST /api/test/submit`, `POST /api/test/save`, `GET /api/test/my-tests`, `GET /api/test/results/:id`, all `/api/admin/*` routes |
| [adminOnly](file:///home/rajvardhan/CDR2/CDR-main/backend/routes/admin.js#7-12) | `GET /api/admin/users`, `GET /api/admin/users/:userId`, `GET /api/admin/users/:userId/tests`, `GET /api/admin/users/:userId/tests/:testId` |
| **No auth** | `GET /`, `POST /api/auth/signup`, `POST /api/auth/signin`, `GET /api/test/questions`, all `/api/domains/*` routes |

---

## 5. DATA FLOW & SERIALIZATION

### 5.1 Frontend → Backend (Request)

1. **React component** builds a plain JavaScript object (e.g., `{ email: "a@b.com", password: "123" }`)
2. **Axios** automatically converts this object to a **JSON string** (serialization) and sets header `Content-Type: application/json`
3. The JWT token is attached via the Axios interceptor: `Authorization: Bearer <token>`
4. Request travels over HTTP to `http://localhost:5000/api/...`

### 5.2 Backend Receives Request

1. **`express.json()` middleware** parses the JSON string back into a JavaScript object (deserialization) and puts it in `req.body`
2. **[authMiddleware](file:///home/rajvardhan/CDR2/CDR-main/backend/middleware/auth.js#5-19)** (if applicable) reads the `Authorization` header, extracts the token, and calls `jwt.verify()` to decode it into `{ id, email }`, which is attached to `req.user`

### 5.3 Backend → MongoDB

1. The route handler uses **Mongoose model methods** like `User.create(data)`, `Test.findById(id)`, `User.findOne({ email })`, `test.save()`
2. Mongoose converts JavaScript objects into **BSON (Binary JSON)** — MongoDB's internal format
3. The query executes directly against the MongoDB database

### 5.4 MongoDB → Backend

1. MongoDB returns BSON documents
2. Mongoose receives them and converts them into **Mongoose documents** (JavaScript objects with extra Mongoose methods)
3. The route handler extracts the needed fields

### 5.5 Backend → Frontend (Response)

1. The route handler calls `res.json(data)` — this converts the JavaScript object to a **JSON string** and sends it with `Content-Type: application/json`
2. Axios in the frontend receives the response and automatically **parses the JSON** back into a JavaScript object at `res.data`

### 5.6 How Frontend Uses the Response

- **Token**: Stored in `localStorage` and in `AuthContext` state
- **User object**: Stored in `AuthContext` state and `localStorage`
- **Tests array**: Stored in component state via `useState`, rendered as cards
- **Questions**: Stored in component state, rendered as an interactive form
- **Results**: Stored in component state, rendered as analytics cards with severity badges

```
Summary of the full round trip:

JS Object →  JSON String  →  HTTP Request  →  JSON Parsing  →  JS Object (req.body)
   ↓                                                                    ↓
Frontend                                                          Backend handler
   ↑                                                                    ↓
JS Object ←  JSON Parsing ←  HTTP Response ←  JSON String   ←  res.json(data)
                                                                        ↓
                                                              Mongoose ↔ MongoDB (BSON)
```

---

## 6. VISUAL FLOW DIAGRAMS

### 6.1 General Request Flow

```
┌─────────────────────┐
│   React Component   │  (e.g., Dashboard.jsx)
│   User action or    │
│   useEffect hook    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│     api.js (Axios)  │  Attaches JWT token from localStorage
│     HTTP Request    │  Serializes body to JSON
└────────┬────────────┘
         │  HTTP over network
         ▼
┌─────────────────────┐
│   Express Server    │  (server.js on port 5000)
│   cors()            │  ← Global middleware #1
│   express.json()    │  ← Global middleware #2
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Route Middleware   │
│   authMiddleware?    │  ← Verifies JWT, sets req.user
│   adminOnly?         │  ← Checks admin email
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Route Handler     │  (inline function in routes/*.js)
│   Business logic    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Mongoose Model    │  User / Test / Domain
│   .find() .create() │
│   .save() etc.      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│     MongoDB         │  (stores data as BSON documents)
└────────┬────────────┘
         │
         ▼  (data returned)
┌─────────────────────┐
│   res.json(data)    │  Backend sends JSON response
└────────┬────────────┘
         │  HTTP response
         ▼
┌─────────────────────┐
│     Axios           │  Parses JSON to JavaScript object
│     res.data        │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  React Component    │  Updates state via setState
│  UI Re-renders      │  Shows the new data to user
└─────────────────────┘
```

### 6.2 Authentication Flow

```
                     ┌───────────────┐
                     │   App Loads   │
                     └───────┬───────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  AuthContext useEffect │
                  │  Check localStorage   │
                  │  for stored token     │
                  └──────────┬───────────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
              No token             Has token
                   │                   │
                   ▼                   ▼
            ┌───────────┐    ┌─────────────────┐
            │ Show Home │    │ GET /api/auth/me │
            │ (login)   │    │ Verify token     │
            └───────────┘    └────────┬────────┘
                                      │
                           ┌──────────┴──────────┐
                           │                     │
                       Valid token           Invalid token
                           │                     │
                           ▼                     ▼
                    ┌──────────────┐      ┌───────────────┐
                    │ Set user +   │      │ Clear storage  │
                    │ token state  │      │ Show login     │
                    │ Show app     │      └───────────────┘
                    └──────────────┘
```

### 6.3 Test-Taking Flow

```
┌──────────────┐    ┌────────────────┐    ┌──────────────┐    ┌──────────────┐
│  Dashboard   │ →  │   Guidelines   │ →  │   TestPage   │ →  │  ResultPage  │
│              │    │                │    │              │    │              │
│ Click "Start │    │ Fill caretaker │    │ Answer 30    │    │ View score,  │
│ Assessment"  │    │ details, read  │    │ questions    │    │ severity,    │
│              │    │ guidelines     │    │ one by one   │    │ per-domain   │
│ Navigates    │    │                │    │              │    │ analysis     │
│ to /guide-   │    │ POST /test/    │    │ Each answer  │    │              │
│ lines        │    │ start          │    │ auto-saves   │    │ GET /test/   │
│              │    │                │    │ via POST     │    │ results/:id  │
│ Shows test   │    │ Navigates to   │    │ /test/save   │    │              │
│ history      │    │ /test/:testId  │    │              │    │ GET /domains │
│              │    │                │    │ Final submit │    │              │
│ GET /test/   │    │                │    │ POST /test/  │    │              │
│ my-tests     │    │                │    │ submit       │    │              │
└──────────────┘    └────────────────┘    └──────────────┘    └──────────────┘
```

### 6.4 Admin Flow

```
┌──────────────────┐         ┌─────────────────────┐         ┌──────────────┐
│ AdminDashboard   │   →     │  AdminUserDetail     │   →     │  ResultPage  │
│                  │         │                      │         │              │
│ GET /admin/users │         │ GET /admin/users/:id │         │ (with userId │
│                  │         │ GET /admin/users/    │         │  query param)│
│ Shows all users  │         │   :id/tests          │         │              │
│ with test count  │         │                      │         │ Shows test   │
│ and avg score    │         │ Shows user profile   │         │ results with │
│                  │         │ + all their tests    │         │ patient and  │
│ Click "View      │         │                      │         │ caretaker    │
│  Profile"        │         │ Click test to view   │         │ info         │
│                  │         │ results              │         │              │
└──────────────────┘         └─────────────────────┘         └──────────────┘
```

### 6.5 Scoring & Severity System

```
Each question is rated:
  0   = None (normal)
  0.5 = Questionable
  1   = Mild
  2   = Moderate
  3   = Severe

30 questions × max 3 each = max possible score of 90

Overall Severity Thresholds (used in ResultPage & Admin):
  Score 0–9   → "None / Normal"      (green)
  Score 10–22 → "Questionable"       (yellow)
  Score 23–45 → "Mild"               (orange)
  Score 46–67 → "Moderate"           (red)
  Score 68+   → "Severe"             (dark red)

Per-Domain Severity (based on percentage of max):
  0–15%  → "None / Normal"
  16–40% → "Questionable / Very Mild"
  41–60% → "Mild"
  61–85% → "Moderate"
  86+%   → "Severe"
```

---

## 7. UTILITY / HELPER FILES

| File | Purpose |
|---|---|
| [severity.js](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/utils/severity.js) | Maps a raw total score to a severity label + Tailwind CSS classes for color-coding |
| [Button.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ui/Button.jsx) | Reusable styled button component with gradient, hover effects, and transitions |
| [Card.jsx](file:///home/rajvardhan/CDR2/CDR-main/frontend/src/components/ui/Card.jsx) | Reusable card container with shadow, rounded corners, and hover effects |
| [importData.js](file:///home/rajvardhan/CDR2/CDR-main/backend/importData.js) | One-time script to seed the MongoDB database with question data from [questions.json](file:///home/rajvardhan/CDR2/CDR-main/backend/questions.json). Run via `node importData.js`. Deletes all existing domains first, then inserts fresh data. |

---

## 8. COMPLETE FILE MAP

```
CDR-main/
├── backend/
│   ├── config/
│   │   └── db.js              ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js            ← JWT auth middleware
│   ├── models/
│   │   ├── User.js            ← User schema
│   │   ├── Test.js            ← Test schema
│   │   └── Domain.js          ← Domain + Question schema
│   ├── routes/
│   │   ├── auth.js            ← Signup, Signin, Me
│   │   ├── test.js            ← Questions, Start, Submit, Save, My-Tests, Results
│   │   ├── domain.js          ← Get domains/questions
│   │   └── admin.js           ← Admin user/test management
│   ├── server.js              ← Express app entry point
│   ├── importData.js          ← DB seeder script
│   ├── questions.json         ← 30 CDR questions across 6 domains
│   └── package.json           ← Backend dependencies
│
└── frontend/
    └── src/
        ├── api.js             ← Axios instance with auth interceptor
        ├── config.js          ← Base URL constant
        ├── main.jsx           ← React entry point
        ├── App.jsx            ← Router + route definitions
        ├── index.css          ← TailwindCSS import
        ├── context/
        │   └── AuthContext.jsx ← Auth state management
        ├── utils/
        │   └── severity.js    ← Score-to-severity mapper
        └── components/
            ├── Home.jsx        ← Landing page
            ├── Signup.jsx      ← Registration form
            ├── Signin.jsx      ← Login form
            ├── Dashboard.jsx   ← User dashboard
            ├── Guidelines.jsx  ← Pre-test guidelines + caretaker form
            ├── TestPage.jsx    ← Question-by-question test UI
            ├── ResultPage.jsx  ← Test results + analytics
            ├── Profile.jsx     ← User profile page
            ├── Analytics.jsx   ← User analytics page
            ├── Header.jsx      ← Top navigation bar
            ├── Sidebar.jsx     ← Side navigation
            ├── Footer.jsx      ← Footer
            ├── ui/
            │   ├── Button.jsx  ← Reusable button
            │   └── Card.jsx    ← Reusable card
            └── admin/
                ├── AdminDashboard.jsx   ← Admin user list
                └── AdminUserDetail.jsx  ← Admin user detail + tests
```

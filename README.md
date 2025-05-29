
# Task Management Dashboard 🧠✅

A full-stack **Task Management App** with a modern UI, built using **Next.js (Frontend)** and **Django REST Framework (Backend)**. Users can create, update, delete, filter, and search tasks with secure JWT-based authentication.

---

## 🔧 Tech Stack

### Frontend (Next.js)
- **React 18** + **Tailwind CSS**
- State Management with **useState**, **useEffect**
- **JWT Token Auth** (stored in `localStorage`)
- **Dynamic Filtering & Search**

### Backend (Django REST Framework)
- Token-based auth (JWT)
- CRUD API endpoints for tasks
- Django Models: `User`, `Task`

---

## 📦 Features

- 🔐 Secure Login / Logout (JWT)
- 🆕 Create tasks with title, description, due date, status, and priority
- 🔁 Edit / Update / Delete tasks
- 🔍 Filter by **Status** and **Priority**
- 🕵️ Search tasks by **title** or **description**
- 🧭 User-friendly, responsive dashboard UI

---

## 🚀 Getting Started



### 2️⃣ Set up the Backend

> 📁 Assumes you have a Django project in `backend/`

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Make sure to enable CORS and JWT in Django settings.

---

### 3️⃣ Set up the Frontend

> 📁 Assumes you have a Next.js project in `frontend/`

```bash
cd ../frontend
npm install
```


```env

```

Run the development server:

```bash
npm run dev
```

---


```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

**Backend (`settings.py`):**
- Enable `rest_framework`, `corsheaders`, and JWT middleware.
- Set up `CORS_ORIGIN_ALLOW_ALL = True` (for dev) or specific origins.

---
## 🧾 API Endpoints

### 🔐 Authentication

#### ✅ Register a New User
- **POST** `/api/auth/register/`
```json
{
  "username": "athul",
  "email": "athul@example.com",
  "password": "TestPassword123!"
}
```

#### 🔓 Login
- **POST** `/api/auth/login/`
```json
{
  "username": "athul",
  "password": "TestPassword123!"
}
```
> ✅ On success, returns a **JWT token** which must be sent as a Bearer token in subsequent requests.

---

### 🧩 Task Management Endpoints

All endpoints require `Authorization: Bearer <token>` in headers.

#### 📥 Create a Task
- **POST** `/api/tasks/`
```json
{
  "title": "Stack Project",
  "description": "Implement task manager",
  "due_date": "2025-06-05T18:00:00Z",
  "priority": "High",
  "status": "Pending"
}
```

#### 📄 Get All Tasks
- **GET** `/api/tasks/`

#### 📄 Get a Single Task
- **GET** `/api/tasks/{id}/`

#### ✏️ Update a Task
- **PUT** `/api/tasks/4/`
```json
{
  "title": "Stack Project",
  "description": "Implement task manager",
  "due_date": "2025-06-05T18:00:00Z",
  "priority": "High",
  "status": "Completed"
}
```

#### 🗑 Delete a Task
- **DELETE** `/api/tasks/{id}/`

---
## 🧠 To Do (Future Enhancements)

- ✅ Pagination
- ✅ Sorting by Due Date or Priority
- ✅ User Registration / Forgot Password
- 🧠 Drag-and-drop task reordering
- 📈 Analytics dashboard (e.g., task progress charts)
- 🌐 Deployment (Vercel + Render/Heroku)

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and open a PR with a clear description.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Author

**Athul Shaji**  
Full Stack Developer  
[GitHub](https://github.com/Athul3Shaji) • [LinkedIn](https://linkedin.com/in/athulshaji)

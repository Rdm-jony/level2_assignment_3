# 📚 Library Management API with Express, TypeScript & MongoDB

A simple Express + MongoDB backend for managing library books and borrow records.

---

## 📦 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Language:** TypeScript

---

## 📁 Folder Structure

```text
src/
│
├── app/
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
│
├── controller/
│   ├── book_controller.ts        # Book API endpoints
│   └── borrow_controller.ts      # Borrow API endpoints
│
├── model/
│   ├── book_model.ts             # Book schema and pre middleware
│   └── borrow_model.ts           # Borrow schema and instance method
│
├── interface/
│   ├── book_interface.ts
│   └── borrow_interface.ts
```


_ _ _
## 📘 API Endpoints

### 🔹 Books

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| GET    | `/books`         | Get all books (with optional filters) |
| GET    | `/books/:bookId` | Get a specific book                   |
| POST   | `/books`         | Create a new book                     |
| PATCH  | `/books/:bookId` | Update a book                         |
| DELETE | `/books/:bookId` | Delete a book                         |

### ✅ Optional Query Parameters (GET /books)

filter — filter by genre

sortBy — sort field (e.g., title)

sort — asc or desc

limit — number of results (default: 4)

### 🔹 Borrow Records

| Method | Endpoint   | Description                   |
| ------ | ---------- | ----------------------------- |
| POST   | `/borrows` | Borrow a book                 |
| GET    | `/borrows` | Get summary of borrowed books |

_ _ _

## 🧠 Features

🔸 Custom validation using Mongoose schema rules

🔸 Automatically mark a book as unavailable if copies reach zero

🔸 Aggregation pipeline to get borrowed book stats (title, ISBN, total quantity)

🔸 Middleware to clean up borrows when a book is deleted (findOneAndDelete)

_ _ _

## ⚙️ Setup Instructions

### ✅ Clone the repository
```
git clone https://github.com/Rdm-jony/level2_assignment_3.git
cd level2_assignment_3

```



# Inventory & Order Management System

A full-stack web application for managing customers, products, orders, and suppliers. Includes separate dashboards for customers and administrators, along with real-time stock validation and automatic order status updates.

---

## ✅ Features

### Customer Side

* User registration and login (JWT-based)
* View available products
* Add to cart and place orders with future delivery date
* Update personal and payment details
* View order history
* Prevent over-ordering beyond stock

### Admin Side

* Admin login with protected access
* Dashboard to manage:

  * Orders (update status: delivered / rejected)
  * Customers (view/edit)
  * Products (with stock management)
  * Suppliers and categories
* Automatic daily update for overdue orders
* Backup the database to file and to S3

---

## ⚙️ Technologies

### Frontend

* HTML, CSS (style.css)
* Vanilla JavaScript

### Backend

* Node.js + Express
* MongoDB Atlas + Mongoose
* JWT authentication (token stored in cookies)
* Amazon S3 for database backups
* Railway deployment platform

---

## 📁 Project Structure

* `frontend/`: Static HTML pages, JS scripts, shared CSS, and dynamic navbar.
* `backend/`: Express server, models, routes, services, middleware, and database logic.

---

## 🛠️ Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the `backend/` folder with the following:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
secret_key=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your_bucket
VAT_RATE=0.17
```

3. Run the server:

```bash
node backend/server.js
```

4. Open `frontend/index.html` in your browser.

---

## 🔐 Demo Users

### Customer:

* **Username:** `user`
* **Password:** `123456`

### Admin:

* **Username:** `admin`
* **Password:** `admin`

*(You may also use `createAdmin.js` to add your own admin)*

---

## 🌐 Live Website

[https://inventoryprj-production.up.railway.app/](https://inventoryprj-production.up.railway.app/)

---

## 📦 GitHub Repository

[https://github.com/MoradiAsaf/Inventory_project](https://github.com/MoradiAsaf/Inventory_project)

---

## ✏️ Notes

* All orders are checked against available stock before being accepted.
* System automatically marks overdue orders as "delivered".
* Full S3 integration for daily backup routine.
* Clean, modular structure ready for scaling.

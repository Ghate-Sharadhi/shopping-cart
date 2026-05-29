🛒 TechCart — Full Stack Shopping Cart

A full-stack shopping cart application built with React, Node.js, Express, and MongoDB Atlas.

---

📁 Project Structure

shopping-cart/
├── backend/      # Node.js API
├── frontend/     # React App
└── README.md

---

⚙️ Backend Setup

Create a ".env" file inside the "backend" folder and add:

PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_here

Install dependencies:

cd backend
npm install

Start the backend server:

npm run dev

Server runs at:

http://localhost:5000

---

🎨 Frontend Setup

cd frontend
npm install
npm start

Application runs at:

http://localhost:3000

---

✅ Features Implemented

- User registration and login with JWT authentication
- Product listing fetched from MongoDB
- Add to cart with stock validation
- Quantity update with + / − controls
- Remove items from cart
- Cart persistence in MongoDB
- Order summary page
- Protected routes
- Product detail popup
- Loading indicators for API calls
- Error handling with UI messages
- Empty state screens

---

🎯 Bonus Features

- ✅ Cart persisted in MongoDB database
- ✅ Quantity button disabled at stock limit
- ✅ Order summary with Place Order
- ✅ Loading and error states
- ✅ Product stock decreases after order placement

---

⚠️ Known Limitations

- No payment gateway integration yet
- Orders are simulated after clicking "Place Order"

---

🛠️ Tech Stack

Frontend

- React
- React Router
- Axios

Backend

- Node.js
- Express.js
- JWT Authentication

Database

- MongoDB Atlas
- Mongoose
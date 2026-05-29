TechCart – Full Stack Shopping Cart Application

TechCart is a full-stack shopping cart application developed using React, Node.js, Express.js, and MongoDB Atlas. The project demonstrates user authentication, product management, cart operations, and order processing in a modern web application.



Project Structure

shopping-cart/
├── backend/
├── frontend/
└── README.md



 Backend Setup

Create a ".env" file inside the "backend" folder and add the following variables:

PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_here

Install dependencies and start the backend server:

cd backend
npm install
npm run dev

The backend server runs on:

http://localhost:5000


 Frontend Setup

Install dependencies and start the React application:

cd frontend
npm install
npm start

The frontend application runs on:

http://localhost:3000



 Features Implemented

- User registration and login using JWT authentication
- Product listing with data fetched from MongoDB Atlas
- Add products to cart with stock validation
- Increase and decrease product quantity using cart controls
- Remove products from the cart
- Cart data stored and persisted in MongoDB
- Order summary page before checkout
- Protected routes for authenticated users
- Product detail popup for quick viewing
- Loading indicators during API requests
- User-friendly error handling
- Empty state screens for products and cart



 Additional Features

>  Cart persistence using MongoDB
>  Quantity increment disabled when stock limit is reached
>  Order summary with Place Order functionality
>  Loading and error states implemented across API calls
>  Product stock automatically updated after successful order placement



 Current Limitations

- Payment gateway integration is not implemented
- Orders are simulated after clicking the Place Order button


Technologies Used

Frontend

> React
> React Router
> Axios

Backend

> Node.js
> Express.js
> JWT Authentication

Database

> MongoDB Atlas
> Mongoose



 Outcomes

Through this project, I gained practical experience in building a full-stack web application, implementing authentication, connecting React with REST APIs, managing MongoDB databases, and handling real-world shopping cart functionality.
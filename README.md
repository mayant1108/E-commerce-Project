# Meesho Clone

A full-stack eCommerce marketplace built with React, Vite, Tailwind CSS, Express, MongoDB, Mongoose, JWT auth, bcrypt password hashing, cart, wishlist, checkout, seller dashboard and admin dashboard.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Context API
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT and bcryptjs
- Uploads: Local image uploads, with optional Cloudinary support
- Payments: Cash on Delivery, with optional Razorpay order creation

## Folder Structure

```text
client/
  src/
    api/
    components/
    context/
    data/
    pages/
    utils/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    seed/
    uploads/
    utils/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start MongoDB locally and seed demo data:

```bash
npm run seed
```

The seed script is idempotent: it creates or updates demo users, categories and products without clearing existing carts, orders or wishlist data.

4. Run the app:

```bash
npm run dev
```

Client: `http://localhost:5173`  
API: `http://localhost:5000`

## Demo Accounts

After running `npm run seed`:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@meesho.test` | `Admin@123` |
| Seller | `seller@meesho.test` | `Seller@123` |
| User | `user@meesho.test` | `User@123` |

## Environment

Server:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/meesho_clone
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Client:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=
```

## API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

Products:

- `GET /api/products`
- `GET /api/products/trending`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Categories:

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Cart:

- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:productId`
- `DELETE /api/cart/:productId`
- `DELETE /api/cart`

Wishlist:

- `GET /api/wishlist`
- `POST /api/wishlist`
- `POST /api/wishlist/:productId`
- `DELETE /api/wishlist/:productId`

Orders:

- `POST /api/orders`
- `GET /api/orders/mine`
- `GET /api/orders`
- `PUT /api/orders/:id/status`

Admin and Seller:

- `GET /api/admin/summary`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
- `GET /api/seller/summary`
- `GET /api/seller/products`
- `GET /api/seller/orders`

Uploads and Payments:

- `POST /api/uploads/image`
- `POST /api/payments/razorpay/order`

## Notes

- The frontend uses fallback catalogue data so the shopping UI can be explored even before the API is connected.
- Product creation, seller analytics, admin analytics and order history use the real API when MongoDB is running.
- Cloudinary uploads are enabled by adding Cloudinary credentials and calling `/api/uploads/image?provider=cloudinary`.

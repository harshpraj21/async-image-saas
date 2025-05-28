# Async Image Task SaaS with Credit Billing

A scalable SaaS platform where users can upload images with metadata, which are processed asynchronously. The app follows a credit-based billing system where each task consumes credits. Users can top up credits using Razorpay. Results are displayed on a responsive dashboard.

---

##  Tech Stack

**Backend**: FastAPI, PostgreSQL (Supabase), Celery, Redis  
**Frontend**: Next.js (App Router), TailwindCSS, Shadcn UI  
**Payments**: Razorpay  
**DevOps**: Docker, Docker Compose

---

##  Features

### Authentication (JWT)

- Signup/Login with secure password hashing.
- JWT tokens with expiry and refresh logic.

### Async Task Submission

- Upload image + metadata via form.
- Save task details and image path to DB.
- Send image processing task to Celery.
- Simulated image processing (resize, grayscale).

### Credit-Based Billing

- Deduct 1 credit per task submission.
- Block submission if credits are insufficient.
- Razorpay integration to buy credits.
- Razorpay webhook updates credit balance.

### Dashboard (Next.js)

- View current credit balance.
- Upload form for image + metadata.
- Task history with status:
  - `queued`, `processing`, `completed`, `failed`
- Razorpay-powered credit purchase UI.

---


## Project Structure

```

Image-saas/
├── backend/
│ ├── app/
│ ├── alembic/
│ ├── Dockerfile
│ └── requirements.txt
├── frontend/
│ └── (Next.js App Router)
├── docker-compose.yml
└── .env.example
```

---

## Frontend Highlights
 - Shadcn UI used for consistent styling.
 - Responsive Dashboard:
    - Form for uploading image & metadata.
    - Task list with status tags.
    - Credit counter & buy credits button.
 - Razorpay Checkout UI


## API Overview 

#### Documentation: http://localhost:8000/docs (Will be available on project run)

- `POST /signup` – Register a new user
- `POST /login` – Authenticate and get token
- `POST /tasks` – Submit task with image
- `GET /tasks` – Retrieve all tasks
- `GET /tasks/{id}` – Get a task by ID
- `GET /credits` – Check credit balance
- `POST /create-order` – Razorpay order creation
- `POST /webhook/razorpay` – Handle Razorpay webhook

## Docker

### Dockerfile 
 - Dockerfile (Backend)
 - Uses python:3.10-slim
 - Installs dependencies via requirements.txt
 - Sets working directory and runs with uvicorn

### docker-compose.yml
 - backend (FastAPI app)
 - worker (Celery worker)
 - redis

---

## Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Python 3.10+
- Supabase project (PostgreSQL)
- Redis instance (included via Docker)
- Razorpay test account



### 1. **Clone the Repository**
```bash
git clone https://github.com/harshpraj21/async-image-saas.git
cd async-image-saas
```

### 2. **Setup Environment Variables**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Fill out necessary credentials
```

### 3. **Run Docker Compose**
```bash
docker-compose up --build
```

This will launch:
 - FASTAPI Backend
 - Redis
 - Celey Worker


### 4. **Run Alembic Migrations**
Project uses Alembic with SQLModel for database schema management
```bash
docker exec -it images-saas-api alembic upgrade head
# alembic upgrade head (run locally)
```

> API Documentation will be available at: http://localhost:8000/docs



### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend will be available at `http://localhost:3000`


## Razorpay Setup

1. **Create Razorpay Account**
   - Visit: https://razorpay.com
   - Register and switch to **Test Mode**.

2. **Get Test API Keys**
   - Go to **Settings > API Keys**
   - Click **Generate Test Key**
   - Copy `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET_KEY`

3. **Add to .env File**

```env
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_SECRET_KEY=your_test_secret_key
```

### Razorpay Webhook Configuration

1. **Navigate to Webhooks in Razorpay Dashboard**
   - Go to **Settings > Webhooks**
   - Click **Add New Webhook**

2. **Webhook URL**

```
http://<your-backend-domain>/payments/webhook
```

> During local development, use `ngrok` to expose your backend:

```bash
ngrok http 8000
```

> Then use `https://<random>.ngrok.io/payments/webhook` as the webhook URL.

3. **Webhook Secret**

- Set a **secret** (e.g. `my_webhook_secret`)
- Add it to your `.env` file:

```env
RAZORPAY_WEBHOOK_SECRET=my_webhook_secret
```

4. **Select Events**

Enable the following events:

- `payment.captured`
- `payment.failed`
- `order.paid`

5. **Implement Webhook Handler**

Backend listens to `/payments/webhook` route to verify signature and update user credits.

---

## ⚠️ Note on Credit Plans

> For now, the user needs to manually insert plans into the `credit_plan` table before using the credit purchase operations on the frontend. This is required for the Razorpay order creation and payment flow to work properly.

Example SQL to insert a plan:

```sql
INSERT INTO credit_plans (id, credits, price, created_at)
VALUES (gen_random_uuid(), 10, 100, now());
```
- Price must be in rupees



## Database Migrations with Alembic

### Create a New Migration
```bash
alembic revision --autogenerate -m "[message]"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Downgrade Migration
```bash
alembic downgrade -1
```

For detailed Alembic setup in a FastAPI + SQLModel project, ensure your models are imported properly in `env.py`.

---



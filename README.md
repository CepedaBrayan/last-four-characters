# Last-Four-Characters API

A simple and efficient **NestJS backend** that masks all but the last four characters of any string.  
It includes an **in-memory cache using MongoDB** to avoid recomputation and exposes **Swagger API docs**.

---

## Features

- Mask any input string, leaving only the last 4 visible.  
- Caches previous results in MongoDB (acts like a NoSQL key-value cache).  
- If you send the same string twice → the same MongoDB record ID is returned.  
- Swagger documentation auto-generated with NestJS decorators. 

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | [NestJS](https://nestjs.com) |
| Language | TypeScript |
| Database | MongoDB Atlas |
| Deployment | Vercel (Serverless Functions) |
| API Docs | Swagger / OpenAPI |

---

## ⚙️ Local Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/last-four-characters.git
cd last-four-characters
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Copy the example file:
```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB credentials:
```env
# .env
ENV=local
PORT=3000
MONGODB_NAME=<your-database-name>
MONGODB_URI=<your-mongodb-connection-string>
MONGODB_MASK_COLLECTION=<your-collection-name>
```

### 4️⃣ Run the app
```bash
npm run start:dev
```

You should see:
```
✅ Connected to MongoDB: <your-database-name>
🚀 App running on port 3000
```

---

## 📘 API Documentation (Swagger)

Once the server is running, open your browser at:

👉 [http://localhost:3000/docs](http://localhost:3000/docs)

You’ll see a full Swagger UI where you can:
- Test both endpoints (`POST /mask` and `GET /mask/{insertedId}`)
- See example requests/responses
- Try different strings interactively

---

## API Flow

### 1️⃣ **Create a masked record**
**Endpoint:** `POST /mask`  
**Body:**
```json
{
  "chain": "4556364607935616"
}
```

**Response:**
```json
{
  "original": "4556364607935616",
  "masked": "############5616",
  "insertedId": "random-mongodb-object-id"
}
```

**What happens under the hood:**
- The service checks MongoDB for an existing record with the same `original_chain`.
- If found, it reuses the existing record and returns it.
- If not found, it creates a new masked record, saves it, and returns it.

Try sending the **same string again** — you’ll notice you get **the same `insertedId`**, proving the cache works.

---

### 2️⃣ **Retrieve a masked record**
**Endpoint:** `GET /mask/{insertedId}`  

Example:
```
GET /mask/67068d5b2f79a8a72a0e16fb
```

**Response:**
```json
{
  "internal_id": "random-internal-id",
  "ip": "random-ip-address",
  "original_chain": "4556364607935616",
  "masked_chain": "############5616",
  "created_at": 1728402800000
}
```

If no record is found for that ID → you’ll get a `404 Not Found`.

---


## 🧪 Example workflow (quick demo)

```bash
# 1️⃣ Run server
npm run start:dev

# 2️⃣ Create a masked record
curl -X POST http://localhost:3000/mask   -H "Content-Type: application/json"   -d '{"chain":"4556364607935616"}'

# 3️⃣ Hit the same again (cache hit)
curl -X POST http://localhost:3000/mask   -H "Content-Type: application/json"   -d '{"chain":"4556364607935616"}'

# 4️⃣ Use the returned ID in a GET
curl http://localhost:3000/mask/<insertedId>
```

---

## Notes

- MongoDB automatically handles connection pooling.
- All timestamps (`created_at`) are numeric UNIX epoch values (ms).
- Works both locally and on Vercel’s serverless runtime.
- For proper local testing, ensure having your mongoDB cluster accessible and your ENV variables set correctly.

---

## License
MIT — free to use, modify, and deploy.  

---

### 🧑‍💻 Author
Built by **Brayan Cepeda** — Software Engineer & Cloud Enthusiast  
💼 [LinkedIn](https://www.linkedin.com/in/brayan-rivera-cepeda-65a273139) · Senior Backend Engineer | 7 yoe | @Cashea | NestJS, FastAPI, Pulumi, Web3, GCP, AWS | IELTS C1

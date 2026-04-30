Development quickstart — Countdown app

Prerequisites
- Node.js 18+
- npm
- MongoDB (local) or Docker

Start MongoDB (Docker):

```bash
docker run -d --name countdown-mongo -p 27017:27017 -v mongo_data:/data/db mongo:6
```

Seed demo user and loans:

```bash
cd server
node seeds/seed.js
```

This prints a demo JWT token. Copy it.

Start server:

```bash
cd server
npm run dev
```

Start client:

```bash
cd client
npm install
npm run dev
```

Using the demo token
- Open the app and the Lock Widget in Dashboard.
- Paste the demo token into the widget input and click `Use Token`.
- The widget will call `/api/loan` with the token and show demo loans.

Auth flow
- The client `Auth.jsx` calls `/api/auth/signup` and `/api/auth/login` and stores the JWT in `localStorage` under `token`.
- Use the normal signup/login UI to create a real user instead of demo token.

Next steps
- I can wire the Auth UI to automatically seed demo user during development, or
- Add a small sample-data endpoint that returns demo loans without auth for quick UI work.

Which would you prefer?
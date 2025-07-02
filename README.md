# TabSync - iPhone Safari Tabs Viewer

TabSync is a simple, self-hosted tool that lets you view your open Safari tabs on your iPhone directly in your browser on your laptop.  

It uses an Express backend, a Vite React frontend, and integrates with **Pushcut** and an **iOS Shortcut** to securely send your open tabs to your local server.

---

## How It Works

1. **Click the Fetch Tabs button** on the web app.
2. The frontend sends a **GET request** to the backend.
3. The backend **triggers a webhook** (via Pushcut) which sends a push notification to your iPhone.
4. When you tap the notification, it runs an **iOS Shortcut** that collects your open Safari tabs and sends them as a **POST request** to the server.
5. The server stores these tabs and responds to the original GET request with the up-to-date list.
6. The tabs are displayed in the web app.

---

## Features

- Works over your local network.
- Displays tab titles and URLs as clickable links.
- Includes a simple search filter.
- Caches the last fetched tabs in local storage for faster reloads.

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Integrations:** Pushcut Webhooks, Apple Shortcuts
- **Other:** Local Storage caching, Bearer token-based API authentication
---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Athiruban8/TabSync.git
cd TabSync
```
### 2. Install Server Dependencies
```bash
cd server
npm install
```
### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Configure Environment Variables
Create .env files for both the server and client.

Server:
```bash
AUTH_TOKEN=your-auth-token
WEBHOOK_URL='https://api.pushcut.io/...'
```
Client:
```bash
VITE_AUTH_TOKEN=your-auth-token
```
Make sure to use the same token in both the .env files.
You can generate a strong token for your setup by running the following command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start the Server
```bash
cd ../server
npm run dev
```
### 6. Start the Client
```bash
cd ../client
npm run dev
```
### The React app will be available at http://localhost:5173.
---

## iOS Shortcut Setup
- Download the iOS shortcut from this link - https://www.icloud.com/shortcuts/6698774288da493bb213f154c370f5ac
- Replace <your-server-ip> in the POST request to the IP address of you server.
- In the Authorization header of the request, replace <your-auth-token> with your token (the one used in the .env files).
- Install Pushcut from the iOS app store and create a notification.
- Under the "Actions" tab add the iOS shortcut.

NOTE: Make sure both your phone and server are on the same local network.

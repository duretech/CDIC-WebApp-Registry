# CDIC-WebApp-Registry

This repository contains the source code for the **CDIC Web Application**.

This document describes setup, configuration, authentication, and deployment steps.


---

## 📦 Prerequisites

- Node.js v16 or above
- npm (comes with Node.js)
- Google Maps API Key
- Backend Server URL
- Access to deployment server
- Basic auth key

---

## ⚙️ Runtime Configuration

### 📁 File Location
public/runtime-config.json

### ✏️ Required Configuration

```json
{
  "basename": "cdicv2",
  "baseUrl": "https://YOUR_BASE_URL/",
  "apiServiceKey": "https://YOUR_BASE_URL/service/api/",
  "apiSurveyKey": "https://YOUR_BASE_URL/service/",
  "googleMapAPIKey": "YOUR_GOOGLE_MAPS_API_KEY",
  "basicAuth": "Basic YOUR_BASIC_AUTH_KEY"
}
```

> Replace `YOUR_BASIC_AUTH_KEY` with your **own Base64-encoded key** during development and deployment.

---

## 🔐 Basic Authentication Configuration

Basic Authentication requires a Base64-encoded value derived from username and password use below default credentials for same:

```
username:admin
password:Test@123
```

### Example Format (Placeholder Only)

```
Basic YOUR_BASIC_AUTH_KEY
```

⚠️ The above value is a **placeholder** and does NOT represent real credentials.

---

## 🛠 How to Generate Base64 Auth

### JavaScript
```js
const username = "admin";
const password = "Test@123";
const auth = "Basic " + btoa(username + ":" + password);
```

### Java
```java
String username = "admin";
String password = "Test@123";

String auth = "Basic " + Base64.getEncoder()
    .encodeToString((username + ":" + password).getBytes());
```

---

## 📁 Deployment Folder (basename)

The `basename` defines the deployment folder name.

Deployment URL:
```
https://YOUR_SERVER_URL/cdicv2
```

---

## 🖼 Media Folder Setup

Create a media folder at:
```
https://YOUR_SERVER_URL/media
```

Required files:
- logo.png
- landingpage.png

---

## 🔐 Content Security Policy (CSP)

File: `public/index.html`

Add your server URL to `connect-src`:
```
https://YOUR_SERVER_URL
```

---

## ▶️ Deployment Steps

1. Generate build
```bash
npm run build
```

2. Create folder `cdicv2` on server

3. Copy build ZIP into folder

4. Extract ZIP inside `cdicv2`

5. Verify URL
```
https://YOUR_SERVER_URL/cdicv2
```

---

## ✅ Final Checklist

- runtime-config.json updated
- placeholder Base64 key replaced during deployment
- basename matches folder
- media folder created
- CSP updated
- build deployed successfully

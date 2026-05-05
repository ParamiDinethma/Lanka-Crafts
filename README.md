# Lanka Crafts – Digital Platform for Traditional Artisans

Lanka Crafts is a comprehensive digital ecosystem designed to empower local Sri Lankan artisans by connecting them directly with tourists. The platform facilitates workshop discovery, secure bookings, and cultural experience sharing through both web and mobile interfaces.

## 🚀 Project Architecture

The project is built using a centralized backend (REST API) that serves both the web and mobile frontends, ensuring data consistency across all platforms.

### Folder Structure
* **`/backend`**: Node.js & Express API (Centralized logic & database management).
* **`/webapp-frontend`**: React.js web application for artisans, tourists, and admins.
* **`/mobileapp-frontend`**: React Native mobile application for on-the-go tourist experiences.

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** Secured Database (SQL/NoSQL)
* **Authentication:** JWT (JSON Web Tokens)
* **Frontend (Web):** React.js
* **Frontend (Mobile):** React Native
* **APIs:** Map API, AI Assistance, Email Services

---

## ⚙️ Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn
* React Native CLI (for mobile development)

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/lanka-crafts.git](https://github.com/your-username/lanka-crafts.git)
   cd lanka-crafts
   ```
2. **Run the Backend:**
  ```bash
  cd backend
  npm install
  npm start # Runs on http://localhost:5000
  ```
3. **Run the Web App:**
  ```bash
  cd webapp-frontend
  npm install
  npm start # Runs on http://localhost:3000
  ```
4. **Run the Mobile App:**
  ```bash
  cd mobileapp-frontend
  npm install
  npx react-native run-android # or run-ios
  ```

## Getting Started

1. Run `npm install`
2. Run `npm run dev`



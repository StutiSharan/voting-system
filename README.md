# 🗳️ Online Voting System

An advanced city-wise voting application built with **React**, **Firebase Realtime Database**. This system allows voters to register, authenticate their identity via facial recognition, and securely cast a vote in their respective city.

---

## 🔥 Key Features

- ✅ User registration and login using Firebase Auth
- 📝 Profile creation with personal details and voter ID
- 🎥 Real-time webcam-based face verification before voting
- 🗳️ City-wise elections (e.g., Kanpur, Mumbai, etc.)
- 🔐 One vote per user per election
- 📊 Live vote counts and leaderboard
- 🎉 Confetti celebration after voting
- 🌗 Dark/Light mode toggle
- 🧾 Responsive and animated UI with TailwindCSS & Framer Motion

---

## ⚙️ Technologies Used

| Category        | Technology                     |
|----------------|---------------------------------|
| Frontend       | React (Vite)                    |
| Styling        | Tailwind CSS, Framer Motion     |
| Notifications  | react-hot-toast                 |
| Auth           | Firebase Authentication         |
| Database       | Firebase Realtime Database      |                    |

---

## 🧑‍💻 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/online-voting-system.git
cd online-voting-system

# User Flow

Register/Login

Email & password-based authentication.

Create Profile

Enter: name, age, city, bio, voter ID, and upload a clear front-face image.

Voting

Select your state and city.

See available elections and candidates.

Only if your profile city matches selected city → vote allowed.

Leaderboard

Shows leading candidates and vote counts (only after voting).

Contributers:
Stuti Sharan (Individual)
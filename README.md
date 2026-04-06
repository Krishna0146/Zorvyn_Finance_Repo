# 💰 Zorvyn Finance – React Financial Dashboard

A modern, responsive **financial dashboard frontend** built using **React + Vite**, designed to help users track income, expenses, savings, investments, and more — all without any backend.

---

## 🚀 Features

### 📊 Dashboard
- Summary cards:
  - Total Balance
  - Total Income
  - Total Expenses
  - Savings
  - Investment Value
- Charts:
  - Income vs Expenses (line chart)
  - Expense categories (bar chart)
  - Income distribution (donut chart)
- Highlights:
  - Highest & lowest expenses
  - Top income source

---

### 💵 Income Management
- Add, edit, delete income entries
- Categorized income tracking
- Visual charts for income distribution

---

### 💸 Expenses with Limits
- Track expenses by category
- Set monthly limits
- Progress bars for usage
- Alerts when limits are exceeded

---

### 🏦 EMIs / Loans / Fees
- Manage loans and EMI schedules
- Track due dates and payments
- Fee tracking (paid / pending)
- Overdue alerts with visual indicators

---

### 🎯 Savings Goals
- Create savings targets
- Track progress with percentage bars
- Summary of total saved vs target

---

### 📈 Investments
- Track stocks, mutual funds, SIPs
- Calculate:
  - Current value (mock)
  - Profit / Loss
- Portfolio visualization (line chart)

---

### ✈️ Trip Expense Tracker
- Individual & group trips
- Add expenses inside trips
- Split expenses among users
- Show who owes whom
- Compare trip costs visually

---

### 👨‍👩‍👧 Admin / User Control
- Role-based UI:
  - Admin (parent)
  - User (child)
- Admin features:
  - Manage users
  - Set spending limits
  - View dashboards
- User restrictions:
  - Limited control
  - Alerts on exceeding limits

---

### 🌗 Light / Dark Mode
- Smooth toggle between themes
- Finance-themed colors (green, blue)
- Animated transitions

---

### 🔍 Filters, Search & Sorting
- Date range filters
- Category filters
- Search by name/description
- Sorting:
  - Amount
  - Date

---

### 🔔 Smart Alerts
- Expense limit exceeded
- EMI/fee overdue
- Savings goal achieved
- Investment performance alerts
- Auto-dismiss + manual close

---

## 🛠️ Tech Stack

- ⚛️ React 18+
- ⚡ Vite
- 🎨 CSS / Tailwind (or CSS variables)
- 🔀 React Router DOM
- 💾 sessionStorage (no backend)

---

## 📁 Project Structure
fintrack/
│
├── public/
│
├── src/
│ ├── components/
│ │ ├── Sidebar.jsx
│ │ ├── Header.jsx
│ │ ├── Card.jsx
│ │ ├── Chart.jsx
│ │ ├── Toast.jsx
│ │ ├── ThemeToggle.jsx
│ │ └── Filters.jsx
│ │
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Income.jsx
│ │ ├── Expenses.jsx
│ │ ├── EMIsLoans.jsx
│ │ ├── Fees.jsx
│ │ ├── Savings.jsx
│ │ ├── Investments.jsx
│ │ ├── Trips.jsx
│ │ ├── Admin.jsx
│ │ └── Settings.jsx
│ │
│ ├── hooks/
│ │ ├── useSessionStorage.js
│ │ └── useFinanceData.js
│ │
│ ├── utils/
│ │ ├── calculations.js
│ │ ├── filters.js
│ │ └── constants.js
│ │
│ ├── styles/
│ │ └── theme.css
│ │
│ ├── App.jsx
│ ├── main.jsx
│
└── package.json

## 📦 Installation & Setup

### 1 Clone the repository

    git clone https://github.com/Krishna0146/Zorvyn_Finance_Repo.git
    cd Zorvyn_Finance_Repo


### 2 Install Dependencies
     yarn install

### 3 Run
       
       yarn start
 ### runs on 
       http://localhost:3000


## output screen
<img width="1900" height="867" alt="image" src="https://github.com/user-attachments/assets/91f52aef-0f5f-4e04-b51e-997765a0f107" />

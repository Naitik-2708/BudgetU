# 🎓 Student Budget System

A clean, fully-featured personal finance tracker built for students. Track income, log expenses, set budget goals, and visualize spending — all stored locally in your browser.

---

## ✨ Features

- **Dashboard** — Real-time summary cards: income, expenses, savings, balance
- **Add Transaction** — Log income or expenses with categories, dates, and notes
- **Transactions** — Full list with search, filter by type/category/month, delete entries
- **Budget Goals** — Set monthly spending caps per category with visual progress bars
- **Reports** — Charts showing trends, category breakdowns, income vs expense

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js (CDN) |
| Storage | Browser `localStorage` |
| Fonts | Space Grotesk + DM Mono (Google Fonts) |

## 📁 Project Structure

```
student-budget-system/
├── index.html          # Main HTML shell, all tabs
├── css/
│   └── style.css       # All styles — sidebar, cards, forms, responsive
├── js/
│   ├── storage.js      # localStorage abstraction layer
│   ├── transactions.js # Data helpers, filters, formatters, category maps
│   ├── charts.js       # Chart.js wrappers (pie, bar, line, doughnut)
│   └── app.js          # All UI logic, event handlers, render functions
└── README.md
```

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/student-budget-system.git
   cd student-budget-system
   ```

2. Open `index.html` directly in your browser — no build step, no server needed.

## 💡 Usage Guide

- Start by clicking **Add Transaction** and logging your first income (stipend, pocket money, etc.)
- Add expenses daily — food, transport, stationery, etc.
- Go to **Budget Goals** to set monthly limits for each category
- Visit **Reports** to see where your money is going
- Use the month filter on the Dashboard to review past months

## 🗓️ Categories

**Income**: Stipend/Scholarship, Part-time Job, Family Transfer, Freelance, Other Income

**Expense**: Food & Canteen, Hostel/Rent, Transport, Books & Stationery, Clothing, Mobile/Internet, Entertainment, Medical, Gym & Sports, Miscellaneous

## 📸 Screenshots

> Add screenshots here after deployment

## 🔮 Future Enhancements

- [ ] Export data to CSV
- [ ] Dark mode toggle
- [ ] Recurring transactions
- [ ] Cloud sync (Firebase)
- [ ] PWA / installable app
- [ ] Multi-currency support

## 📄 License

MIT License — free to use and modify.

---

Made with ❤️ for students who want to take control of their finances.

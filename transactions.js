// ===== TRANSACTIONS MODULE =====

const CATEGORIES = {
  income: ['Stipend / Scholarship', 'Part-time Job', 'Family Transfer', 'Freelance', 'Other Income'],
  expense: ['Food & Canteen', 'Hostel / Rent', 'Transport', 'Books & Stationery', 'Clothing', 'Mobile / Internet', 'Entertainment', 'Medical', 'Gym & Sports', 'Miscellaneous']
};

const CATEGORY_ICONS = {
  'Food & Canteen': '🍱',
  'Hostel / Rent': '🏠',
  'Transport': '🚌',
  'Books & Stationery': '📚',
  'Clothing': '👕',
  'Mobile / Internet': '📱',
  'Entertainment': '🎬',
  'Medical': '💊',
  'Gym & Sports': '⚽',
  'Miscellaneous': '🔧',
  'Stipend / Scholarship': '🎓',
  'Part-time Job': '💼',
  'Family Transfer': '👨‍👩‍👦',
  'Freelance': '💻',
  'Other Income': '💰',
};

const CHART_COLORS = [
  '#1D9E75','#D85A30','#378ADD','#BA7517','#534AB7',
  '#5DCAA5','#F0997B','#85B7EB','#EF9F27','#AFA9EC',
];

const Transactions = {

  getAll() { return Storage.getTransactions(); },

  getFiltered({ type = 'all', category = 'all', month = 'all', search = '' } = {}) {
    let list = this.getAll();
    if (type !== 'all') list = list.filter(t => t.type === type);
    if (category !== 'all') list = list.filter(t => t.category === category);
    if (month !== 'all') list = list.filter(t => t.date.startsWith(month));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getTotals(list) {
    const income = list.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = list.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  },

  getByCategory(list) {
    const map = {};
    list.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  },

  getMonthlyData() {
    const all = this.getAll();
    const months = {};
    all.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      months[m][t.type] += t.amount;
    });
    return months;
  },

  getAvailableMonths() {
    const all = this.getAll();
    const months = [...new Set(all.map(t => t.date.slice(0, 7)))].sort().reverse();
    return months;
  },

  formatCurrency(n) {
    return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  },

  formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  formatMonth(m) {
    const [y, mo] = m.split('-');
    const d = new Date(y, parseInt(mo) - 1, 1);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  },

  getIcon(category) {
    return CATEGORY_ICONS[category] || '💰';
  },

  getTodayTotals() {
    const today = new Date().toISOString().slice(0, 10);
    const todayTx = this.getAll().filter(t => t.date === today);
    return this.getTotals(todayTx);
  }
};

// ===== STORAGE MODULE =====
// Handles all localStorage read/write operations

const Storage = {
  KEYS: {
    TRANSACTIONS: 'budgetu_transactions',
    GOALS: 'budgetu_goals',
  },

  getTransactions() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.TRANSACTIONS)) || [];
    } catch { return []; }
  },

  saveTransactions(data) {
    localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(data));
  },

  addTransaction(tx) {
    const all = this.getTransactions();
    tx.id = Date.now().toString();
    all.push(tx);
    this.saveTransactions(all);
    return tx;
  },

  deleteTransaction(id) {
    const all = this.getTransactions().filter(t => t.id !== id);
    this.saveTransactions(all);
  },

  getGoals() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.GOALS)) || {};
    } catch { return {}; }
  },

  saveGoal(category, amount) {
    const goals = this.getGoals();
    goals[category] = parseFloat(amount);
    localStorage.setItem(this.KEYS.GOALS, JSON.stringify(goals));
  },

  deleteGoal(category) {
    const goals = this.getGoals();
    delete goals[category];
    localStorage.setItem(this.KEYS.GOALS, JSON.stringify(goals));
  },

  clearAll() {
    localStorage.removeItem(this.KEYS.TRANSACTIONS);
    localStorage.removeItem(this.KEYS.GOALS);
  }
};

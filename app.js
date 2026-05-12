// ===== MAIN APP =====

let currentType = 'income';

// ---- UTILS ----
function fmt(n) { return Transactions.formatCurrency(n); }

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'form-msg ' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'form-msg'; }, 3000);
}

// ---- TAB NAVIGATION ----
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + tabId)?.classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
  renderTab(tabId);
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    switchTab(item.dataset.tab);
  });
});

document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    switchTab(btn.dataset.tab);
  });
});

// ---- POPULATE MONTH DROPDOWNS ----
function populateMonthDropdowns() {
  const months = Transactions.getAvailableMonths();
  const selects = ['monthFilter', 'filterMonth', 'reportMonth'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = el.value;
    while (el.options.length > 1) el.remove(1);
    months.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = Transactions.formatMonth(m);
      el.appendChild(opt);
    });
    if (months.includes(cur)) el.value = cur;
  });
}

// ---- POPULATE CATEGORY DROPDOWNS ----
function populateCategoryDropdowns(type) {
  const cats = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
  const select = document.getElementById('txCategory');
  select.innerHTML = '<option value="">Select category</option>';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    select.appendChild(opt);
  });
}

function populateFilterCategories() {
  const all = [...CATEGORIES.income, ...CATEGORIES.expense];
  const el = document.getElementById('filterCategory');
  while (el.options.length > 1) el.remove(1);
  all.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    el.appendChild(opt);
  });
}

function populateGoalCategories() {
  const el = document.getElementById('goalCategory');
  el.innerHTML = '';
  CATEGORIES.expense.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    el.appendChild(opt);
  });
}

// ---- RENDER DASHBOARD ----
function renderDashboard() {
  const month = document.getElementById('monthFilter')?.value || 'all';
  const all = Transactions.getFiltered({ month });
  const { income, expense, balance } = Transactions.getTotals(all);
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  document.getElementById('totalIncome').textContent = fmt(income);
  document.getElementById('totalExpense').textContent = fmt(expense);
  document.getElementById('netSavings').textContent = fmt(balance);
  document.getElementById('currentBalance').textContent = fmt(balance);
  document.getElementById('incomeCount').textContent = all.filter(t => t.type === 'income').length + ' entries';
  document.getElementById('expenseCount').textContent = all.filter(t => t.type === 'expense').length + ' entries';
  document.getElementById('savingsRate').textContent = savingsRate + '% savings rate';
  document.getElementById('balanceStatus').textContent = balance >= 0 ? 'In surplus' : 'In deficit';

  const now = new Date();
  document.getElementById('currentMonth').textContent =
    now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Recent transactions (last 5)
  const recent = all.slice(0, 5);
  const recentEl = document.getElementById('recentTransactions');
  if (!recent.length) {
    recentEl.innerHTML = '<p class="empty-state">No transactions yet. Add your first one!</p>';
  } else {
    recentEl.innerHTML = recent.map(t => `
      <div class="tx-item">
        <div class="tx-icon ${t.type}">${Transactions.getIcon(t.category)}</div>
        <div class="tx-info">
          <div class="tx-desc">${t.desc}</div>
          <div class="tx-meta">${t.category} · ${Transactions.formatDate(t.date)}</div>
        </div>
        <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '−'}${fmt(t.amount)}</div>
      </div>
    `).join('');
  }

  // Pie chart
  const catData = Transactions.getByCategory(all);
  const labels = Object.keys(catData);
  const vals = Object.values(catData);
  Charts.pie('dashPieChart', labels, vals, 'categoryLegend');

  // Monthly bar chart
  renderMonthlyBar();
}

function renderMonthlyBar() {
  const monthly = Transactions.getMonthlyData();
  const months = Object.keys(monthly).sort().slice(-6);
  const labels = months.map(m => {
    const [y, mo] = m.split('-');
    return new Date(y, parseInt(mo) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  });
  Charts.bar(
    'monthlyBarChart',
    labels,
    months.map(m => monthly[m].income),
    months.map(m => monthly[m].expense)
  );
}

// ---- RENDER TRANSACTIONS TABLE ----
function renderTransactions() {
  const type = document.getElementById('filterType')?.value || 'all';
  const category = document.getElementById('filterCategory')?.value || 'all';
  const month = document.getElementById('filterMonth')?.value || 'all';
  const search = document.getElementById('searchTx')?.value || '';

  const list = Transactions.getFiltered({ type, category, month, search });
  document.getElementById('txCount').textContent = list.length + ' records';

  const tbody = document.getElementById('txTableBody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No transactions match the filters.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(t => `
    <tr>
      <td style="font-family:'DM Mono',monospace;font-size:13px;color:var(--text-muted)">${Transactions.formatDate(t.date)}</td>
      <td>
        <div style="font-weight:500">${t.desc}</div>
        ${t.note ? `<div style="font-size:12px;color:var(--text-muted)">${t.note}</div>` : ''}
      </td>
      <td><span class="cat-badge">${Transactions.getIcon(t.category)} ${t.category}</span></td>
      <td><span class="badge ${t.type}">${t.type}</span></td>
      <td class="right" style="font-family:'DM Mono',monospace;font-weight:600;color:${t.type === 'income' ? 'var(--green)' : 'var(--red)'}">
        ${t.type === 'income' ? '+' : '−'}${fmt(t.amount)}
      </td>
      <td>
        <button class="delete-btn" data-id="${t.id}" title="Delete">✕</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this transaction?')) {
        Storage.deleteTransaction(btn.dataset.id);
        populateMonthDropdowns();
        renderTransactions();
        toast('Transaction deleted');
      }
    });
  });
}

// ---- RENDER GOALS ----
function renderGoals() {
  const goals = Storage.getGoals();
  const now = new Date().toISOString().slice(0, 7);
  const thisMonth = Transactions.getFiltered({ month: now, type: 'expense' });
  const catSpent = Transactions.getByCategory(thisMonth);

  const el = document.getElementById('goalsList');
  if (!Object.keys(goals).length) {
    el.innerHTML = '<p class="empty-state">No goals set. Add one from the form.</p>';
    return;
  }

  el.innerHTML = Object.entries(goals).map(([cat, limit]) => {
    const spent = catSpent[cat] || 0;
    const pct = Math.min(100, Math.round((spent / limit) * 100));
    const cls = pct >= 90 ? 'danger' : pct >= 70 ? 'warn' : 'safe';
    return `
      <div class="goal-card">
        <div class="goal-header">
          <span class="goal-cat">${Transactions.getIcon(cat)} ${cat}</span>
          <span class="goal-amounts">${fmt(spent)} / ${fmt(limit)}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
        <div class="goal-pct">${pct}% used</div>
      </div>
    `;
  }).join('');
}

// ---- RENDER REPORTS ----
function renderReports() {
  const month = document.getElementById('reportMonth')?.value || 'all';
  const list = Transactions.getFiltered({ month });
  const { income, expense } = Transactions.getTotals(list);

  const monthly = Transactions.getMonthlyData();
  const monthKeys = Object.keys(monthly);
  const avgIncome = monthKeys.length ? monthKeys.reduce((s, m) => s + monthly[m].income, 0) / monthKeys.length : 0;
  const avgExpense = monthKeys.length ? monthKeys.reduce((s, m) => s + monthly[m].expense, 0) / monthKeys.length : 0;

  const expenses = list.filter(t => t.type === 'expense');
  const biggest = expenses.reduce((max, t) => t.amount > (max?.amount || 0) ? t : max, null);
  const catData = Transactions.getByCategory(list);
  const topCat = Object.entries(catData).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('avgIncome').textContent = fmt(avgIncome);
  document.getElementById('avgExpense').textContent = fmt(avgExpense);
  document.getElementById('biggestExpense').textContent = biggest ? fmt(biggest.amount) : '—';
  document.getElementById('topCategory').textContent = topCat ? topCat[0].split(' ')[0] : '—';

  // Doughnut
  Charts.pie('reportDoughnut', ['Income', 'Expense'], [income, expense], null);

  // Category bar
  const cats = Object.keys(catData);
  const vals = Object.values(catData);
  Charts.categoryBar('reportBar', cats, vals);

  // Line trend
  const months = Object.keys(monthly).sort().slice(-8);
  const labels = months.map(m => {
    const [y, mo] = m.split('-');
    return new Date(y, parseInt(mo) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  });
  Charts.line('trendLine', labels, [
    { label: 'Income', data: months.map(m => monthly[m].income), color: '#1D9E75' },
    { label: 'Expense', data: months.map(m => monthly[m].expense), color: '#D85A30' },
  ]);
}

// ---- ADD TRANSACTION FORM ----
document.getElementById('typeIncome').addEventListener('click', () => {
  currentType = 'income';
  document.getElementById('typeIncome').classList.add('active');
  document.getElementById('typeExpense').classList.remove('active');
  populateCategoryDropdowns('income');
});

document.getElementById('typeExpense').addEventListener('click', () => {
  currentType = 'expense';
  document.getElementById('typeExpense').classList.add('active');
  document.getElementById('typeIncome').classList.remove('active');
  populateCategoryDropdowns('expense');
});

document.getElementById('addTxBtn').addEventListener('click', () => {
  const desc = document.getElementById('txDesc').value.trim();
  const amount = parseFloat(document.getElementById('txAmount').value);
  const date = document.getElementById('txDate').value;
  const category = document.getElementById('txCategory').value;
  const note = document.getElementById('txNote').value.trim();

  if (!desc) return showMsg('formMsg', 'Please enter a description.', 'error');
  if (!amount || amount <= 0) return showMsg('formMsg', 'Please enter a valid amount.', 'error');
  if (!date) return showMsg('formMsg', 'Please select a date.', 'error');
  if (!category) return showMsg('formMsg', 'Please select a category.', 'error');

  Storage.addTransaction({ desc, amount, date, category, note, type: currentType });

  // Reset form
  document.getElementById('txDesc').value = '';
  document.getElementById('txAmount').value = '';
  document.getElementById('txNote').value = '';
  document.getElementById('txDate').value = new Date().toISOString().slice(0, 10);

  populateMonthDropdowns();
  renderTodayStats();
  showMsg('formMsg', 'Transaction added!', 'success');
  toast('Transaction added successfully!');
});

// ---- TODAY STATS ----
function renderTodayStats() {
  const { income, expense } = Transactions.getTodayTotals();
  document.getElementById('todayIn').textContent = fmt(income);
  document.getElementById('todayOut').textContent = fmt(expense);
}

// ---- SAVE GOAL ----
document.getElementById('saveGoalBtn').addEventListener('click', () => {
  const cat = document.getElementById('goalCategory').value;
  const amount = parseFloat(document.getElementById('goalAmount').value);
  if (!cat || !amount || amount <= 0) return toast('Enter a valid category and amount.');
  Storage.saveGoal(cat, amount);
  document.getElementById('goalAmount').value = '';
  renderGoals();
  toast('Goal saved!');
});

// ---- FILTER LISTENERS ----
['filterType', 'filterCategory', 'filterMonth', 'searchTx'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', renderTransactions);
  document.getElementById(id)?.addEventListener('change', renderTransactions);
});

document.getElementById('clearFilters')?.addEventListener('click', () => {
  document.getElementById('filterType').value = 'all';
  document.getElementById('filterCategory').value = 'all';
  document.getElementById('filterMonth').value = 'all';
  document.getElementById('searchTx').value = '';
  renderTransactions();
});

document.getElementById('monthFilter')?.addEventListener('change', renderDashboard);
document.getElementById('reportMonth')?.addEventListener('change', renderReports);

// ---- RESET ----
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset ALL data? This cannot be undone.')) {
    Storage.clearAll();
    populateMonthDropdowns();
    renderTab('dashboard');
    toast('All data cleared.');
  }
});

// ---- RENDER TAB ROUTER ----
function renderTab(tab) {
  populateMonthDropdowns();
  if (tab === 'dashboard') renderDashboard();
  else if (tab === 'add') renderTodayStats();
  else if (tab === 'transactions') { populateFilterCategories(); renderTransactions(); }
  else if (tab === 'goals') { populateGoalCategories(); renderGoals(); }
  else if (tab === 'reports') renderReports();
}

// ---- INIT ----
function init() {
  document.getElementById('txDate').value = new Date().toISOString().slice(0, 10);
  populateCategoryDropdowns('income');
  populateFilterCategories();
  populateGoalCategories();
  populateMonthDropdowns();
  renderDashboard();
}

init();

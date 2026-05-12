// ===== CHARTS MODULE =====

const Charts = {
  instances: {},

  destroy(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  pie(canvasId, labels, data, legendId) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (!data.length || data.every(d => d === 0)) {
      ctx.parentElement.innerHTML = '<p class="empty-state">No expense data yet.</p>';
      return;
    }

    const colors = CHART_COLORS.slice(0, labels.length);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ` ₹${ctx.parsed.toLocaleString('en-IN')} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    if (legendId) {
      const el = document.getElementById(legendId);
      if (el) {
        el.innerHTML = labels.map((l, i) =>
          `<div class="legend-item">
            <div class="legend-dot" style="background:${colors[i]}"></div>
            <span>${l}</span>
          </div>`
        ).join('');
      }
    }
  },

  bar(canvasId, labels, incomeData, expenseData) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: '#1D9E7522',
            borderColor: '#1D9E75',
            borderWidth: 1.5,
            borderRadius: 4,
          },
          {
            label: 'Expense',
            data: expenseData,
            backgroundColor: '#D85A3022',
            borderColor: '#D85A30',
            borderWidth: 1.5,
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { font: { family: 'Space Grotesk', size: 12 }, usePointStyle: true, pointStyleWidth: 8 }
          },
          tooltip: {
            callbacks: {
              label(ctx) { return ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`; }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Space Grotesk', size: 11 } }
          },
          y: {
            grid: { color: '#F1EFE8' },
            ticks: {
              font: { family: 'Space Grotesk', size: 11 },
              callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)
            }
          }
        }
      }
    });
  },

  line(canvasId, labels, datasets) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((d, i) => ({
          label: d.label,
          data: d.data,
          borderColor: d.color,
          backgroundColor: d.color + '18',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          fill: true,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { font: { family: 'Space Grotesk', size: 12 }, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label(ctx) { return ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`; }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Space Grotesk', size: 11 } } },
          y: {
            grid: { color: '#F1EFE8' },
            ticks: {
              font: { family: 'Space Grotesk', size: 11 },
              callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)
            }
          }
        }
      }
    });
  },

  categoryBar(canvasId, labels, data) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Spent',
          data,
          backgroundColor: CHART_COLORS.slice(0, labels.length),
          borderRadius: 4,
          borderWidth: 0,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) { return ` ₹${ctx.parsed.x.toLocaleString('en-IN')}`; }
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#F1EFE8' },
            ticks: {
              font: { family: 'Space Grotesk', size: 11 },
              callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)
            }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Space Grotesk', size: 11 } }
          }
        }
      }
    });
  }
};

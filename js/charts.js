// ==============================
// CHARTS.JS
// Handles all charts
// ==============================

let expenseChart = null;
let monthlyChart = null;
let categoryChart = null;


// ==============================
// Dashboard Expense Pie Chart
// ==============================
function renderExpenseChart() {
    const chartCanvas = document.getElementById("expenseChart");

    if (!chartCanvas) return;
    if (typeof Chart === "undefined") return;

    const expenses = getExpenses();

    let categoryTotals = {};

    expenses.forEach(expense => {
        const category = expense.category || "Others";
        const amount = Number(expense.amount) || 0;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // Destroy old chart
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(chartCanvas, {
        type: "pie",
        data: {
            labels: labels.length ? labels : ["No Data"],
            datasets: [{
                data: data.length ? data : [1]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}


// ==============================
// Insights page charts
// ==============================
function renderInsightsCharts() {
    renderMonthlyChart();
    renderCategoryChart();
}


// ==============================
// Monthly Spending Chart
// ==============================
function renderMonthlyChart() {
    const chartCanvas = document.getElementById("monthlyChart");

    if (!chartCanvas) return;
    if (typeof Chart === "undefined") return;

    const expenses = getExpenses();
    const monthlyTotals = {};

    expenses.forEach(expense => {

        if (!expense.date) return;

        const date = new Date(expense.date);

        if (isNaN(date)) return;

        const monthYear = date.toLocaleString("default", {
            month: "short",
            year: "numeric"
        });

        const amount = Number(expense.amount) || 0;

        if (!monthlyTotals[monthYear]) {
            monthlyTotals[monthYear] = 0;
        }

        monthlyTotals[monthYear] += amount;
    });

    const labels = Object.keys(monthlyTotals);
    const data = Object.values(monthlyTotals);

    // Destroy old chart
    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: labels.length ? labels : ["No Data"],
            datasets: [{
                label: "Monthly Expenses",
                data: data.length ? data : [0]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// ==============================
// Category Spending Doughnut Chart
// ==============================
function renderCategoryChart() {
    const chartCanvas = document.getElementById("categoryChart");

    if (!chartCanvas) return;
    if (typeof Chart === "undefined") return;

    const expenses = getExpenses();

    let categoryTotals = {};

    expenses.forEach(expense => {
        const category = expense.category || "Others";
        const amount = Number(expense.amount) || 0;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // Destroy old chart
    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(chartCanvas, {
        type: "doughnut",
        data: {
            labels: labels.length ? labels : ["No Data"],
            datasets: [{
                label: "Category Expenses",
                data: data.length ? data : [1]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}
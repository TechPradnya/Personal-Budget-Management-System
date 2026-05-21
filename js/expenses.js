// ==============================
// EXPENSES.JS
// Main expense logic
// ==============================


// ==============================
// Add Expense
// ==============================
function addExpense(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const reason = document.getElementById("reason").value.trim();
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const budgetInput = document.getElementById("budget").value;

    if (!amount || amount <= 0 || !reason || !category || !date) {
        alert("Please fill all required fields correctly.");
        return;
    }

    const expense = {
        id: generateExpenseId(),
        amount: Number(amount),
        reason,
        category,
        date,
        status: "Recorded"
    };

    // Save expense
    addExpenseToStorage(expense);

    // Save budget if entered
    if (budgetInput && parseFloat(budgetInput) > 0) {
        saveBudget(parseFloat(budgetInput));
    }

    // Reset form
    document.getElementById("expenseForm").reset();

    // Refresh UI
    renderExpenses();
    updateDashboard();

    if (typeof renderExpenseChart === "function") renderExpenseChart();
    if (typeof updateWarnings === "function") updateWarnings();
    if (typeof analyzeHabits === "function") analyzeHabits();
    if (typeof renderInsightsCharts === "function") renderInsightsCharts();
}


// ==============================
// Render expenses
// ==============================
function renderExpenses() {
    const expenses = getExpenses();

    renderDashboardTable(expenses);
    renderHistoryTable(expenses);
}


// ==============================
// Dashboard recent expense table
// ==============================
function renderDashboardTable(expenses) {
    const tableBody = document.getElementById("expenseTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!expenses || expenses.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    No expenses added yet
                </td>
            </tr>
        `;
        return;
    }

    expenses.slice(-5).reverse().forEach((expense, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${expense.reason || "-"}</td>
                <td>${expense.category || "-"}</td>
                <td>₹${Number(expense.amount) || 0}</td>
                <td>${expense.date || "-"}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// ==============================
// History full expense table
// ==============================
function renderHistoryTable(expenses) {
    const tableBody = document.getElementById("historyTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!expenses || expenses.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No expense history available
                </td>
            </tr>
        `;
        updateHistorySummary([]);
        return;
    }

    expenses.forEach((expense, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${expense.reason || "-"}</td>
                <td>${expense.category || "-"}</td>
                <td>₹${Number(expense.amount) || 0}</td>
                <td>${expense.date || "-"}</td>
                <td>${expense.status || "Recorded"}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openEditModal(${expense.id})">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    updateHistorySummary(expenses);
}


// ==============================
// Delete expense
// ==============================
function deleteExpense(id) {
    if (confirm("Delete this expense?")) {
        deleteExpenseFromStorage(id);

        renderExpenses();
        updateDashboard();

        if (typeof renderExpenseChart === "function") renderExpenseChart();
        if (typeof updateWarnings === "function") updateWarnings();
        if (typeof analyzeHabits === "function") analyzeHabits();
        if (typeof renderInsightsCharts === "function") renderInsightsCharts();
    }
}


// ==============================
// Update dashboard cards
// ==============================
function updateDashboard() {
    const expenses = getExpenses();
    const budget = Number(getBudget()) || 0;

    let todayTotal = 0;
    let monthlyTotal = 0;
    let categoryTotals = {};

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    expenses.forEach(expense => {
        const amount = Number(expense.amount) || 0;

        if (!expense.date) return;

        const expenseDate = new Date(expense.date);

        if (expense.date === today) {
            todayTotal += amount;
        }

        if (
            !isNaN(expenseDate) &&
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        ) {
            monthlyTotal += amount;
        }

        const category = expense.category || "Others";

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += amount;
    });

    // Top category
    let topCategory = "None";
    let maxAmount = 0;

    for (let category in categoryTotals) {
        if (categoryTotals[category] > maxAmount) {
            maxAmount = categoryTotals[category];
            topCategory = category;
        }
    }

    const remainingBudget =
        budget > 0 ? budget - monthlyTotal : 0;

    // Update UI safely
    const todayExpenseEl = document.getElementById("todayExpense");
    const monthlyExpenseEl = document.getElementById("monthlyExpense");
    const remainingBudgetEl = document.getElementById("remainingBudget");
    const topCategoryEl = document.getElementById("topCategory");

    if (todayExpenseEl) todayExpenseEl.textContent = `₹${todayTotal}`;
    if (monthlyExpenseEl) monthlyExpenseEl.textContent = `₹${monthlyTotal}`;
    if (remainingBudgetEl) remainingBudgetEl.textContent = `₹${remainingBudget}`;
    if (topCategoryEl) topCategoryEl.textContent = topCategory;
}


// ==============================
// History summary cards
// ==============================
function updateHistorySummary(expenses) {
    const totalExpense = expenses.reduce(
        (sum, exp) => sum + (Number(exp.amount) || 0),
        0
    );

    let categoryTotals = {};

    expenses.forEach(exp => {
        const category = exp.category || "Others";
        const amount = Number(exp.amount) || 0;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += amount;
    });

    let topCategory = "None";
    let max = 0;

    for (let category in categoryTotals) {
        if (categoryTotals[category] > max) {
            max = categoryTotals[category];
            topCategory = category;
        }
    }

    const totalExpenseEl = document.getElementById("historyTotalExpense");
    const totalRecordsEl = document.getElementById("historyTotalRecords");
    const topCategoryEl = document.getElementById("historyTopCategory");

    if (totalExpenseEl) totalExpenseEl.textContent = `₹${totalExpense}`;
    if (totalRecordsEl) totalRecordsEl.textContent = expenses.length;
    if (topCategoryEl) topCategoryEl.textContent = topCategory;
}


// ==============================
// Open edit modal
// ==============================
function openEditModal(id) {
    const expense = getExpenseById(id);

    if (!expense) return;

    document.getElementById("editExpenseId").value = expense.id;
    document.getElementById("editAmount").value = expense.amount;
    document.getElementById("editReason").value = expense.reason;
    document.getElementById("editCategory").value = expense.category;
    document.getElementById("editDate").value = expense.date;

    const modal = new bootstrap.Modal(
        document.getElementById("editExpenseModal")
    );

    modal.show();
}


// ==============================
// Save edited expense
// ==============================
function saveEditedExpense(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("editAmount").value);
    const reason = document.getElementById("editReason").value.trim();
    const category = document.getElementById("editCategory").value;
    const date = document.getElementById("editDate").value;

    if (!amount || amount <= 0 || !reason || !category || !date) {
        alert("Please fill all fields correctly.");
        return;
    }

    const updatedExpense = {
        id: Number(document.getElementById("editExpenseId").value),
        amount: Number(amount),
        reason,
        category,
        date,
        status: "Updated"
    };

    updateExpenseInStorage(updatedExpense);

    renderExpenses();
    updateDashboard();

    if (typeof renderExpenseChart === "function") renderExpenseChart();
    if (typeof updateWarnings === "function") updateWarnings();
    if (typeof analyzeHabits === "function") analyzeHabits();
    if (typeof renderInsightsCharts === "function") renderInsightsCharts();

    bootstrap.Modal.getInstance(
        document.getElementById("editExpenseModal")
    ).hide();
}
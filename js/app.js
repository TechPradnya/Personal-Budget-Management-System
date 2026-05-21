// ==============================
// APP.JS
// Main controller
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------
    // Dashboard form submit
    // ------------------------------
    const expenseForm = document.getElementById("expenseForm");

    if (expenseForm) {
        expenseForm.addEventListener("submit", addExpense);
    }

    // ------------------------------
    // Edit form submit (history page)
    // ------------------------------
    const editExpenseForm = document.getElementById("editExpenseForm");

    if (editExpenseForm) {
        editExpenseForm.addEventListener("submit", saveEditedExpense);
    }

    // ------------------------------
    // Search filter
    // ------------------------------
    const searchInput = document.getElementById("searchExpense");

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    // ------------------------------
    // Category filter
    // ------------------------------
    const categoryFilter = document.getElementById("filterCategory");

    if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFilters);
    }

    // ------------------------------
    // Date filter
    // ------------------------------
    const dateFilter = document.getElementById("filterDate");

    if (dateFilter) {
        dateFilter.addEventListener("change", applyFilters);
    }

    // ------------------------------
    // Export CSV
    // ------------------------------
    const exportBtn = document.getElementById("exportCSV");

    if (exportBtn) {
        exportBtn.addEventListener("click", exportExpensesCSV);
    }

    // ------------------------------
    // Safe page loading
    // ------------------------------

    if (typeof renderExpenses === "function") {
        renderExpenses();
    }

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    if (typeof renderExpenseChart === "function") {
        renderExpenseChart();
    }

    if (typeof updateWarnings === "function") {
        updateWarnings();
    }

    if (typeof analyzeHabits === "function") {
        analyzeHabits();
    }

    if (typeof renderInsightsCharts === "function") {
        renderInsightsCharts();
    }

});


// ==============================
// Apply filters (history page)
// ==============================
function applyFilters() {
    const expenses = getExpenses();

    const searchText =
        document.getElementById("searchExpense")?.value.toLowerCase() || "";

    const selectedCategory =
        document.getElementById("filterCategory")?.value || "";

    const selectedDate =
        document.getElementById("filterDate")?.value || "";

    const filteredExpenses = expenses.filter(expense => {

        const reason =
            expense.reason ? expense.reason.toLowerCase() : "";

        const matchesSearch =
            reason.includes(searchText);

        const matchesCategory =
            selectedCategory === "" ||
            expense.category === selectedCategory;

        const matchesDate =
            selectedDate === "" ||
            expense.date === selectedDate;

        return matchesSearch && matchesCategory && matchesDate;
    });

    if (typeof renderHistoryTable === "function") {
        renderHistoryTable(filteredExpenses);
    }
}


// ==============================
// Export CSV
// ==============================
function exportExpensesCSV() {
    const expenses = getExpenses();

    if (!expenses || expenses.length === 0) {
        alert("No expenses to export.");
        return;
    }

    let csvContent = "ID,Reason,Category,Amount,Date,Status\n";

    expenses.forEach(expense => {
        csvContent += `${expense.id || ""},${expense.reason || ""},${expense.category || ""},${expense.amount || 0},${expense.date || ""},${expense.status || "Recorded"}\n`;
    });

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}
// ==============================
// WARNINGS.JS
// Smart warning logic
// ==============================


// ==============================
// Update all warnings
// ==============================
function updateWarnings() {
    const expenses = getExpenses();
    const budget = Number(getBudget()) || 0;

    // Reset if no expenses
    if (!expenses || expenses.length === 0) {
        updateWarningUI(
            "No warnings yet.",
            "Low"
        );
        return;
    }

    let totalExpense = 0;
    let todayExpense = 0;
    let categoryTotals = {};

    const today = new Date().toISOString().split("T")[0];

    expenses.forEach(expense => {
        const amount = Number(expense.amount) || 0;
        const category = expense.category || "Others";

        totalExpense += amount;

        if (expense.date === today) {
            todayExpense += amount;
        }

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += amount;
    });

    // Find top category
    let topCategory = "None";
    let topAmount = 0;

    for (let category in categoryTotals) {
        if (categoryTotals[category] > topAmount) {
            topAmount = categoryTotals[category];
            topCategory = category;
        }
    }

    // Default warning
    let warningMessage = "No warnings yet.";
    let warningLevel = "Low";

    // ==============================
    // Warning priority logic
    // ==============================

    // Highest priority → budget exceeded
    if (budget > 0 && totalExpense > budget) {
        warningMessage =
            "Budget exceeded! You have spent more than your monthly budget.";
        warningLevel = "High";
    }

    // Medium priority → daily overspending
    else if (todayExpense > 1000) {
        warningMessage =
            "High spending detected today.";
        warningLevel = "Medium";
    }

    // Medium priority → category overspending
    else if (topAmount > 5000) {
        warningMessage =
            `High spending on ${topCategory}. Consider reducing expenses.`;
        warningLevel = "Medium";
    }

    // Update UI
    updateWarningUI(warningMessage, warningLevel);
}


// ==============================
// Update warning boxes safely
// ==============================
function updateWarningUI(message, level) {

    // Dashboard warning box
    const warningBox =
        document.getElementById("warningBox");

    if (warningBox) {
        warningBox.className =
            `alert ${getWarningClass(level)} shadow-sm mb-4`;

        warningBox.innerHTML = `
            <strong><i class="bi bi-exclamation-triangle-fill"></i> Warning:</strong>
            ${message}
        `;
    }

    // Insights warning box
    const habitWarningBox =
        document.getElementById("habitWarningBox");

    if (habitWarningBox) {
        habitWarningBox.className =
            `alert ${getWarningClass(level)} shadow-sm mb-4`;

        habitWarningBox.innerHTML = `
            <strong><i class="bi bi-exclamation-circle-fill"></i> Smart Alert:</strong>
            ${message}
        `;
    }

    // Warning level card
    const warningLevelEl =
        document.getElementById("warningLevel");

    if (warningLevelEl) {
        warningLevelEl.textContent = level;
    }
}


// ==============================
// Warning color helper
// ==============================
function getWarningClass(level) {
    switch (level) {
        case "High":
            return "alert-danger";

        case "Medium":
            return "alert-warning";

        case "Low":
        default:
            return "alert-success";
    }
}
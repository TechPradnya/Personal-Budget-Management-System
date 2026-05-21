// ==============================
// HABITS.JS
// Spending habit analysis
// ==============================


// ==============================
// Analyze habits
// ==============================
function analyzeHabits() {
    const expenses = getExpenses();
    const budget = Number(getBudget()) || 0;

    // Reset if no expenses
    if (!expenses || expenses.length === 0) {
        setText("avgDailySpend", "₹0");
        setText("insightTopCategory", "None");
        setText("warningLevel", "Low");
        setText("smartSuggestion", "Good");

        setText("habitHighestCategory", "None");
        setText("habitFrequentExpense", "None");
        setText("habitAverageExpense", "₹0");
        setText("habitPattern", "Normal");
        setText("budgetHealth", "Healthy");

        updateRecommendations(
            "Healthy",
            "None",
            0,
            "Start tracking expenses"
        );

        updateHabitWarningBox("No unusual spending pattern detected.");

        return;
    }

    let totalExpense = 0;
    let categoryTotals = {};
    let reasonCounts = {};

    let uniqueDates = new Set();

    expenses.forEach(expense => {
        const amount = Number(expense.amount) || 0;
        const category = expense.category || "Others";
        const reason = expense.reason || "Unknown";

        totalExpense += amount;

        if (expense.date) {
            uniqueDates.add(expense.date);
        }

        // Category totals
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += amount;

        // Reason counts
        if (!reasonCounts[reason]) {
            reasonCounts[reason] = 0;
        }

        reasonCounts[reason]++;
    });

    // ==============================
    // Average daily spending
    // ==============================
    const averageDaily =
        uniqueDates.size > 0
            ? Math.round(totalExpense / uniqueDates.size)
            : 0;

    // ==============================
    // Highest category
    // ==============================
    let topCategory = "None";
    let topCategoryAmount = 0;

    for (let category in categoryTotals) {
        if (categoryTotals[category] > topCategoryAmount) {
            topCategoryAmount = categoryTotals[category];
            topCategory = category;
        }
    }

    // ==============================
    // Most frequent expense reason
    // ==============================
    let frequentExpense = "None";
    let maxReasonCount = 0;

    for (let reason in reasonCounts) {
        if (reasonCounts[reason] > maxReasonCount) {
            maxReasonCount = reasonCounts[reason];
            frequentExpense = reason;
        }
    }

    // ==============================
    // Spending pattern
    // ==============================
    let spendingPattern = "Normal";

    if (averageDaily > 1000) {
        spendingPattern = "High Daily Spending";
    }

    if (topCategoryAmount > 5000) {
        spendingPattern = "Category Overspending";
    }

    // ==============================
    // Budget health
    // ==============================
    let budgetHealth = "Healthy";
    let warningLevel = "Low";

    if (budget > 0) {
        const percentage = (totalExpense / budget) * 100;

        if (percentage >= 100) {
            budgetHealth = "Budget Exceeded";
            warningLevel = "High";
        } else if (percentage >= 80) {
            budgetHealth = "Warning";
            warningLevel = "Medium";
        }
    }

    // ==============================
    // Smart suggestion
    // ==============================
    let smartSuggestion = "Good";

    if (budgetHealth === "Budget Exceeded") {
        smartSuggestion = "Reduce Spending";
    } else if (topCategoryAmount > 5000) {
        smartSuggestion = `Reduce ${topCategory}`;
    } else if (averageDaily > 1000) {
        smartSuggestion = "Track Daily Expenses";
    }

    // ==============================
    // Update recommendations
    // ==============================
    updateRecommendations(
        budgetHealth,
        topCategory,
        averageDaily,
        smartSuggestion
    );

    // ==============================
    // Warning box
    // ==============================
    updateHabitWarningBox(
        budgetHealth === "Budget Exceeded"
            ? "Your spending has exceeded budget!"
            : budgetHealth === "Warning"
            ? "You are nearing your budget limit."
            : "No unusual spending pattern detected."
    );

    // ==============================
    // Update insight cards
    // ==============================
    setText("avgDailySpend", `₹${averageDaily}`);
    setText("insightTopCategory", topCategory);
    setText("warningLevel", warningLevel);
    setText("smartSuggestion", smartSuggestion);

    // ==============================
    // Update habit summary table
    // ==============================
    setText("habitHighestCategory", topCategory);
    setText("habitFrequentExpense", frequentExpense);
    setText("habitAverageExpense", `₹${averageDaily}`);
    setText("habitPattern", spendingPattern);
    setText("budgetHealth", budgetHealth);
}


// ==============================
// Update recommendations
// ==============================
function updateRecommendations(
    budgetHealth,
    topCategory,
    averageDaily,
    smartSuggestion
) {
    const recommendationList =
        document.getElementById("recommendationList");

    if (!recommendationList) return;

    let recommendations = [];

    if (budgetHealth === "Budget Exceeded") {
        recommendations.push(
            "Your expenses have crossed budget. Reduce spending."
        );
    }

    if (topCategory !== "None") {
        recommendations.push(
            `Highest spending is on ${topCategory}. Review this category.`
        );
    }

    if (averageDaily > 1000) {
        recommendations.push(
            "Daily expenses are high. Try setting daily limits."
        );
    }

    recommendations.push(`Suggestion: ${smartSuggestion}`);

    if (recommendations.length === 0) {
        recommendations.push("No recommendations yet.");
    }

    recommendationList.innerHTML = "";

    recommendations.forEach(rec => {
        recommendationList.innerHTML += `
            <li class="list-group-item">
                <i class="bi bi-lightbulb text-warning"></i>
                ${rec}
            </li>
        `;
    });
}


// ==============================
// Update warning box
// ==============================
function updateHabitWarningBox(message) {
    const warningBox = document.getElementById("habitWarningBox");

    if (!warningBox) return;

    warningBox.innerHTML = `
        <strong><i class="bi bi-exclamation-circle-fill"></i> Smart Alert:</strong>
        ${message}
    `;
}


// ==============================
// Safe text update helper
// ==============================
function setText(id, value) {
    const el = document.getElementById(id);

    if (el) {
        el.textContent = value;
    }
}
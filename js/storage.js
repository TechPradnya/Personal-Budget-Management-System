// ==============================
// STORAGE.JS
// Handles LocalStorage operations
// ==============================

// Storage keys
const EXPENSE_KEY = "expenses";
const BUDGET_KEY = "monthlyBudget";


// ==============================
// Check if localStorage available
// ==============================
function storageAvailable() {
    try {
        const test = "__storage_test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.error("LocalStorage not available:", e);
        return false;
    }
}


// ==============================
// Get all expenses
// ==============================
function getExpenses() {
    if (!storageAvailable()) return [];

    try {
        const expenses = localStorage.getItem(EXPENSE_KEY);

        if (!expenses) return [];

        const parsed = JSON.parse(expenses);

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Error reading expenses:", error);
        return [];
    }
}


// ==============================
// Save all expenses
// ==============================
function saveExpenses(expenses) {
    if (!storageAvailable()) return;

    try {
        localStorage.setItem(
            EXPENSE_KEY,
            JSON.stringify(expenses)
        );
    } catch (error) {
        console.error("Error saving expenses:", error);
    }
}


// ==============================
// Add new expense
// ==============================
function addExpenseToStorage(expense) {
    const expenses = getExpenses();
    expenses.push(expense);
    saveExpenses(expenses);
}


// ==============================
// Delete expense by ID
// ==============================
function deleteExpenseFromStorage(id) {
    let expenses = getExpenses();

    expenses = expenses.filter(
        expense => Number(expense.id) !== Number(id)
    );

    saveExpenses(expenses);
}


// ==============================
// Update expense by ID
// ==============================
function updateExpenseInStorage(updatedExpense) {
    let expenses = getExpenses();

    expenses = expenses.map(expense =>
        Number(expense.id) === Number(updatedExpense.id)
            ? updatedExpense
            : expense
    );

    saveExpenses(expenses);
}


// ==============================
// Save monthly budget
// ==============================
function saveBudget(budget) {
    if (!storageAvailable()) return;

    const safeBudget = Number(budget) || 0;

    try {
        localStorage.setItem(BUDGET_KEY, safeBudget);
    } catch (error) {
        console.error("Error saving budget:", error);
    }
}


// ==============================
// Get monthly budget
// ==============================
function getBudget() {
    if (!storageAvailable()) return 0;

    try {
        return Number(localStorage.getItem(BUDGET_KEY)) || 0;
    } catch (error) {
        console.error("Error reading budget:", error);
        return 0;
    }
}


// ==============================
// Clear all expenses
// ==============================
function clearAllExpenses() {
    if (!storageAvailable()) return;

    localStorage.removeItem(EXPENSE_KEY);
}


// ==============================
// Clear everything
// ==============================
function clearAllData() {
    if (!storageAvailable()) return;

    localStorage.removeItem(EXPENSE_KEY);
    localStorage.removeItem(BUDGET_KEY);
}


// ==============================
// Generate unique expense ID
// ==============================
function generateExpenseId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}


// ==============================
// Get expense by ID
// ==============================
function getExpenseById(id) {
    const expenses = getExpenses();

    return expenses.find(
        expense => Number(expense.id) === Number(id)
    );
}


// ==============================
// Initialize storage
// ==============================
function initializeStorage() {
    if (!storageAvailable()) {
        alert("LocalStorage is not supported in this browser.");
        return;
    }

    if (!localStorage.getItem(EXPENSE_KEY)) {
        localStorage.setItem(
            EXPENSE_KEY,
            JSON.stringify([])
        );
    }

    if (!localStorage.getItem(BUDGET_KEY)) {
        localStorage.setItem(
            BUDGET_KEY,
            "0"
        );
    }
}


// ==============================
// Run initialization
// ==============================
initializeStorage();
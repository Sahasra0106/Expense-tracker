
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");
const transactionList = document.getElementById("transaction-list");

// Load saved transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Format amounts in Indian Rupees
function formatMoney(amount) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR"
  });
}

// Update totals and transaction list
function updateUI() {
  let income = 0;
  let expenses = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expenses += transaction.amount;
    }
  });

  const balance = income - expenses;

  balanceDisplay.textContent = formatMoney(balance);
  incomeDisplay.textContent = formatMoney(income);
  expensesDisplay.textContent = formatMoney(expenses);

  transactionList.innerHTML = "";

  transactions.forEach(function (transaction) {
    const li = document.createElement("li");
    const details = document.createElement("span");
    const deleteButton = document.createElement("button");

    details.textContent =
      transaction.description + " — " + formatMoney(transaction.amount);

    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
      transactions = transactions.filter(function (item) {
        return item.id !== transaction.id;
      });

      saveTransactions();
      updateUI();
    });

    li.appendChild(details);
    li.appendChild(deleteButton);
    transactionList.appendChild(li);
  });
}

// Save transactions in the browser
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Add a new transaction
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid description and amount.");
    return;
  }

  const transaction = {
    id: Date.now() + Math.random(),
    description: description,
    amount: amount,
    type: type
  };

  transactions.push(transaction);

  saveTransactions();
  updateUI();

  form.reset();
});

// Display saved transactions when the page opens
updateUI();

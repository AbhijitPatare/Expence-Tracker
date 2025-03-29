
let transactions = [];

document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to delete selected button
    document.getElementById("deleteSelected").addEventListener("click", deleteSelectedRows);
    document.getElementById("updateSelected").addEventListener("click", updateSelectedRows);
});

function addTransaction() {
    let description = document.getElementById("description").value;
    let amount = document.getElementById("amount").value;
    let balanceElement = document.getElementById("balance");

    if (description.trim() === "" || amount.trim() === "" || isNaN(amount)) {
        alert("Please enter valid details!");
        return;
    }

    let balance = parseFloat(balanceElement.innerText);
    amount = parseFloat(amount);

    // Update balance
    balance += amount;
    balanceElement.innerText = balance;

    // Add to Excel Sheet (Table)
    let expenseTable = document.getElementById("expenseBody");
    let newRow = expenseTable.insertRow();

    let checkboxCell = newRow.insertCell(0);
    let dateCell = newRow.insertCell(1);
    let descCell = newRow.insertCell(2);
    let amountCell = newRow.insertCell(3);

    // Add values to the new row
    let currentDate = new Date().toLocaleDateString();
    
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "rowCheckbox";
    
    checkboxCell.appendChild(checkbox);
    dateCell.innerText = currentDate;
    descCell.innerText = description;
    amountCell.innerText = `₹${amount}`;

    // Clear Input Fields
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
}

function deleteSelectedRows() {
    let checkboxes = document.querySelectorAll(".rowCheckbox:checked");
    checkboxes.forEach((checkbox) => {
        let row = checkbox.closest("tr");
        row.remove();
    });
}

function updateSelectedRows() {
    let checkboxes = document.querySelectorAll(".rowCheckbox:checked");
    checkboxes.forEach((checkbox) => {
        let row = checkbox.closest("tr");
        let descCell = row.cells[2];
        let amountCell = row.cells[3];

        let newDesc = prompt("Enter new description:", descCell.innerText);
        let newAmount = prompt("Enter new amount:", amountCell.innerText.replace("₹", ""));

        if (newDesc !== null && newAmount !== null && !isNaN(newAmount)) {
            descCell.innerText = newDesc;
            amountCell.innerText = `₹${newAmount}`;
        }
    });
}


function updateUI() {
    let balance = transactions.reduce((acc, t) => acc + t.amount, 0);
    document.getElementById("balance").innerText = balance;

    let list = document.getElementById("transaction-list");
    list.innerHTML = "";

    transactions.forEach(t => {
        let li = document.createElement("li");
        li.innerHTML = `${t.description} ₹${t.amount} <button onclick="deleteTransaction(${t.id})">❌</button>`;
        list.appendChild(li);
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
    saveToLocal();
}

function saveToLocal() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadFromLocal() {
    let savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        updateUI();
    }
}

window.onload = loadFromLocal;

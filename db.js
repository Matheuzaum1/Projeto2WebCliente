// Inicializa o IndexedDB
const dbName = 'FinanceDB';
const storeName = 'transactions';

// Função para abrir/criar o banco de dados
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        // Configura o banco de dados na primeira criação
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Função para adicionar uma transação ao banco de dados
function addTransaction(transaction) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transactionDB = db.transaction(storeName, 'readwrite');
            const store = transactionDB.objectStore(storeName);
            const request = store.add(transaction);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

// Função para buscar todas as transações
function getAllTransactions() {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transactionDB = db.transaction(storeName, 'readonly');
            const store = transactionDB.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

// Função para remover uma transação pelo ID
function deleteTransaction(id) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transactionDB = db.transaction(storeName, 'readwrite');
            const store = transactionDB.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    });
}

// Integração com a página do app
document.addEventListener('DOMContentLoaded', () => {
    const financeForm = document.getElementById('financeForm');
    const financeTable = document.getElementById('financeTable');

    if (financeForm && financeTable) {
        const tbody = financeTable.querySelector('tbody');

        // Carregar transações do IndexedDB ao iniciar
        getAllTransactions().then((transactions) => {
            transactions.forEach((transaction) => {
                addRowToTable(transaction, tbody);
            });
        });

        // Adicionar uma nova transação
        financeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);

            const transaction = { description, amount };

            addTransaction(transaction).then((id) => {
                transaction.id = id; // Salvar o ID gerado pelo IndexedDB
                addRowToTable(transaction, tbody);
            });

            financeForm.reset();
        });
    }
});

// Função auxiliar para adicionar uma linha na tabela
function addRowToTable(transaction, tbody) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${transaction.description}</td>
        <td>R$ ${transaction.amount.toFixed(2)}</td>
        <td><button class="deleteBtn" data-id="${transaction.id}">Excluir</button></td>
    `;

    tbody.appendChild(row);

    // Configurar o botão de exclusão
    const deleteButton = row.querySelector('.deleteBtn');
    deleteButton.addEventListener('click', () => {
        const id = parseInt(deleteButton.getAttribute('data-id'), 10);
        deleteTransaction(id).then(() => {
            row.remove();
        });
    });
}

// IndexedDB setup
const dbName = "UserDatabase";
let db;

// WebSocket setup
const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => console.log("WebSocket connected.");
socket.onmessage = (event) => console.log("Message from server:", event.data);

window.onload = () => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
            db.createObjectStore("users", { keyPath: "username" });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("IndexedDB initialized.");
    };

    request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
    };

    document.getElementById("registerForm").addEventListener("submit", registerUser);
    document.getElementById("loginForm").addEventListener("submit", loginUser);
};

// Register user
function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const userData = JSON.stringify({ username, password });
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    store.add({ username, password }).onsuccess = () => {
        document.cookie = `user=${username}; path=/;`;
        alert("Cadastro realizado com sucesso!");

        // Send data to server via WebSocket
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(userData);
        }
    };

    transaction.onerror = (event) => {
        alert("Erro ao cadastrar: " + event.target.error);
    };
}

// Login user
function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");

    const request = store.get(username);
    request.onsuccess = () => {
        if (request.result && request.result.password === password) {
            document.cookie = `user=${username}; path=/;`;
            alert("Login bem-sucedido!");

            // Send login status to server
            const loginData = JSON.stringify({ action: "login", username });
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(loginData);
            }
        } else {
            alert("Usuário ou senha incorretos.");
        }
    };

    request.onerror = (event) => {
        alert("Erro ao realizar login.");
    };
}

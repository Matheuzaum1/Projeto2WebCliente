// Gerenciar usuários no localStorage
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const financeForm = document.getElementById('financeForm');
    const financeTable = document.getElementById('financeTable');
    const logoutButton = document.getElementById('logout');

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                document.cookie = `user=${username}; path=/`;
                window.location.href = 'app.html';
            } else {
                alert('Usuário ou senha inválidos!');
            }
        });
    }

    // Cadastro
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.username === newUsername)) {
                alert('Usuário já cadastrado!');
                return;
            }

            users.push({ username: newUsername, password: newPassword });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'index.html';
        });
    }

    // Página do app
    if (financeForm && financeTable) {
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
        const currentUser = userCookie ? userCookie.split('=')[1] : null;

        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('welcomeUser').textContent = currentUser;

        financeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${description}</td>
                <td>R$ ${amount.toFixed(2)}</td>
                <td><button class="deleteBtn">Excluir</button></td>
            `;

            financeTable.querySelector('tbody').appendChild(row);

            row.querySelector('.deleteBtn').addEventListener('click', () => {
                row.remove();
            });
        });

        logoutButton.addEventListener('click', () => {
            document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
            window.location.href = 'index.html';
        });
    }
});

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();
    const tableBody = document.querySelector('#table tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Verifica se o nome já existe na tabela
    const isDuplicate = rows.some(row => row.firstElementChild.textContent === name);

    if (isDuplicate) {
        alert('O nome já está na tabela. Por favor, insira um nome diferente.');
        nameInput.focus();
        return;
    }

    if (name) {
        // Cria uma nova linha
        const row = document.createElement('tr');

        // Cria a célula para o nome
        const nameCell = document.createElement('td');
        nameCell.textContent = name;

        // Cria a célula para o botão de exclusão
        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', function() {
            tableBody.removeChild(row);
        });

        actionCell.appendChild(deleteButton);

        // Adiciona as células na linha
        row.appendChild(nameCell);
        row.appendChild(actionCell);

        // Adiciona a linha na tabela
        tableBody.appendChild(row);

        // Limpa o campo de entrada
        nameInput.value = '';
    } else {
        alert('Por favor, insira um nome válido.');
    }
});

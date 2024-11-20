// Variáveis globais
let itens = [];
let totalAtual = 0;
let totalAnterior = 0;

// Função para carregar os dados do Local Storage
function carregarDados() {
    itens = JSON.parse(localStorage.getItem("itens")) || [];
    totalAtual = parseFloat(localStorage.getItem("totalAtual")) || 0;
    totalAnterior = parseFloat(localStorage.getItem("totalAnterior")) || 0;
}

// Função para salvar os dados no Local Storage
function salvarDados() {
    localStorage.setItem("itens", JSON.stringify(itens));
    localStorage.setItem("totalAtual", totalAtual);
    localStorage.setItem("totalAnterior", totalAnterior);
}

// Atualizar a tabela principal
function atualizarTabelaPrincipal() {
    const corpoTabela = document.querySelector("#tabelaItens tbody");
    corpoTabela.innerHTML = ""; // Limpar a tabela

    itens.forEach((item, index) => {
        const diferencaItem = (item.precoAtual - item.precoAnterior) * item.quantidade;

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.precoAtual.toFixed(2)}</td>
            <td>R$ ${item.precoAnterior.toFixed(2)}</td>
            <td style="color: ${diferencaItem >= 0 ? "red" : "green"};">
                R$ ${diferencaItem.toFixed(2)}
            </td>
            <td>${item.categoria}</td>
            <td>
                <button onclick="editarItem(${index})">Editar</button>
                <button onclick="excluirItem(${index})">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Atualizar a tabela de compras anteriores
function atualizarComprasAnteriores() {
    const corpoComprasAnteriores = document.getElementById("corpoComprasAnteriores");
    corpoComprasAnteriores.innerHTML = ""; // Limpar tabela

    if (itens.length === 0) {
        corpoComprasAnteriores.innerHTML = `<tr><td colspan="4">Nenhuma compra anterior disponível</td></tr>`;
        return;
    }

    itens.forEach(item => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.precoAnterior.toFixed(2)}</td>
            <td>${item.categoria}</td>
        `;
        corpoComprasAnteriores.appendChild(linha);
    });
}

// Atualizar os gráficos
function atualizarGraficoCategoria() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"];
    const valores = categorias.map(cat =>
        itens
            .filter(item => item.categoria === cat)
            .reduce((total, item) => total + item.precoAtual * item.quantidade, 0)
    );

    const ctx = document.getElementById("graficoGastosCategoria").getContext("2d");

    if (window.graficoCategoria) {
        window.graficoCategoria.destroy();
    }

    window.graficoCategoria = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categorias,
            datasets: [
                {
                    label: "Gastos por Categoria",
                    data: valores,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    borderColor: "#fff",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const index = tooltipItem.dataIndex;
                            const categoria = categorias[index];
                            const valor = valores[index].toFixed(2);
                            const porcentagem = ((valor / valores.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
                            return `${categoria}: R$ ${valor} (${porcentagem}%)`;
                        },
                    },
                },
                legend: {
                    position: "top",
                },
            },
        },
    });
}

// Atualizar a interface
function atualizarInterface() {
    atualizarTabelaPrincipal();
    atualizarResumoGastos();
    atualizarComprasAnteriores();
    atualizarGraficoCategoria();
}

// Exibir os totais de gastos e economia na tela
function atualizarResumoGastos() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"];
    const gastosPorCategoria = categorias.map(cat =>
        itens
            .filter(item => item.categoria === cat)
            .reduce((total, item) => total + item.precoAtual * item.quantidade, 0)
    );

    const economiaTotal = totalAnterior - totalAtual;

    const resumoDiv = document.getElementById("resumoGastos");
    resumoDiv.innerHTML = `
        <h3>Resumo de Gastos</h3>
        <p><strong>Total Atual:</strong> R$ ${totalAtual.toFixed(2)}</p>
        <p><strong>Total Anterior:</strong> R$ ${totalAnterior.toFixed(2)}</p>
        <p><strong>Economia Total:</strong> R$ ${economiaTotal.toFixed(2)}</p>
        <h4>Gastos por Categoria:</h4>
        <ul>
            ${categorias
                .map((cat, index) => `<li>${cat}: R$ ${gastosPorCategoria[index].toFixed(2)}</li>`)
                .join("")}
        </ul>
    `;
}

// Manipulador de envio do formulário
document.getElementById("formularioItem").addEventListener("submit", function (e) {
    e.preventDefault();

    const nomeItem = document.getElementById("nomeItem").value;
    const quantidadeItem = parseInt(document.getElementById("quantidadeItem").value);
    const precoAtual = parseFloat(document.getElementById("precoAtual").value);
    const categoria = document.getElementById("categoriaItem").value;

    const itemExistente = itens.find(item => item.nome === nomeItem);
    const precoAnterior = itemExistente ? itemExistente.precoAtual : precoAtual;

    const novoItem = { nome: nomeItem, quantidade: quantidadeItem, precoAtual, precoAnterior, categoria };

    if (itemExistente) {
        const indice = itens.indexOf(itemExistente);
        itens[indice] = novoItem;
    } else {
        itens.push(novoItem);
    }

    totalAtual += precoAtual * quantidadeItem;
    totalAnterior += precoAnterior * quantidadeItem;

    salvarDados();
    atualizarInterface();

    document.getElementById("formularioItem").reset();
});

// Função para editar um item
function editarItem(index) {
    const item = itens[index];

    document.getElementById("nomeItem").value = item.nome;
    document.getElementById("quantidadeItem").value = item.quantidade;
    document.getElementById("precoAtual").value = item.precoAtual;
    document.getElementById("categoriaItem").value = item.categoria;

    excluirItem(index); // Remove o item antes de reeditá-lo
}

// Função para excluir um item
function excluirItem(index) {
    const itemRemovido = itens.splice(index, 1)[0];

    totalAtual -= itemRemovido.precoAtual * itemRemovido.quantidade;
    totalAnterior -= itemRemovido.precoAnterior * itemRemovido.quantidade;

    salvarDados();
    atualizarInterface();
}

// Carregar dados iniciais e atualizar a interface
carregarDados();
atualizarInterface();

// Variáveis globais para armazenar os itens e os totais.
// Elas são usadas ao longo da aplicação para calcular valores e manter os dados.
let itens = [];
let totalAtual = 0; // Soma dos preços atuais dos itens
let totalAnterior = 0; // Soma dos preços anteriores dos itens

// Função que carrega os dados do Local Storage, garantindo que os valores sejam persistidos entre sessões.
// Os dados são recuperados como strings e convertidos para o formato original (array ou número).
function carregarDados() {
    itens = JSON.parse(localStorage.getItem("itens")) || []; // Recupera os itens ou inicializa um array vazio
    totalAtual = parseFloat(localStorage.getItem("totalAtual")) || 0; // Total atual armazenado
    totalAnterior = parseFloat(localStorage.getItem("totalAnterior")) || 0; // Total anterior armazenado
}

// Função que salva os dados no Local Storage, garantindo que as alterações feitas na aplicação sejam persistidas.
function salvarDados() {
    localStorage.setItem("itens", JSON.stringify(itens)); // Armazena os itens no formato JSON
    localStorage.setItem("totalAtual", totalAtual); // Salva o total atual
    localStorage.setItem("totalAnterior", totalAnterior); // Salva o total anterior
}

// Função que atualiza a tabela principal com os itens adicionados.
// Cada item é exibido com nome, quantidade, preços e a diferença entre os preços.
function atualizarTabelaPrincipal() {
    const corpoTabela = document.querySelector("#tabelaItens tbody");
    corpoTabela.innerHTML = ""; // Limpa a tabela antes de atualizar

    itens.forEach((item, index) => {
        const diferencaItem = (item.precoAtual - item.precoAnterior) * item.quantidade; // Calcula a diferença

        // Cria uma linha para cada item na tabela
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
        corpoTabela.appendChild(linha); // Adiciona a linha na tabela
    });
}

// Função que atualiza a tabela de compras anteriores.
// Exibe os itens que já foram adicionados, mas considera apenas o preço anterior.
function atualizarComprasAnteriores() {
    const corpoComprasAnteriores = document.getElementById("corpoComprasAnteriores");
    corpoComprasAnteriores.innerHTML = ""; // Limpa a tabela antes de atualizar

    if (itens.length === 0) {
        // Caso não haja itens, exibe uma mensagem
        corpoComprasAnteriores.innerHTML = `<tr><td colspan="4">Nenhuma compra anterior disponível</td></tr>`;
        return;
    }

    // Adiciona uma linha para cada item da lista
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

// Função que atualiza o gráfico de gastos por categoria.
// Os dados do gráfico são agrupados por categorias, e os gastos totais são calculados.
function atualizarGraficoCategoria() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"];
    const valores = categorias.map(cat =>
        itens
            .filter(item => item.categoria === cat) // Filtra os itens pela categoria
            .reduce((total, item) => total + item.precoAtual * item.quantidade, 0) // Soma os valores da categoria
    );

    const ctx = document.getElementById("graficoGastosCategoria").getContext("2d");

    if (window.graficoCategoria) {
        window.graficoCategoria.destroy(); // Remove o gráfico anterior para atualizar
    }

    // Cria um novo gráfico do tipo "pizza" com os dados
    window.graficoCategoria = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categorias, // Nomes das categorias
            datasets: [
                {
                    label: "Gastos por Categoria",
                    data: valores, // Valores por categoria
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"], // Cores do gráfico
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
                            return `${categoria}: R$ ${valor} (${porcentagem}%)`; // Exibe valores com porcentagens
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

// Função principal que atualiza toda a interface da aplicação.
function atualizarInterface() {
    atualizarTabelaPrincipal(); // Atualiza a tabela principal
    atualizarResumoGastos(); // Atualiza o resumo de gastos
    atualizarComprasAnteriores(); // Atualiza as compras anteriores
    atualizarGraficoCategoria(); // Atualiza o gráfico de gastos
}

// Função que exibe um resumo dos gastos, incluindo economia e gastos por categoria.
function atualizarResumoGastos() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"];
    const gastosPorCategoria = categorias.map(cat =>
        itens
            .filter(item => item.categoria === cat)
            .reduce((total, item) => total + item.precoAtual * item.quantidade, 0)
    );

    const economiaTotal = totalAnterior - totalAtual; // Calcula a economia total

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

// Função que adiciona um item ao ser enviado pelo formulário.
document.getElementById("formularioItem").addEventListener("submit", function (e) {
    e.preventDefault(); // Impede o recarregamento da página

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

    salvarDados(); // Salva os dados atualizados
    atualizarInterface(); // Atualiza a interface

    document.getElementById("formularioItem").reset(); // Limpa o formulário
});

// Inicializa a aplicação carregando os dados e atualizando a interface
carregarDados();
atualizarInterface();

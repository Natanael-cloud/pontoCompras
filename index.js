// Variáveis globais para armazenar os itens e os totais.
let itens = []; // Lista de itens cadastrados.
let totalAtual = 0; // Total gasto atualmente.
let totalAnterior = 0; // Total gasto anteriormente.

// Função que carrega os dados do Local Storage.
function carregarDados() {
    // Recupera a lista de itens ou inicializa com um array vazio.
    itens = JSON.parse(localStorage.getItem("itens")) || [];
    // Recupera os totais ou inicializa com 0.
    totalAtual = parseFloat(localStorage.getItem("totalAtual")) || 0;
    totalAnterior = parseFloat(localStorage.getItem("totalAnterior")) || 0;
}

// Função que salva os dados no Local Storage.
function salvarDados() {
    // Salva a lista de itens como JSON.
    localStorage.setItem("itens", JSON.stringify(itens));
    // Salva os totais no formato numérico.
    localStorage.setItem("totalAtual", totalAtual);
    localStorage.setItem("totalAnterior", totalAnterior);
}

// Função que atualiza a tabela principal de itens.
function atualizarTabelaPrincipal() {
    const corpoTabela = document.querySelector("#tabelaItens tbody"); // Seleciona o corpo da tabela.
    corpoTabela.innerHTML = ""; // Limpa o conteúdo atual.

    // Itera sobre cada item na lista.
    itens.forEach((item, index) => {
        // Calcula a diferença de preço entre o atual e o anterior.
        const diferencaItem = (item.precoAtual - item.precoAnterior) * item.quantidade;

        // Cria uma nova linha na tabela.
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
        corpoTabela.appendChild(linha); // Adiciona a linha à tabela.
    });
}

// Função para editar um item.
function editarItem(index) {
    const item = itens[index]; // Recupera o item pelo índice.
    // Preenche o formulário com os dados do item.
    document.getElementById("nomeItem").value = item.nome;
    document.getElementById("quantidadeItem").value = item.quantidade;
    document.getElementById("precoAtual").value = item.precoAtual;
    document.getElementById("categoriaItem").value = item.categoria;

    excluirItem(index); // Remove o item da lista para reeditá-lo.
}

// Função para excluir um item.
function excluirItem(index) {
    const item = itens[index]; // Recupera o item pelo índice.
    // Atualiza os totais.
    totalAtual -= item.precoAtual * item.quantidade;
    totalAnterior -= item.precoAnterior * item.quantidade;

    itens.splice(index, 1); // Remove o item da lista.
    salvarDados(); // Salva os dados atualizados.
    atualizarInterface(); // Atualiza a interface.
}

// Função que atualiza a tabela de compras anteriores.
function atualizarComprasAnteriores() {
    const corpoComprasAnteriores = document.getElementById("corpoComprasAnteriores"); // Seleciona o corpo da tabela.
    corpoComprasAnteriores.innerHTML = ""; // Limpa o conteúdo atual.

    // Verifica se há itens na lista.
    if (itens.length === 0) {
        corpoComprasAnteriores.innerHTML = `<tr><td colspan="4">Nenhuma compra anterior disponível</td></tr>`;
        return;
    }

    // Adiciona cada item como uma nova linha.
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
function atualizarGraficoCategoria() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"]; // Categorias predefinidas.
    // Calcula os gastos por categoria.
    const valores = categorias.map(cat =>
        itens.filter(item => item.categoria === cat)
            .reduce((total, item) => total + item.precoAtual * item.quantidade, 0)
    );

    const ctx = document.getElementById("graficoGastosCategoria").getContext("2d"); // Contexto do canvas.

    if (window.graficoCategoria) {
        window.graficoCategoria.destroy(); // Remove o gráfico existente antes de criar outro.
    }

    // Cria um novo gráfico de pizza.
    window.graficoCategoria = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categorias,
            datasets: [
                {
                    label: "Gastos por Categoria",
                    data: valores,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
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

// Função que atualiza o resumo de gastos.
function atualizarResumoGastos() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"]; // Categorias predefinidas.
    const gastosPorCategoria = categorias.map(cat =>
        itens.filter(item => item.categoria === cat)
            .reduce((total, item) => total + item.precoAtual * item.quantidade, 0)
    );

    const economiaTotal = totalAnterior - totalAtual; // Calcula a economia.

    const resumoDiv = document.getElementById("resumoGastos"); // Seleciona o div de resumo.
    resumoDiv.innerHTML = `
        <h3>Resumo de Gastos</h3>
        <p><strong>Total Atual:</strong> R$ ${totalAtual.toFixed(2)}</p>
        <p><strong>Total Anterior:</strong> R$ ${totalAnterior.toFixed(2)}</p>
        <p><strong>Economia Total:</strong> R$ ${economiaTotal.toFixed(2)}</p>
        <h4>Gastos por Categoria:</h4>
        <ul>
            ${categorias.map((cat, index) => `<li>${cat}: R$ ${gastosPorCategoria[index].toFixed(2)}</li>`).join("")}
        </ul>
    `;
}

// Função para exportar gráfico e resumo como PDF.
document.getElementById("exportarPDF").addEventListener("click", async () => {
    const resumoGastos = document.getElementById("resumoGastos");
    const graficoCanvas = document.getElementById("graficoGastosCategoria");

    const pdf = new jspdf.jsPDF("p", "mm", "a4");

    // Captura o resumo como imagem.
    const resumoCanvas = await html2canvas(resumoGastos);
    const resumoImgData = resumoCanvas.toDataURL("image/png");

    pdf.text("Resumo de Gastos", 10, 10);
    pdf.addImage(resumoImgData, "PNG", 10, 20, 190, 50);

    // Captura o gráfico como imagem.
    const graficoImgData = graficoCanvas.toDataURL("image/png");

    pdf.text("Gráfico de Gastos por Categoria", 10, 80);
    pdf.addImage(graficoImgData, "PNG", 10, 90, 190, 90);

    pdf.save("relatorio-compras.pdf"); // Salva o PDF.
});

// Função principal para atualizar a interface.
function atualizarInterface() {
    atualizarTabelaPrincipal();
    atualizarResumoGastos();
    atualizarComprasAnteriores();
    atualizarGraficoCategoria();
}

// Inicialização.
document.getElementById("formularioItem").addEventListener("submit", function (e) {
    e.preventDefault(); // Impede o comportamento padrão do formulário.

    const nomeItem = document.getElementById("nomeItem").value;
    const quantidadeItem = parseInt(document.getElementById("quantidadeItem").value);
    const precoAtual = parseFloat(document.getElementById("precoAtual").value);
    const categoria = document.getElementById("categoriaItem").value;

    // Verifica se o item já existe na lista.
    const itemExistente = itens.find(item => item.nome === nomeItem);
    const precoAnterior = itemExistente ? itemExistente.precoAtual : precoAtual;

    const novoItem = { nome: nomeItem, quantidade: quantidadeItem, precoAtual, precoAnterior, categoria };

    if (itemExistente) {
        const indice = itens.indexOf(itemExistente);
        itens[indice] = novoItem; // Atualiza o item existente.
    } else {
        itens.push(novoItem); // Adiciona um novo item à lista.
    }

    // Atualiza os totais.
    totalAtual += precoAtual * quantidadeItem;
    totalAnterior += precoAnterior * quantidadeItem;

    salvarDados(); // Salva os dados atualizados.
    atualizarInterface(); // Atualiza a interface.
    document.getElementById("formularioItem").reset(); // Reseta o formulário.
});

carregarDados(); // Carrega os dados ao iniciar.
atualizarInterface(); // Atualiza a interface ao carregar a página.


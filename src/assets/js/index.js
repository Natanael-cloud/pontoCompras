// Variáveis globais para armazenar os itens e os totais.
let itens = []; 
let totalAtual = 0;
let totalAnterior = 0;

// Função que carrega os dados do Local Storage.
function carregarDados() {
    try {
        itens = JSON.parse(localStorage.getItem("itens")) || [];
        totalAtual = parseFloat(localStorage.getItem("totalAtual")) || 0;
        totalAnterior = parseFloat(localStorage.getItem("totalAnterior")) || 0;
    } catch (error) {
        console.error("Erro ao carregar os dados do Local Storage", error);
    }
}

// Função que salva os dados no Local Storage.
function salvarDados() {
    try {
        localStorage.setItem("itens", JSON.stringify(itens));
        localStorage.setItem("totalAtual", totalAtual);
        localStorage.setItem("totalAnterior", totalAnterior);
    } catch (error) {
        console.error("Erro ao salvar os dados no Local Storage", error);
    }
}

// Função que atualiza os totais de forma eficiente
function atualizarTotais() {
    totalAtual = itens.reduce((acc, item) => acc + item.precoAtual * item.quantidade, 0);
    totalAnterior = itens.reduce((acc, item) => acc + item.precoAnterior * item.quantidade, 0);
}

// Função que atualiza a tabela de itens.
function atualizarTabelaPrincipal() {
    const corpoTabela = document.querySelector("#tabelaItens tbody");
    corpoTabela.innerHTML = "";

    itens.forEach((item, index) => {
        const diferencaItem = (item.precoAtual - item.precoAnterior) * item.quantidade;
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.precoAtual.toFixed(2)}</td>
            <td>R$ ${item.precoAnterior.toFixed(2)}</td>
            <td style="color: ${diferencaItem >= 0 ? "red" : "green"};">R$ ${diferencaItem.toFixed(2)}</td>
            <td>${item.categoria}</td>
            <td>
                <button onclick="editarItem(${index})">Editar</button>
                <button onclick="excluirItem(${index})">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Função para editar um item.
function editarItem(index) {
    const item = itens[index];
    document.getElementById("nomeItem").value = item.nome;
    document.getElementById("quantidadeItem").value = item.quantidade;
    document.getElementById("precoAtual").value = item.precoAtual;
    document.getElementById("categoriaItem").value = item.categoria;

    excluirItem(index); // Remove o item da lista para reeditá-lo.
}

// Função para excluir um item.
function excluirItem(index) {
    const item = itens[index];
    totalAtual -= item.precoAtual * item.quantidade;
    totalAnterior -= item.precoAnterior * item.quantidade;
    itens.splice(index, 1);
    salvarDados();
    atualizarInterface();
}

// Função que atualiza a tabela de compras anteriores.
function atualizarComprasAnteriores() {
    const corpoComprasAnteriores = document.getElementById("corpoComprasAnteriores");
    corpoComprasAnteriores.innerHTML = "";

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

// Função que atualiza o gráfico de gastos por categoria.
function atualizarGraficoCategoria() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"];
    const valores = categorias.map(cat =>
        itens.filter(item => item.categoria === cat)
            .reduce((total, item) => total + item.precoAtual * item.quantidade, 0)
    );

    const ctx = document.getElementById("graficoGastosCategoria").getContext("2d");

    if (window.graficoCategoria) {
        window.graficoCategoria.data.datasets[0].data = valores; // Atualiza os dados no gráfico.
        window.graficoCategoria.update(); // Atualiza o gráfico sem destruir.
    } else {
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
        });
    }
}

// Função que atualiza o resumo de gastos.
function atualizarResumoGastos() {
    const categorias = ["Alimentos", "Higiene", "Limpeza", "Outros"];
    const gastosPorCategoria = categorias.map(cat =>
        itens.filter(item => item.categoria === cat)
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
            ${categorias.map((cat, index) => `<li>${cat}: R$ ${gastosPorCategoria[index].toFixed(2)}</li>`).join("")}
        </ul>
    `;
}

// Função para exportar gráfico e resumo como PDF.
document.getElementById("exportarPDF").addEventListener("click", async () => {
    const resumoGastos = document.getElementById("resumoGastos");
    const graficoCanvas = document.getElementById("graficoGastosCategoria");

    const pdf = new jspdf.jsPDF("p", "mm", "a4");

    const resumoCanvas = await html2canvas(resumoGastos);
    const resumoImgData = resumoCanvas.toDataURL("image/png");

    pdf.text("Resumo de Gastos", 10, 10);
    pdf.addImage(resumoImgData, "PNG", 10, 20, 190, 50);

    const graficoImgData = graficoCanvas.toDataURL("image/png");

    pdf.text("Gráfico de Gastos por Categoria", 10, 80);
    pdf.addImage(graficoImgData, "PNG", 10, 90, 190, 90);

    pdf.save("relatorio-compras.pdf");
});

// Função principal para atualizar a interface.
function atualizarInterface() {
    atualizarTotais();  // Atualiza os totais
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

    const itemExistente = itens.find(item => item.nome === nomeItem);
    const precoAnterior = itemExistente ? itemExistente.precoAtual : precoAtual;

    const novoItem = { nome: nomeItem, quantidade: quantidadeItem, precoAtual, precoAnterior, categoria };

    if (itemExistente) {
        const indice = itens.indexOf(itemExistente);
        itens[indice] = novoItem;
    } else {
        itens.push(novoItem);
    }

    salvarDados();
    atualizarInterface();
    document.getElementById("formularioItem").reset();
});

carregarDados();
atualizarInterface();

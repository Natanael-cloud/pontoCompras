document.getElementById("formularioItem").addEventListener("submit", function (e) {
  e.preventDefault();

  const nomeItem = document.getElementById("nomeItem").value;
  const quantidadeItem = parseInt(document.getElementById("quantidadeItem").value);
  const precoAtual = parseFloat(document.getElementById("precoAtual").value);
  const precoAnterior = parseFloat(document.getElementById("precoAnterior").value);

  const diferencaItem = (precoAtual - precoAnterior) * quantidadeItem;

  const corpoTabela = document.querySelector("#tabelaItens tbody");

  // Adiciona nova linha à tabela
  const linha = document.createElement("tr");
  linha.innerHTML = `
      <td>${nomeItem}</td>
      <td>${quantidadeItem}</td>
      <td>R$ ${precoAtual.toFixed(2)}</td>
      <td>R$ ${precoAnterior.toFixed(2)}</td>
      <td style="color: ${diferencaItem >= 0 ? "red" : "green"};">
          R$ ${diferencaItem.toFixed(2)}
      </td>
  `;
  corpoTabela.appendChild(linha);

  atualizarResumo(precoAtual * quantidadeItem, precoAnterior * quantidadeItem);

  // Limpa o formulário
  document.getElementById("formularioItem").reset();
});

function atualizarResumo(totalAtualAdicionado, totalAnteriorAdicionado) {
  const elementoTotalAtual = document.getElementById("totalAtual");
  const elementoTotalAnterior = document.getElementById("totalAnterior");
  const elementoDiferencaTotal = document.getElementById("diferencaTotal");

  const totalAtual = parseFloat(elementoTotalAtual.textContent.replace("R$", "")) + totalAtualAdicionado;
  const totalAnterior = parseFloat(elementoTotalAnterior.textContent.replace("R$", "")) + totalAnteriorAdicionado;

  elementoTotalAtual.textContent = `R$ ${totalAtual.toFixed(2)}`;
  elementoTotalAnterior.textContent = `R$ ${totalAnterior.toFixed(2)}`;
  elementoDiferencaTotal.textContent = `R$ ${(totalAtual - totalAnterior).toFixed(2)}`;
}

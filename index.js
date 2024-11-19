// Função para carregar os dados do Local Storage
function carregarDados() {
  const itens = JSON.parse(localStorage.getItem("itens")) || [];
  const totalAtual = parseFloat(localStorage.getItem("totalAtual")) || 0;
  const totalAnterior = parseFloat(localStorage.getItem("totalAnterior")) || 0;

  return { itens, totalAtual, totalAnterior };
}

// Função para salvar os dados no Local Storage
function salvarDados(itens, totalAtual, totalAnterior) {
  localStorage.setItem("itens", JSON.stringify(itens));
  localStorage.setItem("totalAtual", totalAtual);
  localStorage.setItem("totalAnterior", totalAnterior);
}

// Função para atualizar a tabela principal (itens atuais)
function atualizarTabelaPrincipal(itens, totalAtual, totalAnterior) {
  const corpoTabela = document.querySelector("#tabelaItens tbody");
  const elementoTotalAtual = document.getElementById("totalAtual");
  const elementoTotalAnterior = document.getElementById("totalAnterior");
  const elementoDiferencaTotal = document.getElementById("diferencaTotal");

  // Limpar tabela
  corpoTabela.innerHTML = "";

  // Adicionar itens na tabela
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
          <td>
              <button onclick="editarItem(${index})">Editar</button>
              <button onclick="excluirItem(${index})">Excluir</button>
          </td>
      `;
      corpoTabela.appendChild(linha);
  });

  // Atualizar o resumo
  elementoTotalAtual.textContent = `R$ ${totalAtual.toFixed(2)}`;
  elementoTotalAnterior.textContent = `R$ ${totalAnterior.toFixed(2)}`;
  elementoDiferencaTotal.textContent = `R$ ${(totalAtual - totalAnterior).toFixed(2)}`;
}

// Função para atualizar a tabela de compras anteriores
function atualizarComprasAnteriores(itens) {
  const corpoComprasAnteriores = document.getElementById("corpoComprasAnteriores");

  // Limpar tabela de compras anteriores
  corpoComprasAnteriores.innerHTML = "";

  // Adicionar itens à tabela de compras anteriores
  itens.forEach(item => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
          <td>${item.nome}</td>
          <td>${item.quantidade}</td>
          <td>R$ ${item.precoAnterior.toFixed(2)}</td>
      `;
      corpoComprasAnteriores.appendChild(linha);
  });
}

// Atualizar a interface principal e compras anteriores
function atualizarInterface(itens, totalAtual, totalAnterior) {
  atualizarTabelaPrincipal(itens, totalAtual, totalAnterior);
  atualizarComprasAnteriores(itens);
}

// Carregar dados iniciais
const { itens, totalAtual, totalAnterior } = carregarDados();
atualizarInterface(itens, totalAtual, totalAnterior);

// Manipulador de envio do formulário
document.getElementById("formularioItem").addEventListener("submit", function (e) {
  e.preventDefault();

  const nomeItem = document.getElementById("nomeItem").value;
  const quantidadeItem = parseInt(document.getElementById("quantidadeItem").value);
  const precoAtual = parseFloat(document.getElementById("precoAtual").value);

  // Buscar o preço anterior do item, se existir
  const itemExistente = itens.find(item => item.nome === nomeItem);
  const precoAnterior = itemExistente ? itemExistente.precoAtual : precoAtual;

  // Criar/atualizar o item
  const novoItem = { nome: nomeItem, quantidade: quantidadeItem, precoAtual, precoAnterior };

  if (itemExistente) {
      // Atualizar item existente
      const indice = itens.indexOf(itemExistente);
      itens[indice] = novoItem;
  } else {
      // Adicionar novo item
      itens.push(novoItem);
  }

  // Atualizar totais
  const totalAtualNovo = totalAtual + precoAtual * quantidadeItem;
  const totalAnteriorNovo = totalAnterior + precoAnterior * quantidadeItem;

  // Salvar e atualizar interface
  salvarDados(itens, totalAtualNovo, totalAnteriorNovo);
  atualizarInterface(itens, totalAtualNovo, totalAnteriorNovo);

  // Limpar formulário
  document.getElementById("formularioItem").reset();
});

// Função para editar um item
function editarItem(index) {
  const item = itens[index];

  document.getElementById("nomeItem").value = item.nome;
  document.getElementById("quantidadeItem").value = item.quantidade;
  document.getElementById("precoAtual").value = item.precoAtual;

  // Remover o item atual para que seja re-adicionado ao enviar o formulário
  excluirItem(index);
}

// Função para excluir um item
function excluirItem(index) {
  const itemRemovido = itens.splice(index, 1)[0];

  // Atualizar totais
  const totalAtualNovo = totalAtual - itemRemovido.precoAtual * itemRemovido.quantidade;
  const totalAnteriorNovo = totalAnterior - itemRemovido.precoAnterior * itemRemovido.quantidade;

  // Salvar e atualizar interface
  salvarDados(itens, totalAtualNovo, totalAnteriorNovo);
  atualizarInterface(itens, totalAtualNovo, totalAnteriorNovo);
}



# Comparador de Compras

O **Comparador de Compras** é uma aplicação web para calcular e comparar os gastos das suas compras mensais, mostrando economia ou aumento de gastos em relação à compra anterior, além de exibir gráficos de gastos por categoria e exportar relatórios em PDF.

## Funcionalidades

- Adicione itens com nome, quantidade, preço atual, preço anterior e categoria.
- Veja a lista de itens adicionados, podendo editar ou excluir cada um.
- Resumo de gastos: total atual, total anterior, economia/variação e gastos por categoria.
- Gráfico de pizza mostrando a distribuição dos gastos por categoria.
- Histórico de compras anteriores.
- Exporte o resumo e o gráfico em PDF.

## Tecnologias Utilizadas

- HTML5, CSS3, JavaScript
- [Chart.js](https://www.chartjs.org/) para gráficos
- [jsPDF](https://github.com/parallax/jsPDF) e [html2canvas](https://github.com/niklasvh/html2canvas) para exportação em PDF
- LocalStorage para persistência dos dados no navegador

## Como Usar

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/pontoCompras.git
   ```
2. **Abra o arquivo `index.html` no seu navegador.**
3. **Adicione os itens preenchendo o formulário e clique em "Adicionar".**
4. **Veja o resumo, gráficos e histórico de compras.**
5. **Exporte o relatório em PDF clicando no botão correspondente.**

## Estrutura de Pastas

```
index.html
logo.webp
src/
  assets/
    css/
      style.css
    js/
      index.js
```

## Demonstração

Acesse a aplicação online: [https://natanael-cloud.github.io/pontoCompras/](https://natanael-cloud.github.io/pontoCompras/)

## Screenshots

![Resumo de Gastos](https://github.com/user-attachments/assets/639cc422-5da2-4fb8-947a-3380006aea15)
![Compras Anteriores](https://github.com/user-attachments/assets/b0181b03-f7cc-45a1-81d0-3a70241094c8)


https://github.com/user-attachments/assets/4bbbef4d-aa01-4dd8-b26e-979ac45df36c


<strong>Primeiro se adiciona os itens e se seleciona em qual categoria que ele faz parte.O Item é adicionado e mostrado na parte dos "Itens Adicionados". Vemos em cada item a opção de Editar e Excluir.</strong>


https://github.com/user-attachments/assets/6ab80940-2135-4a35-b930-8abfef1515de


<strong>No campo Resumo de Gastos temos as seguintes informações: Total Atual(valores gastos na compra atual, Total Anterior(Valores gastos na compra anterior dos itens), Economia Atual(o que se economizou ou gastou a mais em comparação com os mesmos itens comprados anteriormente) e por fim, Gastos por Categoria(o nome ja é sugestivo).</strong>


<img width="377" alt="image" src="https://github.com/user-attachments/assets/639cc422-5da2-4fb8-947a-3380006aea15">



<strong>No campo Gráficos de Gastos por Categoria, o gráfico mostra os valores gastos em cada categoria e a sua porcentagem equivalente.</strong>



https://github.com/user-attachments/assets/44068aba-c64c-4ad6-b89d-eab2532a8bae


<strong>No Campo "Compras Anteriores" são mostrados os itens adquiridos anteriormente.</strong>


<img width="609" alt="image" src="https://github.com/user-attachments/assets/b0181b03-f7cc-45a1-81d0-3a70241094c8">


<strong> E por fim, o Botão Exportar pdf exporta para o arquivo as informações do gráfico e do Resumo de Gastos.</strong>

https://github.com/user-attachments/assets/067cfa5d-bce6-4dbe-b7e1-c78569686676

<strong>O arquivo index.js está devidamente comentado para entendimento da lógica jascript.</strong>


<strong> Até Breve.</strong>


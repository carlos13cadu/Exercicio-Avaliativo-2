let temporizadorSessao;

$(document).ready(function(){
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    }
    var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
    var primeiroNome = cliente.nome.substr(0, cliente.nome.indexOf(' '));
    $("#nome").text(primeiroNome);
    exibirContas()
    iniciarTemporizador();
})

async function exibirContas() {

    try {
        var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        const response = await fetch(`http://localhost:8888/api/contas/cliente/ + ${cliente.id}`);
        
        const contas = await response.json(); 

        contas.forEach(conta => {
            let option = new Option(conta.numero, conta.id);

            option.setAttribute('data-tipo', conta.tipo);
            option.setAttribute('data-saldo', conta.saldo);
            selectConta.add(option);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao encontrar as contas.");
    }
}

function iniciarTemporizador(){
	if (temporizadorSessao) {
        clearTimeout(temporizadorSessao);
    }
    temporizadorSessao = setTimeout(sessaoExpirada, 60000);
}

async function consultar(){
    iniciarTemporizador();
    var tabela = document.getElementById("tabela");
	apagarLinhas(tabela);

    try {
        const response = await fetch(`http://localhost:8888/api/lancamentos/conta/ + ${$("#selectConta").val()}`);
        
        const lancamentos = await response.json(); 

        lancamentos.forEach(lancamento => {
            adicionarLinha(tabela, lancamento);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao consultar o extrato.");
    }
}

function adicionarLinha(tabela, lancamento) {
	// Seleciona o corpo da tabela 
	var tbody = tabela.querySelector("tbody");

	// Cria uma nova linha
	var novaLinha = document.createElement("tr");

	// Cria e adiciona na nova linha as células com os valores

    var colunaData = document.createElement("td");
	colunaData.textContent = lancamento.id;
	novaLinha.appendChild(colunaData);

	var colunaValor = document.createElement("td");
	colunaValor.textContent = lancamento.valor;
	novaLinha.appendChild(colunaValor);

	var colunaTipo = document.createElement("td");
	colunaTipo.textContent = lancamento.tipo;
	novaLinha.appendChild(colunaTipo);

	// Adiciona a nova linha ao tbody
	tbody.appendChild(novaLinha);
}

function apagarLinhas(tabela) {
	// Seleciona o corpo da tabela 
	var corpoTabela = tabela.querySelector("tbody");

	// Enquanto houver linhas no corpo da tabela, remove a primeira
	while (corpoTabela.rows.length > 0) {
		corpoTabela.deleteRow(0);
	}
}

function sessaoExpirada(){
	alert('Sessão expirada!');
	localStorage.setItem('usuarioAutenticado', JSON.stringify(null));
	window.location.href = "login.html";
}
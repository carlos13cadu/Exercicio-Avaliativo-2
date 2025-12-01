$(document).ready(function(){
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    }
    var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
    var primeiroNome = cliente.nome.substr(0, cliente.nome.indexOf(' '));
    $("#nome").text(primeiroNome);
    exibirTabela()
})

async function exibirTabela() {
	var tabela = document.getElementById("tabela");
	apagarLinhas(tabela);
    try {
        const response = await fetch(`http://localhost:8888/api/contas`);
        
        const contas = await response.json(); 

        contas.forEach(conta => {
            adicionarLinha(tabela, conta);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao encontrar as contas.");
    }
}

function adicionarLinha(tabela, conta) {
	// Seleciona o corpo da tabela 
	var tbody = tabela.querySelector("tbody");

	// Cria uma nova linha
	var novaLinha = document.createElement("tr");

	// Cria e adiciona na nova linha as células com os valores
	var colunaNumero = document.createElement("td");
	colunaNumero.textContent = conta.numero;
	novaLinha.appendChild(colunaNumero);

	var colunaSaldo = document.createElement("td");
	colunaSaldo.textContent = conta.saldo;
	novaLinha.appendChild(colunaSaldo);

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



async function criarConta(){
    
    try {
        var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        var primeiroNome = cliente.nome.substr(0, cliente.nome.indexOf(' '));

        let numeroContaUnico = "";
        let existe = true;

        while (existe) {
            numeroContaUnico = gerarNumeroConta(primeiroNome);
                
            // Pergunta para a API se esse número específico já existe
            const response = await fetch(`http://localhost:8888/api/contas/exists?numero=${numeroContaUnico}`);
            const data = await response.text(); // ou .json() dependendo da sua API
                
            // Se a API retornar "false", significa que NÃO existe, então podemos usar.
            // Se retornar "true", o loop roda de novo.
            existe = (data === "true"); 
        }
        
        let conta = new Object();
        conta.numero = numeroContaUnico;
        conta.saldo = 0;
        conta.idCliente = cliente.id;
        
        await fetch("http://localhost:8888/api/contas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(conta)
        });
        alert("Conta cadastrado com sucesso!");
        window.location.href = "conta.html";
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar a conta.");
    }
}

function gerarNumeroConta(nome) {
    const prefixo = nome.trim().slice(0, 2).toUpperCase();

    // Gerar um número aleatório entre 0 e 999999
    const numeroAleatorio = Math.floor(Math.random() * 1000000);

    // Formatar o número para ter sempre 6 dígitos (ex: 5 vira 000005)
    const sufixo = numeroAleatorio.toString().padStart(6, '0');

    return `${prefixo}-${sufixo}`;
}
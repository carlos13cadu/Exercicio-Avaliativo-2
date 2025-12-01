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

async function confirmar(){
    iniciarTemporizador();
    try {

        if (isNaN($("#valor").val()) || $("#valor").val() <= 0) {
            alert("Digite um valor válido.");
            return;
        }

        if ($("#operacao").val() == 1){
            const opcaoSelecionada = $("#selectConta option:selected");
            const saldoAtual = parseFloat(opcaoSelecionada.attr('data-saldo'));
            if ($("#valor").val() > saldoAtual) {
                alert(`Saldo insuficiente! Seu saldo é R$ ${saldoAtual.toFixed(2)}`);
                return; // O return PARALISA a função aqui. Não envia nada pra API.
            }
        }

        let lancamento = new Object();
        if ($("#operacao").val() == 1){
            lancamento.tipo  = 'SAQUE';
        } else {
            lancamento.tipo  = 'DEPOSITO';
        }
        
        lancamento.valor = $("#valor").val();
        lancamento.idConta = $("#selectConta").val();
        
        await fetch("http://localhost:8888/api/lancamentos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lancamento)
        });
        alert("Operação feita com sucesso!");
        window.location.href = "operacao.html";
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao lançar operação.");
    }
}

function sessaoExpirada(){
	alert('Sessão expirada!');
	localStorage.setItem('usuarioAutenticado', JSON.stringify(null));
	window.location.href = "login.html";
}
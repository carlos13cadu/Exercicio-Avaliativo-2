$(document).ready(function(){
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    }
    var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
    var primeiroNome = cliente.nome.substr(0, cliente.nome.indexOf(' '));
    $("#nome").text(primeiroNome);
    exibirContas()
})

async function exibirContas() {

    try {
        const response = await fetch(`http://localhost:8888/api/contas`);
        
        const contas = await response.json(); 

        contas.forEach(conta => {
            let option = new Option(conta.numero, conta.id);
            
            selectConta.add(option);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao encontrar as contas.");
    }
}

async function confirmar(){
    
    try {
        var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        
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

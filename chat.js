/* ================= NOME ================= */

let nome = document.getElementById("nome");
let mensagemNome = document.getElementById("mensagemNome");

let mascaraNome = /^[A-Za-zçÇÀ-ÿ\s]+$/;

nome.addEventListener("keyup", function () {

    if (!mascaraNome.test(nome.value)) {

        mensagemNome.textContent = "Nome inválido";
        mensagemNome.classList.add("erro");
        mensagemNome.classList.remove("certo");

    } else if (nome.value.length <= 3) {

        mensagemNome.textContent = "O nome deve ter mais de 3 caracteres";
        mensagemNome.classList.add("erro");
        mensagemNome.classList.remove("certo");

    } else {

        mensagemNome.textContent = "Nome válido!";
        mensagemNome.classList.remove("erro");
        mensagemNome.classList.add("certo");
    }
});


/* ================= EMAIL ================= */

let email = document.getElementById("email");
let mensagemEmail = document.getElementById("mensagemEmail");

let mascaraMaiuscula = /[A-Z]/;
let mascaraEspaco = /\s/;
let mascaraEspecial = /[!#$%&'*\/=?^`{|}~]/;
let mascaraEstrutura = /.+@.+\..+/;

email.addEventListener("keyup", function () {

    if (mascaraEspaco.test(email.value)) {

        mensagemEmail.textContent = "O e-mail não pode conter espaços";
        mensagemEmail.classList.add("erro");
        mensagemEmail.classList.remove("certo");

    } else if (mascaraMaiuscula.test(email.value)) {

        mensagemEmail.textContent = "O e-mail não pode ter letras maiúsculas";
        mensagemEmail.classList.add("erro");
        mensagemEmail.classList.remove("certo");

    } else if (mascaraEspecial.test(email.value)) {

        mensagemEmail.textContent = "Use apenas @ . _ -";
        mensagemEmail.classList.add("erro");
        mensagemEmail.classList.remove("certo");

    } else if (!mascaraEstrutura.test(email.value)) {

        mensagemEmail.textContent = "O e-mail precisa conter @ e .";
        mensagemEmail.classList.add("erro");
        mensagemEmail.classList.remove("certo");

    } else {

        mensagemEmail.textContent = "E-mail válido!";
        mensagemEmail.classList.remove("erro");
        mensagemEmail.classList.add("certo");
    }
});


/* ================= TELEFONE ================= */

let telefone = document.getElementById("telefone");
let mensagemTelefone = document.getElementById("mensagemTelefone");

let mascaraLetra = /[a-zA-Z]/;
let mascaraTelefone = /^\(\d{2}\)\d{9}$/;
let mascaraEspecialTelefone = /[^0-9()\s]/;

telefone.addEventListener("keyup", function () {

    if (mascaraLetra.test(telefone.value)) {

        mensagemTelefone.textContent = "O telefone não pode conter letras";
        mensagemTelefone.classList.add("erro");
        mensagemTelefone.classList.remove("certo");

    } else if (mascaraEspecialTelefone.test(telefone.value)) {

        mensagemTelefone.textContent = "Telefone inválido";
        mensagemTelefone.classList.add("erro");
        mensagemTelefone.classList.remove("certo");

    } else if (!mascaraTelefone.test(telefone.value)) {

        mensagemTelefone.textContent = "Use o formato: (19)999999999";
        mensagemTelefone.classList.add("erro");
        mensagemTelefone.classList.remove("certo");

    } else {

        mensagemTelefone.textContent = "Telefone válido!";
        mensagemTelefone.classList.remove("erro");
        mensagemTelefone.classList.add("certo");
    }
});

/* ================= SUBMIT ================= */

let form = document.querySelector("form");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // impede envio sem validação

    let nomeOk = mensagemNome.classList.contains("certo");
    let emailOk = mensagemEmail.classList.contains("certo");
    let telefoneOk = mensagemTelefone.classList.contains("certo");

    if (!nomeOk || !emailOk || !telefoneOk) {
        alert("Por favor, corrija os campos antes de enviar.");
        return;
    }

    alert("Mensagem enviada com sucesso!");
    form.reset();
    mensagemNome.textContent = "";
    mensagemEmail.textContent = "";
    mensagemTelefone.textContent = "";
});

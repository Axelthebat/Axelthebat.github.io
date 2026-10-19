// site.js
// Duas coisas: revelar o conteudo quando ele entra na tela e
// ligar o seletor de regras ao finding que fica no plinto.

// Essa variavel diz se o sistema pediu para reduzir as animacoes.
const prefereMenosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Essa funcao distribui os atrasos de entrada dentro de cada secao, para
// que titulo, texto e imagem aparecam em sequencia e nao de uma vez so.
function escalonarPorSecao(elementos) {
  const grupos = new Map();

  elementos.forEach((elemento) => {
    const secao = elemento.closest("section, header, footer") || document.body;
    if (!grupos.has(secao)) grupos.set(secao, []);
    grupos.get(secao).push(elemento);
  });

  grupos.forEach((filhos) => {
    filhos.forEach((elemento, indice) => {
      elemento.style.transitionDelay = `${indice * 80}ms`;
    });
  });
}

// Essa funcao revela cada elemento marcado quando ele entra na area visivel.
function prepararRevelacao() {
  const elementos = Array.from(document.querySelectorAll("[data-reveal]"));

  // Sem animacao, tudo aparece de uma vez.
  if (prefereMenosMovimento) {
    elementos.forEach((elemento) => elemento.classList.add("is-visible"));
    return;
  }

  escalonarPorSecao(elementos);
  elementos.forEach((elemento) => elemento.classList.add("reveal"));

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-visible");
        observador.unobserve(entrada.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

// Essa funcao troca o texto do finding que fica no plinto.
function preencherFinding(finding, regra) {
  const campos = finding.querySelectorAll("dd");
  campos[0].textContent = regra.dataset.rule;
  campos[1].textContent = regra.dataset.severity;
  campos[1].className = `sev sev-${regra.dataset.severity}`;
  campos[4].textContent = regra.dataset.check;
}

// Essa funcao mostra o trecho de manifest que a regra verifica.
function preencherDetalhe(regra) {
  const titulo = document.getElementById("detail-title");
  const mensagem = document.getElementById("detail-message");
  const fragmento = document.getElementById("detail-fragment");

  titulo.textContent = `${regra.dataset.rule}: ${regra.dataset.check}`;
  mensagem.textContent = regra.dataset.message;
  fragmento.textContent = regra.dataset.fragment;
}

// Essa funcao marca a linha escolhida da tabela e sincroniza o plinto.
function selecionarRegra(regra) {
  const linhas = document.querySelectorAll("#rules-body tr");
  const findings = document.querySelectorAll(".finding");

  // Se a regra escolhida ja esta no plinto, nao troca nada.
  const jaVisivel = Array.from(findings).some(
    (finding) => finding.querySelector(".id").textContent === regra.dataset.rule
  );

  linhas.forEach((linha) => {
    const escolhida = linha === regra;
    linha.dataset.selected = String(escolhida);
    if (escolhida) linha.setAttribute("aria-current", "true");
    else linha.removeAttribute("aria-current");
  });

  findings.forEach((finding) => {
    const mesmo = finding.querySelector(".id").textContent === regra.dataset.rule;
    finding.dataset.active = String(mesmo);
    finding.setAttribute("aria-hidden", String(!mesmo));
  });

  // Se a regra nao esta entre os findings do plinto, mostra a primeira e
  // deixa a tabela como a fonte da verdade.
  if (!jaVisivel && findings.length) {
    findings[0].dataset.active = "true";
    findings[0].setAttribute("aria-hidden", "false");
    preencherFinding(findings[0], regra);
    findings[0].querySelectorAll("dd")[2].textContent = "manifests/example.yaml";
    findings[0].querySelectorAll("dd")[3].textContent = "-";
  }

  preencherDetalhe(regra);
}

// Essa funcao liga o clique e o teclado nas linhas da tabela de regras.
function prepararSeletorDeRegras() {
  const linhas = document.querySelectorAll("#rules-body tr");
  if (!linhas.length) return;

  linhas.forEach((linha) => {
    linha.tabIndex = 0;
    linha.setAttribute("aria-current", "false");

    linha.addEventListener("click", () => selecionarRegra(linha));

    // Enter e espaco precisam funcionar igual ao clique.
    linha.addEventListener("keydown", (evento) => {
      if (evento.key !== "Enter" && evento.key !== " ") return;
      evento.preventDefault();
      selecionarRegra(linha);
    });
  });

  // Esconde do leitor de tela os findings que nao estao em evidencia.
  const findings = document.querySelectorAll(".finding");
  findings.forEach((finding, indice) => {
    finding.setAttribute("aria-hidden", String(indice !== 0));
  });

  const bloco = document.querySelector(".plinth");
  if (bloco) bloco.setAttribute("aria-live", "polite");
}

// Espera o DOM carregar para poder procurar os elementos da pagina.
document.addEventListener("DOMContentLoaded", () => {
  prepararRevelacao();
  prepararSeletorDeRegras();
});

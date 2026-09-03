// =========================================================
// ATHENAS — interações do site
// =========================================================

const prefereReduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tela de carregamento (preloader) ---------- */
// Roda fora do DOMContentLoaded para começar a animar assim que possível.
(() => {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    document.body.classList.remove('carregando');
    return;
  }

  const finalizarSemAnimacao = () => {
    preloader.classList.add('oculto');
    document.body.classList.remove('carregando');
    document.body.classList.add('carregado');
  };

  if (prefereReduzirMovimento) {
    finalizarSemAnimacao();
    return;
  }

  const traco = document.getElementById('preloaderTraco');
  const contadorEl = document.getElementById('preloaderPct');

  let comprimento = 260;
  if (traco && traco.getTotalLength) {
    comprimento = traco.getTotalLength();
    traco.style.strokeDasharray = String(comprimento);
    traco.style.strokeDashoffset = String(comprimento);
    traco.style.transition = 'stroke-dashoffset 0.8s ease';
  }

  requestAnimationFrame(() => {
    if (traco) traco.style.strokeDashoffset = '0';
  });

  // Contador de 0% a 100% acompanhando as fases de traço e preenchimento
  const duracaoContador = 1150;
  const inicioContador = performance.now();
  const passoContador = (agora) => {
    const progresso = Math.min((agora - inicioContador) / duracaoContador, 1);
    if (contadorEl) contadorEl.textContent = Math.round(progresso * 100) + '%';
    if (progresso < 1) requestAnimationFrame(passoContador);
  };
  requestAnimationFrame(passoContador);

  // Fase 2: preenchimento sólido da logo
  setTimeout(() => {
    preloader.classList.add('preenchido');
  }, 800);

  // Fase 3: efeito cortina revelando o site + entrada escalonada do herói
  setTimeout(() => {
    preloader.classList.add('saindo');
    document.body.classList.remove('carregando');
    document.body.classList.add('carregado');
  }, 1200);

  // Remove o preloader do fluxo após a cortina terminar de abrir
  setTimeout(() => {
    preloader.classList.add('oculto');
  }, 1850);
})();

/* ---------- Alternância de tema (claro/escuro) ---------- */
(() => {
  const botao = document.getElementById('temaToggle');
  if (!botao) return;

  const aplicarTema = (tema) => {
    if (tema === 'claro') {
      document.documentElement.setAttribute('data-tema', 'claro');
    } else {
      document.documentElement.removeAttribute('data-tema');
    }
    try { localStorage.setItem('athena-tema', tema); } catch (erro) { /* segue sem salvar */ }
  };

  botao.addEventListener('click', (evento) => {
    const temaAtual = document.documentElement.getAttribute('data-tema') === 'claro' ? 'claro' : 'escuro';
    const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';

    const x = evento.clientX;
    const y = evento.clientY;

    if (prefereReduzirMovimento || !document.startViewTransition) {
      aplicarTema(novoTema);
      return;
    }

    const transicao = document.startViewTransition(() => aplicarTema(novoTema));
    transicao.ready.then(() => {
      const raio = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`],
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Barra de progresso de leitura ---------- */
  const progresso = document.querySelector('.progresso-scroll');
  const atualizarProgresso = () => {
    if (!progresso) return;
    const altura = document.documentElement.scrollHeight - window.innerHeight;
    const pct = altura > 0 ? (window.scrollY / altura) * 100 : 0;
    progresso.style.width = pct + '%';
  };

  /* ---------- Header dinâmico (sombra ao rolar) ---------- */
  const header = document.querySelector('header');
  const alternarHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  window.addEventListener('scroll', () => {
    atualizarProgresso();
    alternarHeader();
  }, { passive: true });
  atualizarProgresso();
  alternarHeader();

  /* ---------- Menu mobile (hambúrguer) ---------- */
  const botaoMenu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('header nav');

  if (botaoMenu && nav) {
    const fecharMenu = () => {
      nav.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
    };

    botaoMenu.addEventListener('click', () => {
      const aberto = nav.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', String(aberto));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fecharMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) fecharMenu();
    });
  }

  /* ---------- Link ativo do menu conforme a seção visível ---------- */
  const secoes = document.querySelectorAll('main section[id]');
  const linksNav = document.querySelectorAll('nav a[href^="#"]');

  if (secoes.length && linksNav.length) {
    const observerNav = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          const id = entrada.target.getAttribute('id');
          linksNav.forEach(link => {
            link.classList.toggle('ativo', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secoes.forEach(secao => observerNav.observe(secao));
  }

  /* ---------- Revelação de elementos ao rolar ---------- */
  const elementosRevelar = document.querySelectorAll('.reveal');

  if (elementosRevelar.length) {
    const observerRevelar = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('em-vista');
          observerRevelar.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15 });

    elementosRevelar.forEach(el => observerRevelar.observe(el));
  }

  /* ---------- Validação do formulário de contato ---------- */
  const form = document.querySelector('#contato form');

  if (form) {
    const nome = form.querySelector('#nome');
    const email = form.querySelector('#email');
    const telefone = form.querySelector('#telefone');
    const mensagem = form.querySelector('#mensagem');

    const msgNome = form.querySelector('#mensagemNome');
    const msgEmail = form.querySelector('#mensagemEmail');
    const msgTelefone = form.querySelector('#mensagemTelefone');
    const status = form.querySelector('.form-status');

    const validarNome = () => {
      const valor = nome.value.trim();
      if (valor.length < 2) {
        marcar(nome, msgNome, 'Informe seu nome completo.', false);
        return false;
      }
      marcar(nome, msgNome, 'Nome válido.', true);
      return true;
    };

    const validarEmail = () => {
      const valor = email.value.trim();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(valor)) {
        marcar(email, msgEmail, 'Informe um email válido.', false);
        return false;
      }
      marcar(email, msgEmail, 'Email válido.', true);
      return true;
    };

    const validarTelefone = () => {
      const digitos = telefone.value.replace(/\D/g, '');
      if (digitos.length < 10) {
        marcar(telefone, msgTelefone, 'Informe um telefone com DDD.', false);
        return false;
      }
      marcar(telefone, msgTelefone, 'Telefone válido.', true);
      return true;
    };

    const marcar = (campo, msgEl, texto, ok) => {
      campo.classList.toggle('valido', ok);
      campo.classList.toggle('invalido', !ok);
      if (msgEl) {
        msgEl.textContent = texto;
        msgEl.className = ok ? 'certo' : 'erro';
      }
    };

    // máscara simples de telefone
    telefone.addEventListener('input', () => {
      let v = telefone.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 5) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/(\d{0,2})/, '($1');
      }
      telefone.value = v;
    });

    nome.addEventListener('blur', validarNome);
    email.addEventListener('blur', validarEmail);
    telefone.addEventListener('blur', validarTelefone);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nomeOk = validarNome();
      const emailOk = validarEmail();
      const telefoneOk = validarTelefone();

      if (nomeOk && emailOk && telefoneOk) {
        const botao = form.querySelector('button[type="submit"]');
        const textoOriginal = botao.textContent;

        botao.disabled = true;
        botao.textContent = 'Enviando...';

        // Simulação de envio (não há backend conectado nesta página estática)
        setTimeout(() => {
          if (status) {
            status.textContent = `Obrigado, ${nome.value.trim().split(' ')[0]}! Sua mensagem foi registrada e retornaremos em breve.`;
            status.className = 'form-status certo';
          }
          form.reset();
          [nome, email, telefone].forEach(c => c.classList.remove('valido', 'invalido'));
          [msgNome, msgEmail, msgTelefone].forEach(m => { if (m) m.textContent = ''; });
          botao.disabled = false;
          botao.textContent = textoOriginal;
        }, 900);
      } else if (status) {
        status.textContent = 'Verifique os campos destacados antes de enviar.';
        status.className = 'form-status erro';
      }
    });
  }

  /* ---------- Contadores animados (hero) ---------- */
  const contadores = document.querySelectorAll('[data-contador]');

  if (contadores.length) {
    const animarContador = (el) => {
      const alvo = parseFloat(el.dataset.contador);
      const sufixo = el.dataset.sufixo || '';
      const duracao = 1400;
      const inicio = performance.now();

      const passo = (agora) => {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const facilitado = 1 - Math.pow(1 - progresso, 3);
        const valor = alvo * facilitado;
        el.textContent = (Number.isInteger(alvo) ? Math.round(valor) : valor.toFixed(1)) + sufixo;
        if (progresso < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    };

    const observerContador = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          animarContador(entrada.target);
          observerContador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.6 });

    contadores.forEach(c => observerContador.observe(c));
  }

  /* ---------- Ano automático no rodapé ---------- */
  const anoEl = document.querySelector('[data-ano]');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ---------- Paralaxe do painel visual do herói (movimento do mouse) ---------- */
  const heroVisual = document.getElementById('heroVisual');

  if (heroVisual && !prefereReduzirMovimento && window.matchMedia('(hover: hover)').matches) {
    const wrap = heroVisual.closest('.hero-visual-wrap');
    const inclinacaoMax = 8;

    wrap.addEventListener('mousemove', (evento) => {
      const retangulo = wrap.getBoundingClientRect();
      const relX = (evento.clientX - retangulo.left) / retangulo.width - 0.5;
      const relY = (evento.clientY - retangulo.top) / retangulo.height - 0.5;

      heroVisual.style.setProperty('--tilt-y', (relX * inclinacaoMax) + 'deg');
      heroVisual.style.setProperty('--tilt-x', (relY * -inclinacaoMax) + 'deg');
    });

    wrap.addEventListener('mouseleave', () => {
      heroVisual.style.setProperty('--tilt-x', '0deg');
      heroVisual.style.setProperty('--tilt-y', '0deg');
    });
  }

  /* ---------- Círculos de performance (seção Diferenciais) ---------- */
  const scores = document.querySelectorAll('.score');

  if (scores.length) {
    const animarScore = (el) => {
      const alvo = parseFloat(el.dataset.alvo) || 0;
      const circulo = el.querySelector('.score-progresso');
      const numeroEl = el.querySelector('.score-numero');

      let comprimento = 326.7;
      if (circulo) {
        const raio = circulo.r.baseVal.value;
        comprimento = 2 * Math.PI * raio;
        circulo.style.strokeDasharray = String(comprimento);
      }

      const duracao = 1400;
      const inicio = performance.now();

      const passo = (agora) => {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const facilitado = 1 - Math.pow(1 - progresso, 3);
        const valorAtual = alvo * facilitado;

        if (circulo) {
          circulo.style.strokeDashoffset = String(comprimento * (1 - valorAtual / 100));
        }
        if (numeroEl) numeroEl.textContent = Math.round(valorAtual);

        if (progresso < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    };

    const observerScore = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          animarScore(entrada.target);
          observerScore.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.5 });

    scores.forEach(s => observerScore.observe(s));
  }
});

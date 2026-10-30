
document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // CONFIGURAÇÕES
    // =========================================

    // Use somente a URL principal do projeto,
    // sem /rest/v1 no final.
    const SUPABASE_URL = "https://rvgbxrkucnfrqztljfxb.supabase.co";

    // Use a chave pública (anon/publishable).
    // Nunca use service_role ou chave secreta.
    const SUPABASE_KEY = "sb_publishable_xxmkrvTwXQ8SqF8JVbBL_Q_BMN8tQpU";

    // Número do responsável pelos agendamentos.
    // Formato: 55 + DDD + número.
    const WHATSAPP_EQUIPE = "+55 83 98206-1860";

    const configurado =
        SUPABASE_URL.startsWith("https://") &&
        !SUPABASE_URL.includes("/rest/v1") &&
        !SUPABASE_KEY.startsWith("COLE_AQUI") &&
        Boolean(window.supabase);

    const banco = configurado
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
        : null;

    // =========================================
    // MENU
    // =========================================

    const nav = document.getElementById("nav");
    const toggle = document.getElementById("menuToggle");

    toggle.addEventListener("click", () => {
        const aberto = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(aberto));
        toggle.textContent = aberto ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.textContent = "☰";
        });
    });

    document.getElementById("year").textContent =
        new Date().getFullYear();

    // =========================================
    // GALERIA
    // =========================================

    const dialog = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    document.querySelectorAll(".gallery-item").forEach(item => {
        item.addEventListener("click", () => {
            lightboxImage.src = item.dataset.img;
            lightboxImage.alt = item.querySelector("img").alt;
            dialog.showModal();
        });
    });

    document.getElementById("closeLightbox")
        .addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });

    document.querySelectorAll("[data-filter]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-filter]").forEach(filtro => {
                filtro.classList.toggle("active", filtro === button);
            });

            document.querySelectorAll(".gallery-item").forEach(item => {
                item.hidden =
                    button.dataset.filter !== "todos" &&
                    item.dataset.category !== button.dataset.filter;
            });
        });
    });

    // =========================================
    // SERVIÇOS
    // =========================================

    const categorias = {
        categoryServices: [
            "Corte e Barba",
            "Corte e sobrancelhas",
            "Barba e sobrancelhas",
            "Barba",
            "Barba + pigmentação",
            "Freestyle simples",
            "Freestyle grande",
            "Luzes",
            "Sobrancelhas",
            "Pigmentação",
            "Pigmentação da Barba",
            "Corte e Pigmentação",
            "Alisamento Americano",
            "Pé dos cabelos / cantinhos",
            "Corte e alisamento americano",
            "Bigode",
            "Desenho da barba",
            "Hidratação",
            "Selagem",
            "Coloração",
            "Platinado e corte",
            "Colorido",
            "Luzes e corte",
            "Higienização Capilar",
            "Máscara Preta",
            "Hidratação barba"
        ],

        categorySpa: [
            "Corte Barba Sobrancelha e SPA facial",
            "Corte e SPA facial",
            "Barba e SPA facial",
            "Spa facial"
        ],

        categoryCorte: [
            "Corte e Barba e Sobrancelha",
            "Corte infantil",
            "Corte",
            "Corte na tesoura curto",
            "Corte na tesoura médio",
            "Corte Infantil Tesoura",
            "Infantil de 0 a 1 ano"
        ],

        categoryEpilacao: [
            "Epilação nasal",
            "Epilação orelha",
            "Epilação ouvido + nariz"
        ]
    };

    Object.entries(categorias).forEach(([id, servicos]) => {
        const container = document.getElementById(id);

        servicos.forEach(servico => {
            const card = document.createElement("div");
            card.className = "choice-card";

            const main = document.createElement("div");
            main.className = "choice-main";

            const label = document.createElement("label");
            label.className = "choice-label";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "chosenService";
            radio.value = servico;

            const nome = document.createElement("span");
            nome.textContent = servico;

            label.append(radio, nome);
            main.appendChild(label);

            const seta = document.createElement("span");
            seta.className = "choice-avatar";
            seta.textContent = "↑";
            seta.setAttribute("aria-hidden", "true");

            card.append(main, seta);
            container.appendChild(card);

            card.addEventListener("click", () => {
                radio.checked = true;

                document.querySelectorAll(".choice-card").forEach(item => {
                    item.classList.toggle(
                        "selected",
                        item.querySelector("input").checked
                    );
                });
            });
        });
    });

    // =========================================
    // CATEGORIAS FECHADAS INICIALMENTE
    // =========================================

    const categoriasAgendamento =
        document.querySelectorAll(".booking-category");

    categoriasAgendamento.forEach(categoria => {
        categoria.open = false;
    });

    categoriasAgendamento.forEach(categoria => {
        categoria.addEventListener("toggle", () => {
            if (categoria.open) {
                categoriasAgendamento.forEach(outra => {
                    if (outra !== categoria) {
                        outra.open = false;
                    }
                });
            }
        });
    });

    // =========================================
    // PROFISSIONAIS
    // =========================================

    const profissionais = [
        {
            nome: "Matheus Verissimo",
            avatar: "M",
            horarios: {
                "Manhã": ["09:00", "09:45", "10:30"],
                "Tarde": [
                    "14:00", "14:45", "15:30",
                    "16:15", "17:00", "17:45"
                ],
                "Noite": ["18:30"]
            }
        },
        {
            nome: "Aline",
            avatar: "A",
            horarios: {
                "Tarde": [
                    "14:00", "14:45", "15:30",
                    "16:15", "17:00", "17:45"
                ],
                "Noite": ["18:30"]
            }
        },
        {
            nome: "Theo Reis",
            avatar: "T",
            horarios: {
                "Manhã": ["09:00"],
                "Tarde": ["14:00", "14:45", "15:30", "17:30"],
                "Noite": ["18:15", "19:00"]
            }
        }
    ];

    // =========================================
    // ELEMENTOS E VARIÁVEIS
    // =========================================

    const form = document.getElementById("bookingForm");
    const feedback = document.getElementById("bookingFeedback");
    const result = document.getElementById("bookingResult");

    const nextButton = document.getElementById("nextStep");
    const prevButton = document.getElementById("prevStep");
    const finishButton = document.getElementById("finishBooking");

    const dayPrev = document.getElementById("dayPrev");
    const dayNext = document.getElementById("dayNext");
    const dayLabel = document.getElementById("selectedDayLabel");

    const lista = document.getElementById("professionalsContainer");

    const botaoCliente = document.getElementById("whatsappCliente");
    const botaoEquipe = document.getElementById("whatsappEquipe");
    const botaoCopiar = document.getElementById("copiarAvisoEquipe");

    let etapaAtual = 1;
    let horarioSelecionado = "";
    let profissionalSelecionado = "";
    let consultaAtual = 0;
    let confirmando = false;
    let confirmado = false;
    let avisoEquipe = "";

    function mensagem(texto) {
        feedback.textContent = texto;
    }

    function obterServico() {
        return form.querySelector(
            'input[name="chosenService"]:checked'
        )?.value || "";
    }

    // =========================================
    // DATA
    // =========================================

    function hoje() {
        const data = new Date();
        data.setHours(12, 0, 0, 0);
        return data;
    }

    let dataSelecionada = hoje();

    function dataISO(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }

    function atualizarData() {
        if (dataSelecionada < hoje()) {
            dataSelecionada = hoje();
        }

        if (dataSelecionada.getDay() === 0) {
            dataSelecionada.setDate(dataSelecionada.getDate() + 1);
        }

        dayLabel.textContent = dataSelecionada.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

        const anterior = new Date(dataSelecionada);
        anterior.setDate(anterior.getDate() - 1);

        if (anterior.getDay() === 0) {
            anterior.setDate(anterior.getDate() - 1);
        }

        dayPrev.disabled = anterior < hoje();

        const limite = hoje();
        limite.setDate(limite.getDate() + 90);

        const proximo = new Date(dataSelecionada);
        proximo.setDate(proximo.getDate() + 1);

        if (proximo.getDay() === 0) {
            proximo.setDate(proximo.getDate() + 1);
        }

        dayNext.disabled = proximo > limite;
    }

    async function mudarDia(direcao) {
        if (confirmando || confirmado) return;

        const nova = new Date(dataSelecionada);
        nova.setDate(nova.getDate() + direcao);

        if (nova.getDay() === 0) {
            nova.setDate(nova.getDate() + direcao);
        }

        const limite = hoje();
        limite.setDate(limite.getDate() + 90);

        if (nova < hoje() || nova > limite) return;

        dataSelecionada = nova;
        limparHorario();
        atualizarData();

        if (profissionalSelecionado) {
            await consultarHorarios();
        }
    }

    dayPrev.addEventListener("click", () => mudarDia(-1));
    dayNext.addEventListener("click", () => mudarDia(1));

    // =========================================
    // SELEÇÃO DOS HORÁRIOS
    // =========================================

    function limparHorario() {
        horarioSelecionado = "";
        document.getElementById("time").value = "";

        document.querySelectorAll(".slot-button").forEach(botao => {
            botao.classList.remove("selected");
            botao.setAttribute("aria-pressed", "false");
        });
    }

    function abrirProfissional(accordion) {
        document.querySelectorAll(".pro-accordion").forEach(item => {
            const aberto = item === accordion;

            item.classList.toggle("expanded", aberto);
            item.querySelector(".pro-slots").hidden = !aberto;

            item.querySelector(".pro-card").setAttribute(
                "aria-expanded",
                String(aberto)
            );
        });
    }

    profissionais.forEach(profissional => {
        const accordion = document.createElement("div");
        accordion.className = "pro-accordion";
        accordion.dataset.profissional = profissional.nome;

        const card = document.createElement("div");
        card.className = "pro-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-expanded", "false");

        const avatar = document.createElement("span");
        avatar.className = "pro-avatar";
        avatar.textContent = profissional.avatar;

        const detalhes = document.createElement("div");
        detalhes.className = "pro-detail";

        const nome = document.createElement("strong");
        nome.textContent = profissional.nome;

        const servico = document.createElement("small");
        servico.className = "selected-service-label";

        detalhes.append(nome, servico);

        const direita = document.createElement("div");
        direita.className = "pro-right";

        const texto = document.createElement("small");
        texto.textContent = "Ver horários";

        const seta = document.createElement("b");
        seta.textContent = "⌄";

        direita.append(texto, seta);
        card.append(avatar, detalhes, direita);

        const slots = document.createElement("div");
        slots.className = "pro-slots";
        slots.hidden = true;

        Object.entries(profissional.horarios).forEach(([periodo, horas]) => {
            const grupo = document.createElement("div");
            grupo.className = "slot-period";

            const titulo = document.createElement("h4");
            titulo.textContent = periodo;

            const botoes = document.createElement("div");
            botoes.className = "slot-buttons";

            horas.forEach(hora => {
                const botao = document.createElement("button");
                botao.type = "button";
                botao.className = "slot-button";
                botao.textContent = hora;
                botao.dataset.time = hora;
                botao.disabled = true;
                botao.setAttribute("aria-pressed", "false");

                botao.addEventListener("click", () => {
                    if (botao.disabled || confirmado) return;

                    limparHorario();
                    horarioSelecionado = hora;

                    botao.classList.add("selected");
                    botao.setAttribute("aria-pressed", "true");

                    document.getElementById("time").value = hora;
                    mensagem(`Horário escolhido: ${hora}`);
                });

                botoes.appendChild(botao);
            });

            grupo.append(titulo, botoes);
            slots.appendChild(grupo);
        });

        async function selecionarProfissional() {
            if (confirmando || confirmado) return;

            if (profissionalSelecionado !== profissional.nome) {
                limparHorario();
            }

            profissionalSelecionado = profissional.nome;
            abrirProfissional(accordion);
            await consultarHorarios();
        }

        card.addEventListener("click", selecionarProfissional);

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selecionarProfissional();
            }
        });

        accordion.append(card, slots);
        lista.appendChild(accordion);
    });

    // =========================================
    // CONSULTAR HORÁRIOS NO SUPABASE
    // =========================================

    async function consultarHorarios() {
        if (!profissionalSelecionado || confirmado) return false;

        const numeroConsulta = ++consultaAtual;
        const profissional = profissionalSelecionado;
        const data = dataISO(dataSelecionada);

        const accordion = Array.from(
            document.querySelectorAll(".pro-accordion")
        ).find(item => item.dataset.profissional === profissional);

        if (!accordion) return false;

        const botoes = accordion.querySelectorAll(".slot-button");

        botoes.forEach(botao => {
            botao.disabled = true;
            botao.classList.remove("occupied", "closed");
            botao.textContent = botao.dataset.time;
        });

        if (!banco) {
            mensagem("Configure a URL e a chave pública do Supabase.");
            return false;
        }

        mensagem("Consultando horários...");

        try {
            const { data: reservas, error } = await banco.rpc(
                "horarios_ocupados",
                {
                    p_profissional: profissional,
                    p_data: data
                }
            );

            if (numeroConsulta !== consultaAtual) return false;

            if (error) {
                console.error(error);
                mensagem("Não foi possível consultar os horários.");
                return false;
            }

            const ocupados = new Set(
                (reservas || []).map(item => item.horario)
            );

            const agora = new Date();

            botoes.forEach(botao => {
                const hora = botao.dataset.time;
                const reservado = ocupados.has(hora);

                const dataHora = new Date(`${data}T${hora}:00`);
                const encerrado = dataHora <= agora;

                botao.disabled = reservado || encerrado;

                botao.classList.toggle("occupied", reservado);
                botao.classList.toggle(
                    "closed",
                    encerrado && !reservado
                );

                botao.textContent = reservado
                    ? `${hora} · Ocupado`
                    : encerrado
                        ? `${hora} · Encerrado`
                        : hora;
            });

            const selecionado = Array.from(botoes).find(
                botao => botao.dataset.time === horarioSelecionado
            );

            if (selecionado && selecionado.disabled) {
                limparHorario();
            }

            mensagem("Selecione um horário disponível.");
            return true;

        } catch (erro) {
            if (numeroConsulta !== consultaAtual) return false;

            console.error(erro);
            mensagem("Erro de conexão ao consultar horários.");
            return false;
        }
    }

    // =========================================
    // WHATSAPP
    // =========================================

    function normalizarWhatsApp(valor) {
        const digitos = valor.replace(/\D/g, "");

        // Número brasileiro com DDD: 10 ou 11 dígitos.
        if (/^\d{10,11}$/.test(digitos)) {
            return "55" + digitos;
        }

        // Número brasileiro com código 55.
        if (/^55\d{10,11}$/.test(digitos)) {
            return digitos;
        }

        return "";
    }

    function criarLinkWhatsApp(numero, texto) {
        return (
            "https://wa.me/" +
            numero +
            "?text=" +
            encodeURIComponent(texto)
        );
    }

    function prepararMensagensWhatsApp(dados) {
        const mensagemCliente =
`👑 BARBEARIA REI'S

Olá, ${dados.nome}!

Seu agendamento foi confirmado!

✂️ Serviço: ${dados.servico}
💈 Profissional: ${dados.profissional}
📅 Data: ${dados.data}
🕒 Horário: ${dados.horario}

📍 Av. Josefa Taveira, 2060
Mangabeira - João Pessoa/PB

Aguardamos você!`;

        avisoEquipe =
`📋 NOVO AGENDAMENTO - BARBEARIA REI'S

👤 Cliente: ${dados.nome}
📱 WhatsApp: ${dados.telefone}
✂️ Serviço: ${dados.servico}
💈 Profissional: ${dados.profissional}
📅 Data: ${dados.data}
🕒 Horário: ${dados.horario}`;

        botaoCliente.href = criarLinkWhatsApp(
            dados.telefone,
            mensagemCliente
        );

        botaoCliente.hidden = false;

        const numeroEquipe = normalizarWhatsApp(
            WHATSAPP_EQUIPE
        );

        if (numeroEquipe) {
            botaoEquipe.href = criarLinkWhatsApp(
                numeroEquipe,
                avisoEquipe
            );

            botaoEquipe.hidden = false;
        } else {
            botaoEquipe.hidden = true;
        }

        botaoCopiar.hidden = false;
    }

    botaoCopiar.addEventListener("click", async () => {
        if (!avisoEquipe) return;

        try {
            await navigator.clipboard.writeText(avisoEquipe);
            mensagem("Aviso copiado! Cole no WhatsApp da equipe.");
        } catch (erro) {
            console.error(erro);
            mensagem(
                "Não foi possível copiar automaticamente. " +
                "Tente usar o botão em uma página HTTPS."
            );
        }
    });

    // =========================================
    // ETAPAS DO AGENDAMENTO
    // =========================================

    function mostrarEtapa(etapa) {
        etapaAtual = etapa;

        document.querySelectorAll(".wizard-step").forEach(elemento => {
            elemento.hidden =
                Number(elemento.dataset.step) !== etapa;
        });

        document.getElementById("stepCounter").textContent =
            `ETAPA ${etapa} DE 3`;

        document.getElementById("progressFill").style.width =
            `${(etapa / 3) * 100}%`;

        prevButton.hidden = etapa === 1;
        nextButton.hidden = etapa === 3;
        finishButton.hidden = etapa !== 3;

        result.hidden = true;
        mensagem("");

        if (etapa === 2) {
            document.querySelectorAll(".selected-service-label")
                .forEach(label => {
                    label.textContent = obterServico();
                });

            atualizarData();

            if (profissionalSelecionado) {
                consultarHorarios();
            }
        }

        if (etapa === 3) {
            document.getElementById("bookingSummary").textContent =
                `Serviço: ${obterServico()} • ` +
                `Profissional: ${profissionalSelecionado} • ` +
                `Data: ${dataSelecionada.toLocaleDateString("pt-BR")} • ` +
                `Horário: ${horarioSelecionado}`;
        }
    }

    nextButton.addEventListener("click", async () => {
        if (confirmando || confirmado) return;

        nextButton.disabled = true;

        try {
            if (etapaAtual === 1) {
                if (!obterServico()) {
                    mensagem("Selecione um serviço.");
                    return;
                }

                mostrarEtapa(2);
                return;
            }

            if (etapaAtual === 2) {
                if (!profissionalSelecionado) {
                    mensagem("Selecione um profissional.");
                    return;
                }

                if (!horarioSelecionado) {
                    mensagem("Selecione um horário.");
                    return;
                }

                const disponivel = await consultarHorarios();

                if (!disponivel || !horarioSelecionado) {
                    mensagem("Escolha um horário disponível.");
                    return;
                }

                mostrarEtapa(3);
            }
        } finally {
            nextButton.disabled = false;
        }
    });

    prevButton.addEventListener("click", () => {
        if (confirmando || confirmado) return;

        if (etapaAtual > 1) {
            mostrarEtapa(etapaAtual - 1);
        }
    });

    // =========================================
    // CONFIRMAR AGENDAMENTO
    // =========================================

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (confirmando || confirmado) return;

        const nome = document.getElementById("clientName")
            .value.trim();

        const telefoneDigitado = document.getElementById(
            "clientWhatsapp"
        ).value;

        const telefone = normalizarWhatsApp(
            telefoneDigitado
        );

        const servico = obterServico();
        const profissional = profissionalSelecionado;
        const data = dataISO(dataSelecionada);
        const horario = horarioSelecionado;

        if (nome.length < 2 || nome.length > 100) {
            mensagem("Digite seu nome corretamente.");
            return;
        }

        if (!telefone) {
            mensagem("Digite um WhatsApp válido com DDD.");
            return;
        }

        if (!servico || !profissional || !horario) {
            mensagem("Complete todas as etapas.");
            return;
        }

        if (!banco) {
            mensagem("O Supabase ainda não foi configurado.");
            return;
        }

        confirmando = true;
        finishButton.disabled = true;
        prevButton.disabled = true;
        finishButton.textContent = "CONFIRMANDO...";

        mensagem("Registrando seu agendamento...");

        try {
            // Mantém a função que já funciona no seu banco.
            // O WhatsApp não é enviado para o banco nesta versão.
            const { data: resposta, error } = await banco.rpc(
                "confirmar_agendamento",
                {
                    p_nome: nome,
                    p_servico: servico,
                    p_profissional: profissional,
                    p_data: data,
                    p_horario: horario
                }
            );

            if (error) {
                console.error(error);
                mensagem(
                    "Não foi possível confirmar. " +
                    "Verifique a conexão antes de tentar novamente."
                );
                return;
            }

            if (!resposta?.sucesso) {
                mostrarEtapa(2);
                await consultarHorarios();

                mensagem(
                    resposta?.mensagem ||
                    "Esse horário não está disponível."
                );
                return;
            }

            confirmado = true;

            const dataFormatada =
                dataSelecionada.toLocaleDateString("pt-BR");

            document.getElementById("confirmedBooking").textContent =
                `Cliente: ${nome} • ` +
                `Serviço: ${servico} • ` +
                `Profissional: ${profissional} • ` +
                `Data: ${dataFormatada} • ` +
                `Horário: ${horario}`;

            prepararMensagensWhatsApp({
                nome,
                telefone,
                servico,
                profissional,
                data: dataFormatada,
                horario
            });

            document.querySelectorAll(".wizard-step").forEach(
                elemento => elemento.hidden = true
            );

            result.hidden = false;
            finishButton.hidden = true;
            prevButton.hidden = true;
            nextButton.hidden = true;

            mensagem("Agendamento confirmado com sucesso!");

            result.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        } catch (erro) {
            console.error(erro);

            mensagem(
                "Houve uma falha de conexão. " +
                "Consulte a barbearia antes de tentar novamente."
            );

        } finally {
            confirmando = false;
            finishButton.disabled = false;
            prevButton.disabled = false;
            finishButton.textContent = "CONFIRMAR AGENDAMENTO";
        }
    });

    // =========================================
    // INICIAR
    // =========================================

    atualizarData();
    mostrarEtapa(1);
});
/* =====================================================
   Futuramente colocar essa chave no backend
   Chave Erick = AIzaSyDuT_Vd3e4nLEZDYPXYMKQKsaiWTB95geg
   Chave Pedro = AIzaSyDJZE4pDd6wF1U__6DGbTFGeXxDzhyXias
   ===================================================== */
const GEMINI_API_KEY = 'AIzaSyDJZE4pDd6wF1U__6DGbTFGeXxDzhyXias';

const elementos = {
  paciente: document.getElementById('paciente'),
  cep: document.getElementById('cep'),
  bairro: document.getElementById('bairro'),
  resultadoUbs: document.getElementById('resultado-ubs'),
  ubsStatus: document.getElementById('ubs-status'),
  ubsEncontrada: document.getElementById('ubs-encontrada'),
  ubsId: document.getElementById('ubs-id'),
  historia: document.getElementById('historia'),
  btnAvancar: document.getElementById('btn-avancar'),

  telaFormulario: document.getElementById('tela-formulario'),
  telaPreview: document.getElementById('tela-preview'),

  revPaciente: document.getElementById('rev-paciente'),
  revUbs: document.getElementById('rev-ubs'),
  revUbsId: document.getElementById('rev-ubs-id'),
  revHistoria: document.getElementById('rev-historia'),

  btnVoltar: document.getElementById('btn-voltar'),
  btnImprimir: document.getElementById('btn-imprimir'),

  printPaciente: document.getElementById('print-paciente'),
  printUbs: document.getElementById('print-ubs'),
  printUbsId: document.getElementById('print-ubs-id'),
  printHistoria: document.getElementById('print-historia'),

  loadingCep: document.getElementById('loading-cep')
};

function preencherBairros() {
  elementos.bairro.innerHTML = '<option value="">Selecione um bairro...</option>';

  const bairros = Object.keys(baseDeDados).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  bairros.forEach((bairro) => {
    const option = document.createElement('option');
    option.value = bairro;
    option.textContent = bairro;
    elementos.bairro.appendChild(option);
  });
}

function localizarUBS() {
  const bairroSelecionado = elementos.bairro.value;
  const dadosUBS = baseDeDados[bairroSelecionado];

  if (dadosUBS) {
    elementos.ubsEncontrada.innerText = dadosUBS.nome;
    elementos.ubsId.innerText = dadosUBS.id;
    elementos.ubsStatus.innerText = 'UBS localizada com sucesso.';
    elementos.resultadoUbs.classList.add('resultado-ubs--ativo');
  } else {
    elementos.ubsEncontrada.innerText = '—';
    elementos.ubsId.innerText = '—';
    elementos.ubsStatus.innerText = 'Aguardando seleção do CEP ou bairro.';
    elementos.resultadoUbs.classList.remove('resultado-ubs--ativo');
  }
}

function mostrarTela(idTela) {
  elementos.telaFormulario.style.display = 'none';
  elementos.telaPreview.style.display = 'none';

  if (idTela === 'tela-formulario') {
    elementos.telaFormulario.style.display = 'block';
  }

  if (idTela === 'tela-preview') {
    elementos.telaPreview.style.display = 'block';
  }
}

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

async function buscarCEP() {
  const cepLimpo = elementos.cep.value.replace(/\D/g, '');

  if (cepLimpo.length === 0) {
    return;
  }

  if (cepLimpo.length < 8) {
    alert('⚠️ O CEP está incompleto. Ele precisa ter 8 números.');
    return;
  }

  elementos.loadingCep.style.display = 'block';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      alert('⚠️ CEP não encontrado. Verifique se os números estão corretos.');
      return;
    }

    let bairroEncontrado = false;
    const bairroAPI = data.bairro ? normalizarTexto(data.bairro) : '';

    if (bairroAPI) {
      let indiceExato = -1;
      let indiceParcial = -1;

      for (let i = 1; i < elementos.bairro.options.length; i += 1) {
        const textoOption = normalizarTexto(elementos.bairro.options[i].text);

        if (textoOption === bairroAPI) {
          indiceExato = i;
          break;
        }

        if (
          indiceParcial === -1 &&
          (textoOption.includes(bairroAPI) || bairroAPI.includes(textoOption))
        ) {
          indiceParcial = i;
        }
      }

      if (indiceExato !== -1) {
        elementos.bairro.selectedIndex = indiceExato;
        bairroEncontrado = true;
      } else if (indiceParcial !== -1) {
        elementos.bairro.selectedIndex = indiceParcial;
        bairroEncontrado = true;
      }
    }

    localizarUBS();

    if (!bairroEncontrado && data.bairro) {
      alert(`O CEP achou a área "${data.bairro}", mas ela não casou perfeitamente. Escolha a opção mais próxima no menu.`);
    }
  } catch (error) {
    alert(`⚠️ Erro de conexão ao buscar CEP: ${error.message}`);
  } finally {
    elementos.loadingCep.style.display = 'none';
  }
}

async function melhorarTextoComIA(textoOriginal) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'COLOQUE_SUA_CHAVE_AQUI') {
    alert('❌ Problemas com a API Key da Gemini no app.js.');
    return textoOriginal;
    }

    const promptMestre = `
      Reescreva a anotação abaixo em linguagem médica formal, técnica, objetiva e padronizada.

      Sua função não é apenas corrigir ortografia, mas também padronizar a redação clínica.

      REGRAS:
      1. Não invente nenhuma informação.
      2. Não adicione hipótese diagnóstica, exame, conduta ou detalhe ausente.
      3. Reorganize o conteúdo em ordem clínica padronizada.
      4. Substitua termos coloquiais por terminologia médico-formal.
      5. Mantenha o conteúdo fiel ao original, porém com redação mais técnica.
      6. Use, sempre que possível, esta ordem:
        a) sintoma ou queixa principal
        b) sinais/achados objetivos
        c) comorbidades ou condições referidas
        d) medicações em uso
        e) observações finais presentes no texto original
      7. Tente manter o mesmo número de parágrafos, mas dê preferência a formalização.
      8. Não use listas, títulos, comentários ou explicações.

      Exemplos de formalização esperada:
      - "dor no peito" → "dor torácica"
      - "pressão normal" → "pressão arterial dentro da normalidade"
      - "tem que tomar remédio sem parar" → "faz uso contínuo da medicação"
      - "remédio para pressão" → "medicação anti-hipertensiva"

    Texto original:
    ${textoOriginal}
    `.trim();

    try {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        contents: [
            {
            parts: [
                { text: promptMestre }
            ]
            }
        ],
        generationConfig: {
          temperature: 0.2, //diz o quão “ousada” será a escolha dentro desse grupo. Baixa (0.0 a 0.3), Média (0.4 a 0.8) e Alta (0.9+)
          topP: 0.8,  //diz até onde vai o grupo das opções aceitáveis. mais restrito = 0.5, mais amplo = 0.8
          topK: 20    //diz quantas opções entram no jogo. topK: 20 → o modelo só escolhe entre as 20 opções mais prováveis.
        },
        safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
        ]
        })
        }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(`❌ Erro da API Gemini: ${data.error?.message || 'erro desconhecido'}`);
      return textoOriginal;
    }

    const textoResposta = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!textoResposta) {
      alert('⚠️ A IA não retornou texto. O original será mantido.');
      return textoOriginal;
    }

    return textoResposta;
  } catch (error) {
    alert(`❌ Erro ao conectar com a IA: ${error.message}`);
    return textoOriginal;
  }
}

async function irParaRevisao() {
  const nome = elementos.paciente.value.trim();
  const bairro = elementos.bairro.value;
  const ubs = elementos.ubsEncontrada.innerText.trim();
  const ubsId = elementos.ubsId.innerText.trim();
  const historiaOriginal = elementos.historia.value.trim();

  if (!nome || !bairro || !historiaOriginal || !ubs) {
    alert('Por favor, preencha pelo menos o nome do paciente, o bairro, a UBS e a história clínica.');
    return;
  }

  const textoOriginalBotao = elementos.btnAvancar.innerText;
  elementos.btnAvancar.innerText = '⏳ Estruturando texto com IA...';
  elementos.btnAvancar.disabled = true;

  const historiaMelhorada = await melhorarTextoComIA(historiaOriginal);

  elementos.btnAvancar.innerText = textoOriginalBotao;
  elementos.btnAvancar.disabled = false;

  elementos.revPaciente.innerText = nome;
  elementos.revUbs.innerText = ubs;
  elementos.revUbsId.innerText = ubsId;
  elementos.revHistoria.value = historiaMelhorada;

  mostrarTela('tela-preview');
}

function voltarParaForm() {
  elementos.historia.value = elementos.revHistoria.value;
  mostrarTela('tela-formulario');
}

function confirmarEImprimir() {
  elementos.printPaciente.innerText = elementos.revPaciente.innerText;
  elementos.printUbs.innerText = elementos.revUbs.innerText;
  elementos.printUbsId.innerText = elementos.revUbsId.innerText;
  elementos.printHistoria.innerText = elementos.revHistoria.value;

  window.print();
}

function configurarEventos() {
  elementos.bairro.addEventListener('change', localizarUBS);
  elementos.btnVoltar.addEventListener('click', voltarParaForm);
  elementos.btnImprimir.addEventListener('click', confirmarEImprimir);

  elementos.cep.addEventListener('blur', buscarCEP);
  elementos.btnAvancar.addEventListener('click', irParaRevisao);
}

function iniciar() {
  preencherBairros();
  configurarEventos();
  mostrarTela('tela-formulario');
}

document.addEventListener('DOMContentLoaded', iniciar);
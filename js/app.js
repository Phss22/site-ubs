/* =========================================
   Futuramente colocar essa chave no backend
   ========================================= */
const GEMINI_API_KEY = 'COLOQUE_SUA_CHAVE_AQUI';

const elementos = {
  paciente: document.getElementById('paciente'),
  cep: document.getElementById('cep'),
  rua: document.getElementById('rua'),
  bairro: document.getElementById('bairro'),
  ubsEncontrada: document.getElementById('ubs-encontrada'),
  historia: document.getElementById('historia'),
  btnAvancar: document.getElementById('btn-avancar'),

  telaFormulario: document.getElementById('tela-formulario'),
  telaPreview: document.getElementById('tela-preview'),

  revPaciente: document.getElementById('rev-paciente'),
  revEndereco: document.getElementById('rev-endereco'),
  revUbs: document.getElementById('rev-ubs'),
  revHistoria: document.getElementById('rev-historia'),

  btnVoltar: document.getElementById('btn-voltar'),
  btnAlterar: document.getElementById('btn-alterar'),
  btnImprimir: document.getElementById('btn-imprimir'),

  printPaciente: document.getElementById('print-paciente'),
  printEndereco: document.getElementById('print-endereco'),
  printUbs: document.getElementById('print-ubs'),
  printHistoria: document.getElementById('print-historia'),

  loadingCep: document.getElementById('loading-cep')
};

function preencherBairros() {
  elementos.bairro.innerHTML = '<option value="">Selecione um bairro ou conjunto...</option>';

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
  elementos.ubsEncontrada.value = baseDeDados[bairroSelecionado] || '';
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

    if (data.logradouro) {
    elementos.rua.value = data.logradouro;
    } else {
    elementos.rua.value = '';
    alert('Esse parece ser um CEP geral da cidade. A rua e o bairro precisam ser preenchidos manualmente.');
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
    alert('❌ Coloque sua API Key da Gemini no app.js.');
    return textoOriginal;
    }

    const promptMestre = `
    Reescreva as anotações médicas abaixo para que fiquem com um português correto, profissional e com boa fluidez.

    REGRAS ABSOLUTAS:
    1. APENAS corrija erros ortográficos, melhore a pontuação e expanda abreviações médicas comuns (ex: "pcte" para "paciente", "PA" para "Pressão Arterial").
    2. NÃO INVENTE, não deduza e não adicione NENHUM diagnóstico, sintoma, remédio ou dado que não esteja no texto original.
    3. NÃO use saudações (como "Olá"), não coloque títulos, não faça introduções nem comentários finais.
    4. Devolva EXATAMENTE E APENAS o texto clínico arrumado.

    Anotações do médico:
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
  const rua = elementos.rua.value.trim();
  const bairro = elementos.bairro.value;
  const ubs = elementos.ubsEncontrada.value.trim();
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

  const enderecoCompleto = rua
    ? `${rua}, Bairro/Conjunto: ${bairro}`
    : `Bairro/Conjunto: ${bairro}`;

  elementos.revPaciente.innerText = nome;
  elementos.revEndereco.innerText = enderecoCompleto;
  elementos.revUbs.innerText = ubs;
  elementos.revHistoria.value = historiaMelhorada;

  mostrarTela('tela-preview');
}

function voltarParaForm() {
  elementos.historia.value = elementos.revHistoria.value;
  mostrarTela('tela-formulario');
}

function alterarDescricao() {
  elementos.revHistoria.focus();
  const valor = elementos.revHistoria.value;
  elementos.revHistoria.value = '';
  elementos.revHistoria.value = valor;
}

function confirmarEImprimir() {
  elementos.printPaciente.innerText = elementos.revPaciente.innerText;
  elementos.printEndereco.innerText = elementos.revEndereco.innerText;
  elementos.printUbs.innerText = elementos.revUbs.innerText;
  elementos.printHistoria.innerText = elementos.revHistoria.value;

  window.print();
}

function configurarEventos() {
  elementos.bairro.addEventListener('change', localizarUBS);
  elementos.btnVoltar.addEventListener('click', voltarParaForm);
  elementos.btnAlterar.addEventListener('click', alterarDescricao);
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
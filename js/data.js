/* =======================================
   Em alguns espelhos do cadastro aparece o código concatenado com o IBGE do município (250400 + CNES), 
   mas no CNES oficial a unidade fica identificada pelo número de 7 dígitos. Isso aparece, por exemplo, 
   na USF Pedregal Adalberto Cesar (2362325 no CNES oficial; 2504002362325 no espelho).
   ======================================= */
// BANCO DE DADOS (UBS)
/* =======================================
   baseDeDados:
   - chave = bairro / conjunto / localidade
   - nome = unidade de referência
   - id = CNES de 7 dígitos quando já identificado
   ======================================= */
const baseDeDados = {
  "Araxá": {
    nome: "UBS Araxá",
    id: "5053188"
  },
  "Bairro das Cidades I": {
    nome: "UBS Bairro das Cidades I",
    id: "2362686"
  },
  "Bairro das Cidades II": {
    nome: "UBS Bairro das Cidades II",
    id: "2612771"
  },
  "Bairro das Nações": {
    nome: "UBS Nações",
    id: "9352929"
  },
  "Bela Vista": {
    nome: "UBS Bela Vista",
    id: "9338403"
  },
  "Bodocongó": {
    nome: "UBS Bodocongó",
    id: "5116279"
  },
  "Bodocongó - João Rique": {
    nome: "UBS João Rique",
    id: "2362392"
  },
  "Catolé - Centro de Saúde": {
    nome: "Policlínica do Catolé",
    id: "2362228"
  },
  "Catolé - Nossa Senhora Aparecida": {
    nome: "UBS Nossa Senhora Aparecida",
    id: "2362767"
  },
  "Catolé - Pedreira": {
    nome: "UBS José Aurino de Barros Filho",
    id: "2595435"
  },
  "Catolé de Zé Ferreira": {
    nome: "UBS Catolé de Zé Ferreira",
    id: "2362694"
  },
  "Centro": {
    nome: "Centro de Saúde Dr. Francisco Pinto",
    id: "2362252"
  },
  "Centenário": {
    nome: "UBS Eduardo Ramos",
    id: "9352880"
  },
  "Conceição": {
    nome: "UBS Conceição",
    id: "2792737"
  },
  "Cruzeiro": {
    nome: "UBS Maria de Lourdes Leoncio",
    id: "6267939"
  },
  "Cuités": {
    nome: "UBS Jocel Fechine",
    id: "2362716"
  },
  "Distrito de Catolé": {
    nome: "UBS Djalma Barbosa",
    id: "2362724"
  },
  "Galante": {
    nome: "UBS Galante",
    id: "5053129"
  },
  "Itararé": {
    nome: "UBS Wilson Furtado II Itararé",
    id: "2975637"
  },
  "Jardim América": {
    nome: "UBS Padre Hachid Ilo Beserra",
    id: "3537013"
  },
  "Jardim Paulistano": {
    nome: "UBS Romualdo Brito de Figueiredo",
    id: "5932416"
  },
  "Jardim Quarenta": {
    nome: "UBS Jardim Quarenta",
    id: "5968976"
  },
  "Jardim Tavares": {
    nome: "UBS Jardim Tavares",
    id: "2362333"
  },
  "Jeremias": {
    nome: "UBS Inacio Mayer",
    id: "2362341"
  },
  "José Pinheiro - Antonio Arruda": {
    nome: "UBS Antonio Arruda",
    id: "5933900"
  },
  "José Pinheiro - Francisco Brasileiro": {
    nome: "UBS Francisco Brasileiro",
    id: "2362384"
  },
  "José Pinheiro - Plinio Lemos": {
    nome: "UBS Plinio Lemos",
    id: "5116449"
  },
  "Liberdade": {
    nome: "UBS Liberdade",
    id: "4565193"
  },
  "Ligeiro": {
    nome: "UBS Serra da Borborema",
    id: "2792761"
  },
  "Malvinas I": {
    nome: "UBS Malvinas I",
    id: "5053250"
  },
  "Malvinas II": {
    nome: "UBS Malvinas II",
    id: "5053285"
  },
  "Malvinas III - Equipe I": {
    nome: "UBS Malvinas III Equipe I",
    id: "5053269"
  },
  "Malvinas - Maria das Graças Aguiar": {
    nome: "UBS Maria das Graças Aguiar Dra Gau",
    id: "5617332"
  },
  "Malvinas IV": {
    nome: "UBS Malvinas IV",
    id: "9360093"
  },
  "Malvinas V": {
    nome: "UBS Malvinas V",
    id: "6045340"
  },
  "Monte Castelo": {
    nome: "UBS Horacina de Almeida",
    id: "2595443"
  },
  "Monte Santo - Bonald Filho": {
    nome: "UBS Bonald Filho",
    id: "2595370"
  },
  "Monte Santo - UBS Monte Santo": {
    nome: "UBS Monte Santo",
    id: "5053242"
  },
  "Nova Brasília": {
    nome: "UBS Wesley Cariry Targino",
    id: "2595478"
  },
  "Pedregal": {
    nome: "UBS Adalberto Cesar",
    id: "2362325"
  },
  "Pedregal II": {
    nome: "UBS Raimundo Carneiro",
    id: "2595419"
  },
  "Quarenta": {
    nome: "UBS Quarenta",
    id: "9387935"
  },
  "Ramadinha I": {
    nome: "UBS Crisostomo Lucena",
    id: "2595451"
  },
  "Ramadinha - Maria Marques Diniz": {
    nome: "UBS Maria Marques Diniz",
    id: "4430301"
  },
  "Ressurreição": {
    nome: "UBS Ressurreição",
    id: "5485754"
  },
  "Rocha Cavalcante": {
    nome: "UBS Ana Amelia Vilar Cantalice",
    id: "5053137"
  },
  "Rosa Cruz": {
    nome: "UBS Argemiro de Figueiredo",
    id: "2362406"
  },
  "Santa Cruz": {
    nome: "Posto de Saúde Raiff Ramalho",
    id: "2362309"
  },
  "São Januário": {
    nome: "UBS São Januário II",
    id: "2595427"
  },
  "São José": {
    nome: "UBS Alice Maria Rodrigues",
    id: "4237943"
  },
  "São José da Mata - Centro de Saúde": {
    nome: "Policlínica de São José da Mata",
    id: "2362376"
  },
  "São José da Mata - Zona Rural I": {
    nome: "UBS Beija Flor Zona Rural I",
    id: "2792818"
  },
  "São José da Mata - Zona Urbana I": {
    nome: "UBS Colibri Zona Urbana I",
    id: "2792842"
  },
  "São José da Mata - Zona Urbana II": {
    nome: "UBS Sabiá Zona Urbana II",
    id: "2792850"
  },
  "Tambor I": {
    nome: "UBS Tambor I",
    id: "2362678"
  },
  "Tambor II": {
    nome: "UBS Tambor II",
    id: "2792869"
  },
  "Três Irmãs": {
    nome: "UBS Antonio Aurelio Ventura",
    id: "2595389"
  },
  "Universitário": {
    nome: "UBS Odete Leandro de Oliveira",
    id: "2362600"
  },
  "Velame": {
    nome: "UBS Velame",
    id: "2792877"
  },
  "Vila Cabral": {
    nome: "UBS Wilson Furtado",
    id: "2362627"
  }
};

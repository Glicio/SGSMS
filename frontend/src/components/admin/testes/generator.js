const names = [
  "Jose",
  "Felipe",
  "Pereira",
  "Amanda",
  "Armino",
  "Yanina",
  "Dante",
  "Jónatan",
  "ErhanFaithe",
  "Krastyu",
  "Iulian",
  "BerryKristen",
  "Tiw",
  "İlhan",
  "MariannaGeordie",
  "Dolors",
  "Valkyrie",
  "LilyaZlatko",
  "Eliana",
  "Tàmhas",
  "Şehrazat",
];

const getRandom = (range) => {
  return Math.floor(Math.random() * (range - 1));
};
const getRandomNumber = (digitos) => {
  let res = "";
  for (let i = 0; i < digitos; i++) {
    res = res + Math.floor(Math.random() * 9);
  }

  return res;
};

const generateName = () => {
  return `${names[getRandom(names.length)]} ${names[getRandom(names.length)]} ${
    names[getRandom(names.length)]
  }`;
};

const generateCpf = () => {
  return `${getRandomNumber(3)}.${getRandomNumber(3)}.${getRandomNumber(
    3
  )}-${getRandomNumber(2)}`;
};

const generateEmail = () => {
  const email = ["@outlook.com", "@hotmail.com", "@bol.com", "@aperture.com"];
  return `${names[getRandom(names.length)].toLowerCase()}.${names[
    getRandom(names.length)
  ].toLowerCase()}${email[getRandom(email.length)]}`;
};

const generateCartaoSus = () => {
  return `${getRandomNumber(3)} ${getRandomNumber(4)} ${getRandomNumber(
    4
  )} ${getRandomNumber(4)}`;
};

const generateEndereco = () => {
  const tipo = ["Rua", "Avenida", "Travessa", "Condomínio"];
  const nomes = [
    "7 de setembro",
    "Brasil",
    "Graciliano Ramos",
    "do Macaco",
    "Saco Sujo",
  ];
  const bairros = ["Centro", "Sítio", "Comércio", "Serraria"];
  return `${tipo[getRandom(tipo.length)]} ${
    nomes[getRandom(nomes.length)]
  }, nº${getRandom(999)}, ${bairros[getRandom(bairros.length)]}`;
};

module.exports.generateCartaoSus = generateCartaoSus;
module.exports.generateCpf = generateCpf;
module.exports.generateName = generateName;
module.exports.generateEmail = generateEmail;
module.exports.generateEndereco = generateEndereco;

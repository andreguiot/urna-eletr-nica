// Arquivo de dados mestre da eleição

// 1. Define as duas chapas que concorrem na eleição.
const chapasData = {
    "10": {
        nome: "CHAPA AMARELA",
        numero: "10",
        foto: "images/chapa_amarela.png", // Podemos manter a foto, não vai atrapalhar
        cor: '#FFC107' // Cor Amarela (Material Design Amber)
    },
    "20": {
        nome: "CHAPA AZUL",
        numero: "20",
        foto: "images/chapa_azul.png",
        cor: '#0D47A1' // Cor Azul (Material Design Blue 900)
    }
};

// 2. Define a lista de todas as turmas válidas para a votação.
// Adicione ou remova turmas conforme necessário.
const turmasValidas = [
    '181', '182', '183', '184','185', '186', 
    '191', '192', '193', '194', '195', '196',
    '211', '212', '213', '214', '215', '216', 
    '221', '222', '223', '224',
    '231', '232', '233', '234', '235'
];

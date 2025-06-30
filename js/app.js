// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cria a instância principal da aplicação.
    const urna = new Urna(candidatosData);
    
    // 2. Cria a instância da View.
    const view = new UrnaView();
    
    // 3. Conecta tudo no Controller.
    new UrnaController(urna, view);

    console.log('Aplicação Urna Eletrônica (POO) iniciada!');
});

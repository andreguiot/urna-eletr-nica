# 🗳️ Urna Eletrônica - Eleição do Grêmio Estudantil  
**Colégio La Salle Abel**

![Status](https://img.shields.io/badge/status-finalizado-green)
![Versão](https://img.shields.io/badge/versão-2.0%20(Chapas)-blue)

<p align="center">
  <img src="URL_DA_SUA_IMAGEM_AQUI" alt="Demonstração da Urna Eletrônica" width="700"/>
</p>

---

## 📖 Descrição

Este projeto é uma **simulação de Urna Eletrônica** desenvolvida com **JavaScript puro**, **HTML** e **CSS**, criada especialmente para a eleição do Grêmio Estudantil do Colégio La Salle Abel.

A aplicação permite que os alunos votem em chapas concorrentes, com contagem automática dos votos, salvamento local e possibilidade de exportar os resultados em **PDF**.

---

## ✨ Funcionalidades

- ✅ Autenticação por turma (código da turma).
- 🧾 Votação em chapas com número, nome e cor.
- ✳️ Opções: Votar, Corrigir ou Branco.
- 💾 Persistência de votos via `localStorage`.
- ☁️ Sincronização com Google Sheets (opcional).
- 📄 Geração de relatório final em **PDF** (por turma e geral).

---

## 🚀 Tecnologias Utilizadas

- ⚙️ **HTML5**
- 🎨 **CSS3**
- 💡 **JavaScript (Vanilla JS)**
- 🖨️ **[html2pdf.js](https://github.com/eKoopmans/html2pdf)** — para exportação dos relatórios

---

## ⚙️ Como Executar o Projeto

### 🔧 Pré-requisitos

- Ter o [Git](https://git-scm.com/) instalado.
- Usar um navegador moderno (Chrome, Firefox, Edge etc).

### ▶️ Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/andreguiot/urna-eletr-nica.git
   ```

2. **Acesse o diretório:**
   ```bash
   cd urna-eletr-nica
   ```

3. **(Opcional) Configure a sincronização com Google Sheets:**
   - Copie `js/config.example.js` para `js/config.js`:
     ```bash
     cp js/config.example.js js/config.js
     ```
   - Insira a URL do seu Google Apps Script no novo `config.js`.

4. **Execute a aplicação:**
   - 🧪 Método Simples: Abra `index.html` no navegador.
   - 🔥 Método Recomendado: Use o **Live Server** no VS Code:
     - Clique com o botão direito em `index.html` → “Open with Live Server”.

---

## 📁 Estrutura de Pastas

```
urna-eletr-nica/
├── images/               # Imagens do layout e das chapas
├── js/                   # Lógica da aplicação
│   ├── app.js            # Inicializa a aplicação
│   ├── config.js         # (Local) Configuração da API
│   ├── config.example.js # Exemplo da configuração
│   ├── controller.js     # Manipula eventos e interações
│   ├── data.js           # Dados de chapas e turmas
│   ├── model.js          # Lógica de negócios
│   ├── urna.js           # Máquina de estados da urna
│   └── view.js           # Renderização da interface
├── styles/               # Estilos CSS
│   └── main.css
├── .gitignore            # Arquivos ignorados pelo Git
├── index.html            # Entrada principal do projeto
└── README.md             # Documentação do projeto
```

---

## 👨‍💻 Autor

**André Guiot**

- GitHub: [@andreguiot](https://github.com/andreguiot)

---

## 📌 Licença

Este projeto é de uso educacional e interno. Consulte o autor para permissões adicionais.

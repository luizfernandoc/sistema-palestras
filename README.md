Este é um sistema para gerenciar palestras, com um backend em Node.js e um frontend em React.

## Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Um banco de dados MySQL

## Configuração

### Backend

1. Navegue até a pasta `backend`:
   ```bash
   cd backend

2. Instale as dependências:
    npm install
    npm install express mysql2 dotenv cors
    

3. Crie um arquivo .env na pasta backend com as seguintes variáveis:
    DB_HOST=u_host
   
    DB_USER=seu_usuario

    DB_PASSWORD=sua_senha

    DB_NAME=nome_do_banco

    PORT=5000

5. Inicie o servidor:
    npm start
    O backend estará disponível em http://localhost:5000.

### Frontend
1. Navegue até a pasta `frontend`:
   cd frontend

2. Instale as dependências:
    npm install 
    npm install -D tailwindcss postcss autoprefixer
    npm install css-loader postcss-loader source-map-loader --save-dev

3. Inicie o servidor de desenvolvimento:
    npm start
    O frontend estará disponível em http://localhost:3000.

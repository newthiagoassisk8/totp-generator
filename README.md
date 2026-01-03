# Gerador TOTP

Um aplicativo web moderno e responsivo para gerar senhas de uso único baseadas em tempo (TOTP), construído com React e TypeScript.

## Backend Relacionado

Este frontend possui uma API de backend dedicada disponível em: https://github.com/newthiagoassisk8/totp-service/

## Origem do Projeto

Este repositório de frontend é um fork do projeto original em https://github.com/Rani-Wehbe/totp-generator. O backend é um projeto novo e independente criado por `newthiagoassisk8`.

## Referência em Vídeo

Como funciona o TOP na prática | Projeto técnico: https://youtu.be/KkZsXKPP1R0

## Recursos

- **Geração de TOTP em tempo real**: gera códigos TOTP que são atualizados automaticamente
- **Parâmetros configuráveis**:
    - Chave secreta (codificada em Base32)
    - Número de dígitos (6 ou 8)
    - Período de tempo (30 ou 60 segundos)
    - Algoritmo de hash (SHA1, SHA256, SHA512)
- **Design responsivo**: funciona perfeitamente em desktop, tablet e dispositivos móveis
- **UI moderna**: interface limpa e intuitiva com animações suaves
- **TypeScript**: tipagem estática completa e melhor experiência de desenvolvimento

## Stack de Tecnologia

- **Frontend**: React 19 com TypeScript
- **Ferramenta de build**: Vite
- **Biblioteca TOTP**: otplib
- **Estilização**: CSS3 com recursos modernos e design responsivo

## Primeiros Passos

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd totp-generator
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra o navegador e acesse `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos gerados estarão no diretório `dist`.

## Uso

1. **Informe a chave secreta**: insira sua chave secreta codificada em Base32 no formulário de configuração
2. **Configure os parâmetros**: selecione o número de dígitos, o período de tempo e o algoritmo desejados
3. **Gere o TOTP**: o aplicativo gerará e exibirá automaticamente os códigos TOTP
4. **Atualização automática**: os códigos são atualizados automaticamente conforme o período selecionado

## Estrutura do Projeto

```
src/
├── components/
│   └── TOTPGenerator/
│       ├── TOTPGenerator.tsx      # Componente principal
│       ├── TOTPForm.tsx          # Formulário de configuração
│       ├── TOTPDisplay.tsx       # Exibição do TOTP e temporizador
│       ├── TOTPGenerator.css     # Estilos principais
│       ├── TOTPForm.css          # Estilos do formulário
│       └── TOTPDisplay.css       # Estilos da exibição
├── types/
│   └── TOTPTypes.ts              # Interfaces TypeScript
├── utils/
│   └── totpUtils.ts              # Utilitários de geração de TOTP
├── App.tsx                       # Componente principal do app
├── main.tsx                      # Ponto de entrada
└── index.css                     # Estilos globais
```

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch de feature
3. Faça suas alterações
4. Adicione testes, se aplicável
5. Envie um pull request

## Licença

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

## Nota de Segurança

Este aplicativo gera códigos TOTP localmente no seu navegador. Suas chaves secretas nunca são enviadas para servidores externos. No entanto, sempre use em um dispositivo e rede seguros e confiáveis.

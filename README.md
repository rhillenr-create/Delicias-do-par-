
# 🍧 Açaí Delícias do Pará - Sistema de Gestão de Caixa

Este é o seu sistema de frente de caixa (PDV) completo e inteligente. Ele salva seus dados permanentemente na nuvem para que você nunca perca seu histórico de vendas.

## 🚀 Como Colocar no Ar (O Jeito Certo para Next.js)

Se você recebeu o erro **"Executable files are forbidden on the Spark billing plan"**, siga estas instruções:

### 1. NÃO USE O COMANDO `firebase deploy` no terminal
O comando tradicional de deploy não funciona bem com Next.js no plano gratuito porque ele tenta subir arquivos que o Firebase considera "perigosos".

### 2. USE O FIREBASE APP HOSTING (Recomendado)
1. Acesse o [Console do Firebase](https://console.firebase.google.com/project/nextn-f5a13).
2. No menu lateral, clique em **Build** > **App Hosting**.
3. Clique em **Get Started**.
4. Conecte sua conta do **GitHub** e selecione o repositório deste projeto.
5. O Firebase cuidará de tudo! Ele vai construir seu site nos servidores da Google e gerar o link `https://nextn-f5a13.web.app` automaticamente, sem erros de permissão.

---

## 🛠️ Configurações Obrigatórias

Antes de vender, você precisa ativar estes dois serviços no console:

### 1. Banco de Dados (Firestore)
1. Vá em **Build** > **Firestore Database**.
2. Clique em **Create database** > **Next** > **Enable**.
3. Na aba **Rules**, garanta que o acesso esteja liberado:
   ```javascript
   allow read, write: if request.auth != null;
   ```

### 2. Login Anônimo (Authentication)
1. Vá em **Build** > **Authentication**.
2. Clique em **Get Started**.
3. Em **Sign-in method**, clique em **Add new provider** > **Anonymous** > **Enable** > **Save**.

---

## ✨ Funcionalidades

- **Caixa Inteligente:** Registre PIX, Cartão, Dinheiro e Delivery.
- **Identidade Visual:** Em "Ajustes", suba seu logo para aparecer nos recibos.
- **Relatórios:** Gere PDFs profissionais para impressão.
- **IA Financeira:** Sugestões automáticas de economia nas suas despesas.

*ID do Projeto: nextn-f5a13*

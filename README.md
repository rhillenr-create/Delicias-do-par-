
# 🍧 Açaí Delícias do Pará - Sistema de Gestão de Caixa

Este é o seu sistema de frente de caixa (PDV) completo e inteligente. Ele salva seus dados permanentemente na nuvem para que você nunca perca seu histórico de vendas.

## 💰 Posso usar de graça?
**SIM!** Este projeto foi feito para rodar no plano **Spark (Gratuito)** do Firebase. Você não precisa cadastrar cartão de crédito para as funções básicas de uma açaíteria.

---

## 🚀 Como Hospedar Grátis (Sem Erro de "Executable Files")

Se você recebeu o erro **"Executable files are forbidden on the Spark billing plan"**, é porque tentou usar o comando `firebase deploy`. **Não use esse comando para Next.js no plano grátis.**

### O Jeito Certo (Firebase App Hosting):
1. Acesse o [Console do Firebase](https://console.firebase.google.com/project/nextn-f5a13).
2. No menu lateral, clique em **Build** > **App Hosting**.
3. Clique em **Get Started**.
4. Conecte sua conta do **GitHub** e selecione o repositório deste projeto.
5. O Firebase vai criar seu site automaticamente e gerar o link `https://nextn-f5a13.web.app`.
6. **Por que isso funciona?** Porque o App Hosting constrói o sistema nos servidores do Google, respeitando as regras do plano gratuito.

---

## 🛠️ Configurações Obrigatórias no Console

Antes de começar a vender, você precisa ativar estes dois serviços para que o botão "Salvar" funcione:

### 1. Banco de Dados (Firestore)
1. Vá em **Build** > **Firestore Database**.
2. Clique em **Create database** > Escolha o local mais próximo > **Enable**.
3. Na aba **Rules (Regras)**, publique isto para liberar o acesso:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### 2. Login Anônimo (Authentication)
1. Vá em **Build** > **Authentication**.
2. Clique em **Get Started**.
3. Em **Sign-in method**, clique em **Add new provider** > **Anonymous** > **Enable** > **Save**.

---

## ✨ Funcionalidades
- **Caixa Inteligente:** Registre PIX, Cartão, Dinheiro e Delivery.
- **Relatórios:** Gere PDFs profissionais para impressão.
- **IA Financeira:** Sugestões automáticas de economia nas suas despesas.

*ID do Projeto: nextn-f5a13*


# 🍧 ACAITERIA DELICIAS DO PARÁ - Gestão de Caixa Inteligente

Este é o seu sistema de frente de caixa (PDV) completo, otimizado para ser hospedado na **Vercel** e versionado no **GitHub**.

## 🛑 OS DADOS SUMIRAM? (COMO RESOLVER EM 1 MINUTO)

Se você atualiza a página e os dados desaparecem, é porque o Google está bloqueando a gravação. Siga estes 3 passos obrigatórios no seu [Console do Firebase](https://console.firebase.google.com/):

### 1. Criar o Banco de Dados (Firestore)
No menu lateral do console, vá em **Firestore Database** e clique no botão **Create Database**. 
- Escolha um servidor (ex: `southamerica-east1` para o Brasil).
- Selecione **"Start in Test Mode"** (ou apenas crie o banco). 
- **Sem clicar nesse botão "Create Database", o sistema não tem onde salvar!**

### 2. Publicar as Regras de Acesso (Rules)
Na aba **Rules** do Firestore, substitua TUDO o que estiver lá por este código exatamente:
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
**NÃO ESQUEÇA DE CLICAR EM "PUBLISH"!**

### 3. Ativar Autenticação Anônima
No menu **Authentication** > aba **Sign-in method** > clique em **Add new provider** > selecione **Anonymous** e mude para **Enabled** (Ativado). Clique em **Save**.

---

## 📤 Como subir para o GitHub

1. **Crie um Repositório**: Vá ao seu [GitHub](https://github.com) e crie um novo repositório (ex: `caixa-acaiteria`).
2. **Abra o Terminal**: Na pasta do seu projeto, execute:
```bash
git init
git add .
git commit -m "Versão Inicial - ACAITERIA DELICIAS DO PARÁ"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

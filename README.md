
# 🍧 ACAITERIA DELICIAS DO PARÁ - Gestão de Caixa Inteligente

Este é o seu sistema de frente de caixa (PDV) completo, otimizado para o Google Firebase.

## 🛑 DADOS SUMINDO? (RESOLVA EM 1 MINUTO)

Se você atualiza a página e os dados somem, é porque o Google está bloqueando a gravação definitiva. Siga estes 3 passos no seu [Console do Firebase](https://console.firebase.google.com/):

### 1. Criar o Banco de Dados (Firestore)
No menu lateral, vá em **Firestore Database** e clique em **Create Database**. 
- Escolha o local (ex: `southamerica-east1`).
- Selecione **"Start in Test Mode"**. 
- **Sem clicar no botão "Create Database", o sistema não tem onde salvar!**

### 2. Publicar as Regras (Rules)
Na aba **Rules** do Firestore, cole este código e clique em **PUBLISH**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Ativar Autenticação Anônima
Em **Authentication** > **Sign-in method** > **Add new provider** > **Anonymous** > **Enabled** (Ativado).

---

## 📤 Como subir para o GitHub
1. Crie um repositório no GitHub.
2. No seu terminal, execute:
```bash
git init
git add .
git commit -m "Versão Final - persistência corrigida"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

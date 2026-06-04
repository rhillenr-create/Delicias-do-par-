
# 🍧 ACAITERIA DELICIAS DO PARÁ - Gestão de Caixa Inteligente

Este é o seu sistema de frente de caixa (PDV) completo, otimizado para ser hospedado na **Vercel** e versionado no **GitHub**.

## 📤 Como subir para o GitHub

Siga estes passos para salvar seu código na nuvem:

1. **Crie um Repositório**: Vá ao seu [GitHub](https://github.com) e crie um novo repositório (ex: `caixa-acaiteria`).
2. **Abra o Terminal**: Na pasta do seu projeto, execute os seguintes comandos:

```bash
# Iniciar o rastreamento do Git
git init

# Adicionar todos os arquivos
git add .

# Criar a primeira versão (salvamento local)
git commit -m "Versão Inicial - ACAITERIA DELICIAS DO PARÁ"

# Criar o link com o seu GitHub
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Enviar os arquivos para a nuvem
git push -u origin main
```

---

## 🚀 Como resolver o problema de "Perda de Dados" (Firestore Rules)

Se ao atualizar a página os dados somem, é porque o Firebase está bloqueando a gravação. Siga exatamente estes passos:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. No menu lateral, clique em **Firestore Database**.
3. Vá na aba **Rules** (Regras).
4. Substitua TODO o conteúdo que estiver lá por este código:
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
5. Clique em **Publish** (Publicar).
6. **Importante**: No menu **Authentication**, certifique-se que o método **Anônimo** está "Ativado".

---

## 🛠️ Funcionalidades
- **Frente de Caixa:** Registro rápido de PIX, Cartões, Dinheiro e Delivery.
- **Relatórios:** Gere PDFs profissionais para conferência ou impressão.
- **Dashboard:** Gráficos de vendas e lucro em tempo real.
- **Status de Conexão:** Indicador visual de **ONLINE/OFFLINE** em tempo real.

*ID do Projeto Firebase: nextn-f5a13*

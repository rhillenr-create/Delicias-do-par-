
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

# Criar o link com o seu GitHub (Substitua pelo link que o GitHub te deu)
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Enviar os arquivos para a nuvem
git push -u origin main
```

---

## 🚀 Como colocar no ar (Vercel)

Após subir para o GitHub, siga estes passos para ter o seu link oficial (ex: `sua-acaiteria.vercel.app`):

1. **Conecte à Vercel**: 
   - Crie uma conta em [vercel.com](https://vercel.com).
   - Clique em "Add New" > "Project".
   - Importe o repositório que você acabou de criar no GitHub.
   - A Vercel detectará automaticamente que é um projeto **Next.js**. Clique em **Deploy**.

2. **Configuração no Firebase (Obrigatório)**:
   - No Console do Firebase, ative a **Authentication** com o provedor **Anônimo** (Anonymous).
   - Crie o banco **Firestore Database** em **Modo de Produção**.
   - Na aba **Rules** do Firestore, publique estas regras:
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

---

## 🛠️ Funcionalidades
- **Frente de Caixa:** Registro rápido de PIX, Cartões, Dinheiro e Delivery.
- **Relatórios:** Gere PDFs profissionais para conferência ou impressão.
- **Dashboard:** Gráficos de vendas e lucro em tempo real.
- **Status de Conexão:** Indicador visual de **ONLINE/OFFLINE** em tempo real.

*ID do Projeto Firebase: nextn-f5a13*

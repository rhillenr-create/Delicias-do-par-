
# 🍧 Açaí Delícias do Pará - Gestão de Caixa Inteligente

Este é o seu sistema de frente de caixa (PDV) completo, desenvolvido para ser simples, rápido e moderno.

## 🚀 Como colocar no ar (Link Permanente Grátis)

Para ter o seu link oficial (ex: `sua-acaiteria.web.app`), siga estes passos no Console do Firebase:

### 1. Preparação (Obrigatório)
Antes de tudo, ative estes dois serviços no menu **Build**:
- **Authentication**: Vá em *Sign-in method* > *Add new provider* > **Anonymous** > Ative e Salve. (Isso permite salvar as vendas com segurança).
- **Firestore Database**: Clique em *Create database* > Escolha o local (ex: southamerica-east1) > Inicie em **Modo de Produção**. 
  - Na aba **Rules**, publique estas regras:
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

### 2. Hospedagem (Onde seu site vai morar)
**NÃO use o comando `firebase deploy` no terminal.** No plano gratuito, o Next.js dá erro de "Executable files".
**O JEITO CERTO:**
1. Vá em **Build** > **App Hosting**.
2. Clique em **Get Started**.
3. Conecte seu **GitHub** e selecione a pasta deste projeto.
4. O Firebase cuidará de tudo e gerará o seu link automático e gratuito.

---

## 🛠️ Funcionalidades
- **Frente de Caixa:** Registro rápido de PIX, Cartões, Dinheiro e Delivery.
- **Relatórios:** Gere PDFs profissionais para conferência ou impressão.
- **Dashboard:** Gráficos de vendas e lucro em tempo real.
- **IA Financeira:** Categorização automática e sugestões de economia.

## 📁 Como baixar os arquivos
Se você está vendo isso no Firebase Studio, clique no ícone de exportação/download para baixar o código `.zip` completo para o seu computador.

*ID do Projeto: nextn-f5a13*

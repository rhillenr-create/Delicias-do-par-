
# 🍧 Açaí Delícias do Pará - Gestão de Caixa Inteligente

Este é o seu sistema de frente de caixa (PDV) completo, otimizado para ser hospedado na **Vercel**.

## 🚀 Como colocar no ar (Vercel)

Siga estes passos para ter o seu link oficial (ex: `sua-acaiteria.vercel.app`):

### 1. Preparação no Firebase (Obrigatório)
Mesmo usando a Vercel para o site, os dados ficam no Firebase. Ative estes dois serviços no Console do Firebase:
- **Authentication**: Ative o provedor **Anônimo** (Anonymous).
- **Firestore Database**: Crie o banco em **Modo de Produção**.
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

### 2. Hospedagem na Vercel
1. Crie uma conta em [vercel.com](https://vercel.com).
2. Conecte seu **GitHub** (após subir o código para lá) ou use a **Vercel CLI** para fazer o upload da pasta.
3. A Vercel detectará automaticamente que é um projeto **Next.js** e fará o deploy em segundos.
4. **Dica:** Se você quiser proteger suas chaves, mova os dados de `src/firebase/config.ts` para as *Environment Variables* no painel da Vercel.

---

## 🛠️ Funcionalidades
- **Frente de Caixa:** Registro rápido de PIX, Cartões, Dinheiro e Delivery.
- **Relatórios:** Gere PDFs profissionais para conferência ou impressão.
- **Dashboard:** Gráficos de vendas e lucro em tempo real.
- **IA Financeira:** Insights automáticos sobre suas despesas.

## 📁 Como baixar os arquivos
Clique no ícone de **Download** ou **Export** no menu superior do Firebase Studio para baixar o código `.zip` completo e subir para a Vercel.

*ID do Projeto Firebase: nextn-f5a13*

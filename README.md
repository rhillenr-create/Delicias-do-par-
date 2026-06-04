
# 🍧 ACAITERIA DELICIAS DO PARÁ - Gestão de Caixa Inteligente

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
2. Conecte seu **GitHub** (após subir o código para lá) ou use a **Vercel CLI**.
3. A Vercel detectará automaticamente que é um projeto **Next.js**.

---

## ❓ Perguntas Frequentes

### Se eu mudar as cores ou botões, perco minhas vendas?
**Não!** Seus dados (vendas, despesas e lucros) estão salvos no banco de dados do Firebase. Mudar o visual do aplicativo (o código) é como trocar a decoração da sua loja; o dinheiro que está no cofre (banco de dados) continua lá guardado e seguro.

### As mudanças visuais são automáticas?
- **No Código**: Se a IA fizer uma mudança visual (mudar uma cor ou ícone), você precisa baixar o código novo e atualizar na Vercel. 
- **Nas Vendas**: Sim! Todas as vendas que você registra no dia a dia aparecem instantaneamente em todos os seus aparelhos, pois o Firebase sincroniza tudo em tempo real.

### Preciso pagar algo?
Não. Tanto a Vercel quanto o Firebase possuem planos gratuitos que atendem perfeitamente uma açaíteria em crescimento.

---

## 🛠️ Funcionalidades
- **Frente de Caixa:** Registro rápido de PIX, Cartões, Dinheiro e Delivery.
- **Relatórios:** Gere PDFs profissionais para conferência ou impressão.
- **Dashboard:** Gráficos de vendas e lucro em tempo real.
- **IA Financeira:** Insights automáticos sobre suas despesas.

*ID do Projeto Firebase: nextn-f5a13*

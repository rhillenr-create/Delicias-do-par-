
# 🍧 Açaí Delícias do Pará - Sistema de Gestão de Caixa

Este é o seu sistema de frente de caixa (PDV) completo e inteligente. Ele salva seus dados permanentemente na nuvem para que você nunca perca seu histórico de vendas.

## 🚀 Como Colocar no Ar (Link Permanente)

Siga estes 3 passos no [Console do Firebase](https://console.firebase.google.com/project/nextn-f5a13):

### 1. Ativar o Banco de Dados (Obrigatório)
1. No menu lateral, clique em **Build** > **Firestore Database**.
2. Clique em **Create database**.
3. Escolha a localização padrão e selecione **"Start in production mode"**.
4. Clique em **Enable**.
5. **DICA:** Vá na aba "Rules" (Regras) e verifique se as regras permitem escrita. Para teste rápido, você pode usar:
   ```javascript
   allow read, write: if request.auth != null;
   ```

### 2. Ativar o Login (Obrigatório para Salvar Vendas)
1. Vá em **Build** > **Authentication**.
2. Clique em **Get Started**.
3. Na aba **Sign-in method**, clique em **Add new provider**.
4. Selecione **Anonymous** e ative a chave (**Enable**). Clique em Save.
   *Isso permite que o sistema identifique seu caixa com segurança sem pedir senha toda hora.*

### 3. Criar o Link Permanente (Hospedagem)
1. Vá em **Build** > **App Hosting**. (Esta é a melhor opção para Next.js).
2. Clique em **Get Started**.
3. Se você tiver o código no **GitHub**, basta conectar o repositório. O Firebase fará tudo sozinho!
4. Caso prefira o modo tradicional, você pode usar o comando `firebase deploy` no seu computador após instalar o Firebase CLI.

---

## ✨ Funcionalidades do Sistema

- **Caixa Inteligente:** Registre PIX, Cartão, Dinheiro e Delivery com um toque.
- **Relatórios:** Clique em "Imprimir" em qualquer tela para gerar um relatório em papel ou PDF pronto para contabilidade.
- **Identidade Visual:** Em "Ajustes", você pode mudar o nome da sua loja e subir seu logotipo. Eles aparecerão em todos os recibos.
- **IA Financeira:** O sistema analisa suas despesas e dá dicas de como economizar no seu negócio de açaí.

## 📱 Dica para o Balcão
Abra o link `https://nextn-f5a13.web.app` no seu celular, clique nos três pontinhos do navegador e escolha **"Adicionar à tela inicial"**. O sistema funcionará como um aplicativo instalado no seu celular!

---
*ID do Projeto: nextn-f5a13*
*Desenvolvido para o sucesso da Açaí Delícias do Pará.*


# 🍧 ACAITERIA DELICIAS DO PARÁ - Gestão de Caixa Inteligente

Este é o seu sistema de frente de caixa (PDV) completo, otimizado para o Google Firebase.

## 🛑 TRANSIÇÃO PARA PRODUÇÃO (DADOS NÃO EXPIRAREM)

O "Modo de Teste" do Firebase expira após 30 dias. Para manter seu sistema funcionando para sempre de forma segura, siga estes passos:

### 1. Configurar Regras de Produção
No seu [Console do Firebase](https://console.firebase.google.com/), vá em **Firestore Database** > aba **Rules** e substitua todo o código por este:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita apenas se o usuário estiver autenticado
    // Como o app usa Login Anônimo, isso garante que apenas o seu app acesse os dados.
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Clique em **PUBLISH** (Publicar).

### 2. Verificar Autenticação
Certifique-se de que o provedor **Anonymous** (Anônimo) está ativado em **Authentication** > **Sign-in method**. Sem isso, o sistema não conseguirá "logar" para salvar os dados com as novas regras.

---

## 🚀 Funcionalidades do Sistema
- **Registro de Vendas**: PIX, Cartões, Dinheiro e Delivery.
- **Gestão de Saídas**: Sangrias e Despesas com categorização por IA.
- **Dashboard**: Gráficos em tempo real de faturamento e lucro líquido.
- **Relatórios**: Geração de relatórios formatados para impressão.
- **Offline First**: Funciona mesmo com instabilidade na internet e sincroniza ao voltar.

## 📤 Como subir para o GitHub
1. Crie um repositório no GitHub.
2. No seu terminal, execute:
```bash
git init
git add .
git commit -m "Versão Final - Regras de Produção"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

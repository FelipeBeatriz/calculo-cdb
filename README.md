# Simulador CDB Multi-Fases

Um simulador de investimentos em CDB desenvolvido em **React + TypeScript**, que permite calcular o rendimento acumulado considerando múltiplas fases de aportes e um período adicional após o fim das fases.

## Funcionalidades

- Adicionar múltiplas fases de aportes mensais.
- Definir duração de cada fase em meses.
- Definir meses adicionais após os aportes para calcular juros compostos.
- Visualizar:
  - Total investido
  - Rendimento total
  - Total final
  - Rendimento mensal considerando o saldo final (após aportes e meses extras)
- Layout dark mode inspirado no GitHub, responsivo e minimalista.

## Tecnologias

- [React](https://reactjs.org/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Tailwwind](https://tailwindcss.com/)

## Como acessar:
Acesse o domínio vercel abaixo e experimente:
- [https://calculo-cdb-one.vercel.app/](https://calculo-cdb-one.vercel.app/)

## Como funciona
- Cada fase permite definir um aporte mensal e duração em meses.
- Após todas as fases, você pode definir meses extras para calcular o crescimento do saldo acumulado via juros compostos.
- O rendimento mensal atualizado mostra quanto o saldo renderia no próximo mês considerando o total acumulado.

## Estrutura do projeto
- App.tsx — componente principal com lógica de simulação e UI.
- Fase — tipo TypeScript para representar cada fase de aporte.
- Estado gerenciado com useState para fases, aportes e meses extras.

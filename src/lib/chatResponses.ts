// Predefined chatbot responses for EV Trip Assistant

export interface ChatResponse {
  keywords: string[];
  response: string;
}

export const chatResponses: ChatResponse[] = [
  {
    keywords: ['autonomia', 'range', 'alcance', 'bateria durar'],
    response: `A autonomia do seu EV depende de vários fatores:

**Fatores que afetam a autonomia:**
- 🌡️ Temperatura ambiente (frio reduz até 30%)
- 🚗 Velocidade (acima de 100km/h consome mais)
- ⛰️ Terreno (subidas consomem mais energia)
- 🌬️ Uso do ar-condicionado/aquecedor

**Dica:** Mantenha a velocidade entre 80-100km/h para melhor eficiência!`
  },
  {
    keywords: ['carregar', 'carregamento', 'recarregar', 'tempo de carga'],
    response: `**Tipos de Carregamento:**

⚡ **Carregador Rápido (DC Fast):** 20-40 min para 80%
🔌 **Carregador Semi-Rápido (AC):** 2-4 horas
🏠 **Tomada Residencial:** 8-12 horas

**Recomendação:** Para viagens, use carregadores rápidos e carregue até 80% para otimizar tempo e saúde da bateria.`
  },
  {
    keywords: ['custo', 'preço', 'gastar', 'economia', 'quanto custa'],
    response: `**Custo médio de carregamento:**

💰 Residencial: R$ 0,40-0,60/kWh
⚡ Eletroposto: R$ 0,80-1,50/kWh
🆓 Alguns shoppings oferecem carga gratuita!

**Comparativo:** Um EV gasta em média R$ 0,10/km, enquanto um carro a gasolina gasta R$ 0,50-0,80/km.`
  },
  {
    keywords: ['melhor', 'recomenda', 'sugestão', 'qual ev', 'comprar'],
    response: `**Top EVs custo-benefício 2024:**

1. 🐬 **BYD Dolphin** - Melhor entrada (R$ 150k)
2. ⚡ **Tesla Model 3** - Melhor tecnologia
3. 🍃 **Nissan Leaf** - Mais vendido mundialmente
4. 🎯 **Hyundai Ioniq 5** - Melhor design

Qual é sua prioridade: autonomia, preço ou tecnologia?`
  },
  {
    keywords: ['eletroposto', 'estação', 'onde carregar', 'ponto de carga'],
    response: `**Redes de Eletropostos no Brasil:**

📍 **Tupinambá** - Maior rede nacional
📍 **Shell Recharge** - Em postos Shell
📍 **Volvo** - Rodovias principais
📍 **Tesla Supercharger** - Exclusivo Tesla

**Apps úteis:** PlugShare, Tupinambá, Shell Recharge para encontrar pontos próximos.`
  },
  {
    keywords: ['viagem', 'viajar', 'rota', 'estrada'],
    response: `**Dicas para viagens de EV:**

✅ Planeje paradas a cada 200-250km
✅ Verifique eletropostos no caminho
✅ Carregue até 90% antes de partir
✅ Evite chegar com menos de 10%
✅ Leve cabo de emergência (tomada comum)

Use nosso planejador à esquerda para calcular sua rota! ⚡`
  },
  {
    keywords: ['bateria', 'degradação', 'vida útil', 'durabilidade'],
    response: `**Saúde da Bateria:**

🔋 Vida útil média: 8-15 anos ou 500.000km
📉 Degradação típica: 2-3% ao ano

**Para maximizar a vida útil:**
- Evite carregar 100% regularmente
- Prefira cargas entre 20-80%
- Evite calor extremo
- Use carregador lento quando possível`
  },
  {
    keywords: ['olá', 'oi', 'ola', 'hey', 'eai', 'bom dia', 'boa tarde', 'boa noite'],
    response: `Olá! 👋 Sou seu assistente especialista em veículos elétricos!

Posso ajudar com:
- 🗺️ Planejamento de viagens
- 🔋 Dicas de carregamento
- 💰 Custos e economia
- 🚗 Comparação de modelos
- ⚡ Eficiência energética

Como posso ajudar hoje?`
  },
  {
    keywords: ['ajuda', 'help', 'o que você faz', 'comandos'],
    response: `**Sou seu assistente EV! Pergunte sobre:**

🔋 Autonomia e bateria
⚡ Carregamento e tempo
💰 Custos e economia
🗺️ Planejamento de rotas
🚗 Modelos de veículos
📍 Eletropostos

Basta digitar sua pergunta naturalmente!`
  },
];

// Default response when no match is found
export const defaultResponse = `Interessante pergunta! 🤔

Posso ajudar melhor com temas como:
- Autonomia e bateria
- Carregamento e custos
- Planejamento de viagens
- Comparação de veículos

Pode reformular sua pergunta ou escolher um desses temas?`;

// Find best matching response
export const findResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const item of chatResponses) {
    const hasMatch = item.keywords.some(keyword => 
      lowerMessage.includes(keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    );
    if (hasMatch) {
      return item.response;
    }
  }
  
  return defaultResponse;
};

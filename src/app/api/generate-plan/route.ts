import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { age, level, goal } = await req.json();

    const prompt = `Você é um personal trainer e nutricionista especializado. Crie um plano COMPLETO e DETALHADO de treino e dieta personalizado.

INFORMAÇÕES DO USUÁRIO:
- Idade: ${age} anos
- Nível: ${level}
- Objetivo: ${goal}

INSTRUÇÕES CRÍTICAS:
1. Seja EXTREMAMENTE específico e detalhado
2. Use linguagem simples e direta, sem termos técnicos
3. Priorize SEGURANÇA acima de tudo
4. Progressão deve ser GRADUAL e sustentável
5. Explique COMO FAZER cada exercício de forma clara

RETORNE UM JSON com esta estrutura EXATA:

{
  "workout": {
    "title": "Nome do Plano de Treino",
    "description": "Descrição curta do plano (1 frase)",
    "exercises": [
      {
        "name": "Nome do Exercício",
        "sets": "3-4",
        "reps": "10-12",
        "rest": "60s",
        "execution": "Explicação DETALHADA de como fazer o exercício, incluindo posição inicial, movimento e dicas de segurança"
      }
    ],
    "metrics": {
      "frequency": "3-4x por semana",
      "duration": "45-60 min",
      "progression": "Aumente 2-5kg a cada 2 semanas"
    },
    "tips": [
      "Dica prática 1",
      "Dica prática 2",
      "Dica prática 3"
    ]
  },
  "diet": {
    "title": "Plano Alimentar",
    "description": "Descrição do plano alimentar (1 frase)",
    "dailyCalories": "2000-2200 calorias",
    "meals": [
      {
        "name": "Café da Manhã",
        "time": "7h-8h",
        "foods": [
          "Alimento 1 com quantidade",
          "Alimento 2 com quantidade"
        ]
      }
    ],
    "tips": [
      "Dica de alimentação 1",
      "Dica de alimentação 2"
    ]
  }
}

REGRAS ESPECÍFICAS POR NÍVEL:

INICIANTE:
- 6-8 exercícios básicos (agachamento, flexão, prancha, etc)
- 2-3 séries de 10-15 repetições
- Foco em aprender movimento correto
- Treino 3x por semana
- Descanso de 60-90s

INTERMEDIÁRIO:
- 8-10 exercícios variados
- 3-4 séries de 8-12 repetições
- Pode incluir pesos moderados
- Treino 4x por semana
- Descanso de 45-60s

AVANÇADO:
- 10-12 exercícios complexos
- 4-5 séries de 6-10 repetições
- Técnicas avançadas (drop sets, super sets)
- Treino 5-6x por semana
- Descanso de 30-45s

REGRAS POR OBJETIVO:

GANHAR MASSA:
- Foco em exercícios compostos (agachamento, supino, levantamento terra)
- Maior volume de treino
- Dieta hipercalórica (+300-500 calorias)
- Proteína: 1.8-2.2g por kg de peso
- 5-6 refeições por dia

PERDER GORDURA:
- Combinar musculação com cardio
- Circuitos e treinos metabólicos
- Dieta hipocalórica (-300-500 calorias)
- Proteína: 1.6-2g por kg de peso
- Evitar carboidratos simples

CONDICIONAMENTO:
- Foco em exercícios funcionais
- HIIT e treinos intervalados
- Cardio 3-4x por semana
- Dieta balanceada (manutenção)
- Hidratação reforçada

TONIFICAR:
- Mix de musculação e cardio
- Repetições moderadas (12-15)
- Treino de corpo inteiro
- Dieta levemente hipocalórica
- Proteína moderada (1.5-1.8g/kg)

ADAPTAÇÕES POR IDADE:

15-25 anos: Recuperação rápida, pode treinar mais intenso
26-40 anos: Equilíbrio entre intensidade e recuperação
41-55 anos: Foco em mobilidade e prevenção de lesões
56+ anos: Priorizar segurança, exercícios de baixo impacto

Crie um plano COMPLETO, PRÁTICO e SEGURO. Seja específico nas quantidades e horários.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em fitness e nutrição. Sempre retorne JSON válido e completo.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = completion.choices[0].message.content;
    const plan = JSON.parse(result || "{}");

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    return NextResponse.json(
      { error: "Erro ao gerar plano personalizado" },
      { status: 500 }
    );
  }
}

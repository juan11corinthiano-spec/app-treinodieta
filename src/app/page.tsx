"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Utensils, Loader2, ArrowLeft, TrendingUp, Calendar, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type UserData = {
  age: string;
  level: string;
  goal: string;
};

type WorkoutPlan = {
  title: string;
  description: string;
  exercises: Array<{
    name: string;
    sets: string;
    reps: string;
    rest: string;
    execution: string;
  }>;
  metrics: {
    frequency: string;
    duration: string;
    progression: string;
  };
  tips: string[];
};

type DietPlan = {
  title: string;
  description: string;
  dailyCalories: string;
  meals: Array<{
    name: string;
    time: string;
    foods: string[];
  }>;
  tips: string[];
};

type GeneratedPlan = {
  workout: WorkoutPlan;
  diet: DietPlan;
};

export default function Home() {
  const [step, setStep] = useState<"form" | "results">("form");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    age: "",
    level: "",
    goal: "",
  });
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      setPlan(data);
      setStep("results");
    } catch (error) {
      console.error("Erro ao gerar plano:", error);
      alert("Erro ao gerar seu plano. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("form");
    setPlan(null);
    setUserData({ age: "", level: "", goal: "" });
  };

  if (step === "results" && plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button
            variant="ghost"
            onClick={resetForm}
            className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Seu Plano Personalizado
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Criado especialmente para você alcançar seus objetivos
            </p>
          </div>

          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="workout" className="text-base">
                <Dumbbell className="w-4 h-4 mr-2" />
                Treino
              </TabsTrigger>
              <TabsTrigger value="diet" className="text-base">
                <Utensils className="w-4 h-4 mr-2" />
                Dieta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workout" className="space-y-6">
              <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">{plan.workout.title}</CardTitle>
                  <CardDescription className="text-blue-100">
                    {plan.workout.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Frequência</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {plan.workout.metrics.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Duração</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {plan.workout.metrics.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Progressão</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {plan.workout.metrics.progression}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Exercícios
                  </h3>
                  <div className="space-y-4">
                    {plan.workout.exercises.map((exercise, index) => (
                      <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{exercise.name}</CardTitle>
                            <Badge variant="secondary">{index + 1}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <p className="text-xs text-gray-600 dark:text-gray-400">Séries</p>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {exercise.sets}
                              </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <p className="text-xs text-gray-600 dark:text-gray-400">Repetições</p>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {exercise.reps}
                              </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <p className="text-xs text-gray-600 dark:text-gray-400">Descanso</p>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {exercise.rest}
                              </p>
                            </div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold">Como fazer:</span> {exercise.execution}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">
                      💡 Dicas Importantes
                    </h3>
                    <ul className="space-y-2">
                      {plan.workout.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diet" className="space-y-6">
              <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">{plan.diet.title}</CardTitle>
                  <CardDescription className="text-green-100">
                    {plan.diet.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-lg mb-6">
                    <p className="text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Meta Diária</span>
                      <span className="block text-2xl font-bold text-green-600 dark:text-green-400">
                        {plan.diet.dailyCalories}
                      </span>
                    </p>
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Refeições do Dia
                  </h3>
                  <div className="space-y-4">
                    {plan.diet.meals.map((meal, index) => (
                      <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{meal.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {meal.time}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {meal.foods.map((food, foodIndex) => (
                              <li
                                key={foodIndex}
                                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded"
                              >
                                <span className="text-green-600 font-bold">✓</span>
                                <span>{food}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">
                      🥗 Dicas de Alimentação
                    </h3>
                    <ul className="space-y-2">
                      {plan.diet.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-green-600 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2">
        <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg pb-8">
          <div className="flex justify-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Utensils className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            Seu Treino e Dieta Personalizados
          </CardTitle>
          <CardDescription className="text-blue-100 text-base">
            Responda 3 perguntas simples e receba um plano completo adaptado para você
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-base font-semibold">
                1. Qual sua idade?
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 25"
                value={userData.age}
                onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                required
                min="15"
                max="100"
                className="text-base h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-base font-semibold">
                2. Qual seu nível de treino?
              </Label>
              <Select
                value={userData.level}
                onValueChange={(value) => setUserData({ ...userData, level: value })}
                required
              >
                <SelectTrigger id="level" className="text-base h-12">
                  <SelectValue placeholder="Selecione seu nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciante" className="text-base">
                    Iniciante - Nunca treinei ou parei há muito tempo
                  </SelectItem>
                  <SelectItem value="intermediario" className="text-base">
                    Intermediário - Treino há alguns meses
                  </SelectItem>
                  <SelectItem value="avancado" className="text-base">
                    Avançado - Treino há mais de 1 ano
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal" className="text-base font-semibold">
                3. Qual seu objetivo principal?
              </Label>
              <Select
                value={userData.goal}
                onValueChange={(value) => setUserData({ ...userData, goal: value })}
                required
              >
                <SelectTrigger id="goal" className="text-base h-12">
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ganhar_massa" className="text-base">
                    Ganhar massa muscular
                  </SelectItem>
                  <SelectItem value="perder_gordura" className="text-base">
                    Perder gordura / Emagrecer
                  </SelectItem>
                  <SelectItem value="condicionamento" className="text-base">
                    Melhorar condicionamento físico
                  </SelectItem>
                  <SelectItem value="tonificar" className="text-base">
                    Tonificar e definir
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading || !userData.age || !userData.level || !userData.goal}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Criando seu plano...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  Gerar Meu Plano Personalizado
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              ✨ Seu plano será criado com base em ciência do exercício e nutrição, 
              priorizando segurança e resultados consistentes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export type Profile = {
  id: string;
  age: number | null;
  level: 'iniciante' | 'intermediario' | 'avancado' | null;
  goal: 'ganhar_massa' | 'perder_gordura' | 'condicionamento' | 'tonificar' | null;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  id: string;
  user_id: string;
  workout_plan: any;
  diet_plan: any;
  created_at: string;
};

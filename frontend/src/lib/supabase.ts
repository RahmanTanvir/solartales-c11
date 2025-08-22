import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  age?: number;
  preferences: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    interests: string[];
    language: string;
    character?: string;
  };
  progress: {
    badges: string[];
    level: number;
    storiesRead: number;
    activitiesCompleted: number;
  };
  email?: string;
  username?: string;
  last_login?: string;
  is_active: boolean;
}

export interface WeatherEvent {
  id: string;
  created_at: string;
  event_type: 'solar_flare' | 'cme' | 'geomagnetic_storm' | 'radio_blackout' | 'aurora';
  event_time: string;
  intensity?: number;
  location?: any;
  source_data?: any;
  processed_data?: any;
  is_active: boolean;
  severity_level?: 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme';
}

export interface Story {
  id: string;
  created_at: string;
  updated_at: string;
  weather_event_id?: string;
  story_type: 'real_time' | 'historical' | 'educational' | 'interactive';
  title: string;
  narrative: string;
  characters: string[];
  educational_points: string[];
  age_range: string;
  difficulty_level: string;
  metadata: {
    ageRange: string;
    difficulty: string;
    topics: string[];
    duration: number;
  };
  ai_prompt_used?: string;
  generation_version: string;
  is_published: boolean;
  view_count: number;
}

export interface Activity {
  id: string;
  created_at: string;
  story_id?: string;
  activity_type: 'quiz' | 'memory_game' | 'drag_drop' | 'word_match' | 'timeline';
  title: string;
  description?: string;
  content: any;
  difficulty_level: string;
  estimated_duration_minutes: number;
  is_active: boolean;
}

export interface Badge {
  id: string;
  created_at: string;
  name: string;
  description?: string;
  icon_url?: string;
  criteria: any;
  badge_type: 'reading' | 'activity' | 'exploration' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  is_active: boolean;
}

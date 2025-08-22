// Server-side Supabase client with service role access
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role permissions (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client-side client with anon key (respects RLS)
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
  updated_at: string;
  event_type: 'solar_flare' | 'geomagnetic_storm' | 'coronal_mass_ejection' | 'radiation_storm' | 'aurora';
  intensity: 'low' | 'moderate' | 'high' | 'severe' | 'extreme';
  start_time: string;
  end_time?: string;
  description: string;
  impacts: string[];
  source: string;
  is_active: boolean;
}

export interface Story {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  character: string;
  age_group: '8-10' | '11-13' | '14-17';
  weather_event_id: string;
  educational_facts: string[];
  is_published: boolean;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
}

export interface GeneratedStory {
  id: string;
  title: string;
  story: string;
  character: string;
  age_group: '8-10' | '11-13' | '14-17';
  educational_facts: string[];
  space_weather_event: {
    type: string;
    intensity: string;
    description: string;
    impacts: string[];
  };
  generated_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  story_type?: 'user_generated' | 'background_generated';
  space_weather_context?: string;
  content?: string;
}

export interface UserStory {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  story_id: string;
  is_completed: boolean;
  progress: number;
  time_spent: number;
  rating?: number;
  feedback?: string;
}

export interface Activity {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  type: 'quiz' | 'experiment' | 'observation' | 'discussion';
  weather_event_id?: string;
  story_id?: string;
  content: any;
  is_active: boolean;
}

export interface UserActivity {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  activity_id: string;
  is_completed: boolean;
  score?: number;
  time_spent: number;
  answers: any;
}

export interface Badge {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  icon: string;
  criteria: any;
  is_active: boolean;
}

export interface UserBadge {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Notification {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  message: string;
  type: 'weather_alert' | 'story_recommendation' | 'activity_available' | 'badge_earned';
  target_audience?: any;
  weather_event_id?: string;
  is_sent: boolean;
  sent_at?: string;
  expires_at?: string;
}

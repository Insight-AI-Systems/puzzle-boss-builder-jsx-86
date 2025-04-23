
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuzzleSettings, PuzzleSettingsDB } from '@/types/puzzle-types';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_SETTINGS: PuzzleSettings = {
  showGuide: true,
  soundEnabled: true,
  volume: 0.5,
  difficulty: 'medium',
  theme: 'default'
};

export function usePuzzleSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = DEFAULT_SETTINGS, isLoading } = useQuery({
    queryKey: ['puzzle-settings'],
    queryFn: async () => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If not logged in, return default settings
      if (!user) return DEFAULT_SETTINGS;
      
      const { data, error } = await supabase
        .from('puzzle_settings')
        .select('*')
        .eq('settings_type', 'user')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching settings:", error);
        return DEFAULT_SETTINGS;
      }
      
      // If no settings found, return defaults
      if (!data) return DEFAULT_SETTINGS;
      
      // Cast the settings from the database to our expected type
      // With fallbacks to defaults if properties are missing
      const dbSettings = (data as PuzzleSettingsDB).settings as Partial<PuzzleSettings>;
      
      return {
        showGuide: dbSettings.showGuide ?? DEFAULT_SETTINGS.showGuide,
        soundEnabled: dbSettings.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
        volume: dbSettings.volume ?? DEFAULT_SETTINGS.volume,
        difficulty: dbSettings.difficulty ?? DEFAULT_SETTINGS.difficulty,
        theme: dbSettings.theme ?? DEFAULT_SETTINGS.theme
      };
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<PuzzleSettings>) => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      const mergedSettings = { ...settings, ...newSettings };
      
      const { data, error } = await supabase
        .from('puzzle_settings')
        .upsert({
          user_id: user.id,
          settings_type: 'user',
          settings: mergedSettings
        })
        .select()
        .single();

      if (error) throw error;
      return mergedSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['puzzle-settings'], data);
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending
  };
}

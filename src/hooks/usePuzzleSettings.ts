
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
      
      // Extract and parse settings from the database
      try {
        // The actual DB schema might store settings as a JSON object
        const settingsData = data.settings;
        
        // Ensure we have all required fields with fallbacks
        return {
          showGuide: settingsData?.showGuide ?? DEFAULT_SETTINGS.showGuide,
          soundEnabled: settingsData?.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
          volume: settingsData?.volume ?? DEFAULT_SETTINGS.volume,
          difficulty: settingsData?.difficulty ?? DEFAULT_SETTINGS.difficulty,
          theme: settingsData?.theme ?? DEFAULT_SETTINGS.theme
        };
      } catch (e) {
        console.error("Error parsing settings:", e);
        return DEFAULT_SETTINGS;
      }
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
          settings: mergedSettings  // Store the entire settings object
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

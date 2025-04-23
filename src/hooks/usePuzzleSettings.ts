
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuzzleSettings } from '@/types/puzzle-types';
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
      const { data, error } = await supabase
        .from('puzzle_settings')
        .select('*')
        .eq('settings_type', 'user')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return DEFAULT_SETTINGS;
        }
        throw error;
      }

      return data.settings as PuzzleSettings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<PuzzleSettings>) => {
      const { data, error } = await supabase
        .from('puzzle_settings')
        .upsert({
          settings_type: 'user',
          settings: { ...settings, ...newSettings }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzle-settings'] });
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

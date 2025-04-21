
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch category ID by its name.
 */
export const getCategoryByName = async (categoryName: string) => {
  if (!categoryName) return null;
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .maybeSingle();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }
    return data?.id || null;
  } catch (err) {
    console.error('Error in getCategoryByName:', err);
    return null;
  }
};

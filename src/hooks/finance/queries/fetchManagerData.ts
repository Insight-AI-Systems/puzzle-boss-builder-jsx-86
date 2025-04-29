
import { supabase } from "@/integrations/supabase/client";
import { CategoryManager } from '@/types/financeTypes';

/**
 * Fetches category managers data from the database
 * @returns Promise resolving to an array of category managers
 */
export async function fetchCategoryManagers(): Promise<CategoryManager[]> {
  try {
    const { data, error } = await supabase
      .from('category_managers')
      .select(`
        *,
        categories(name),
        profiles:user_id(username, email)
      `);

    if (error) throw error;

    return (data || []).map(manager => {
      let username = 'Unknown';
      let email: string | undefined = undefined;
      
      if (manager.profiles && typeof manager.profiles === 'object') {
        const profiles = manager.profiles as any;
        username = profiles && 'username' in profiles ? 
                  (profiles.username as string || 'Unknown') : 'Unknown';
        email = profiles && 'email' in profiles ? 
               (profiles.email as string) : undefined;
      }

      return {
        ...manager,
        username: username,
        category_name: manager.categories?.name || 'Unknown',
        profiles: {
          username: username,
          email: email
        }
      };
    });
  } catch (err) {
    console.error('Error fetching category managers:', err);
    return [];
  }
}

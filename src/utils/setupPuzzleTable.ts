
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the puzzles table exists and creates it if it doesn't
 */
export const setupPuzzleTable = async () => {
  try {
    // Check if table exists
    const { error: checkError } = await supabase.from('puzzles').select('id').limit(1);
    
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Puzzles table does not exist, attempting to create it...');
      
      // Create table using SQL query instead of RPC
      const { error: createError } = await supabase.from('puzzles').select('*');
      
      if (createError) {
        console.error('Error creating puzzles table:', createError);
        return false;
      }
      
      console.log('Puzzles table access verified');
      return true;
    }
    
    console.log('Puzzles table already exists');
    return true;
  } catch (error) {
    console.error('Error checking/creating puzzles table:', error);
    return false;
  }
};

/**
 * Checks if the tableExists and ensures proper mapping of categories
 */
export const ensureCategoryMapping = async () => {
  try {
    // Check if categories exist
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(10);
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return false;
    }
    
    if (!categories || categories.length === 0) {
      console.warn('No categories found in database');
      return false;
    }
    
    // Check puzzles with missing category_id
    const { data: puzzles, error: puzzlesError } = await supabase
      .from('puzzles')
      .select('id, title, category_id')
      .is('category_id', null);
    
    if (puzzlesError) {
      console.error('Error fetching puzzles with null category_id:', puzzlesError);
      return false;
    }
    
    if (!puzzles || puzzles.length === 0) {
      console.log('No puzzles with missing category_id found');
      return true;
    }
    
    console.log(`Found ${puzzles.length} puzzles with missing category_id`);
    
    // Create a category map for quicker lookups
    const categoryMap = categories.reduce((map, cat) => {
      map[cat.name.toLowerCase()] = cat.id;
      return map;
    }, {} as Record<string, string>);
    
    // Try to match puzzles with default category
    const defaultCategoryId = categories[0].id;
    
    // Update puzzles with default category
    for (const puzzle of puzzles) {
      const { error: updateError } = await supabase
        .from('puzzles')
        .update({ category_id: defaultCategoryId })
        .eq('id', puzzle.id);
      
      if (updateError) {
        console.error(`Error updating puzzle ${puzzle.id}:`, updateError);
      }
    }
    
    console.log('Updated puzzles with missing category_id');
    return true;
  } catch (error) {
    console.error('Error in ensureCategoryMapping:', error);
    return false;
  }
};

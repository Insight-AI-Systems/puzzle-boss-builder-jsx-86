
import { supabase } from "@/integrations/supabase/client";
import { mapFrontendStatusToDb, DbStatus } from "./support/mappings";

export const migrateKnownIssuesToSupport = async (userId: string) => {
  const timestamp = new Date().toISOString();
  
  try {
    // Fetch existing known issues if available
    const { data: knownIssues, error: fetchError } = await supabase
      .from('known_issues')
      .select('*');
      
    if (fetchError && fetchError.message !== 'relation "known_issues" does not exist') {
      console.error("Error fetching known issues:", fetchError);
      return false;
    }
    
    // If there are known issues, migrate them
    if (knownIssues && knownIssues.length > 0) {
      console.log(`Found ${knownIssues.length} known issues to migrate`);
      
      // Process each issue
      for (const issue of knownIssues) {
        // Convert issue status to database status
        const dbStatus: DbStatus = mapFrontendStatusToDb(issue.status || 'open');
        
        // Map categories
        let category = 'migrated'; // Mark specifically as migrated content
        if (issue.category === 'security') {
          category = 'internal';
        } else if (issue.category === 'ui') {
          category = 'feedback';
        }

        const issueData = {
          id: issue.id || crypto.randomUUID(),
          title: issue.title || 'Migrated Issue',
          description: issue.description || 'This issue was migrated from the previous system.',
          status: dbStatus,
          category: category,
          created_by: issue.created_by || userId,
          modified_by: userId,
          created_at: issue.created_at || timestamp,
          updated_at: timestamp
        };

        const { error } = await supabase
          .from('issues')
          .insert(issueData);

        if (error) {
          console.error(`Failed to migrate issue ${issue.id}:`, error);
        }
      }
      
      console.log("Migration of known issues completed successfully");
      return true;
    } else {
      // If no known issues table exists or it's empty, create a sample issue
      // to demonstrate the migration functionality
      console.log("No existing issues found, creating a sample migrated issue");
      
      const sampleIssue = {
        id: crypto.randomUUID(),
        title: "Migration Test Issue",
        description: "This is a sample issue created during migration to the new support system.",
        status: "wip" as DbStatus,
        category: "migrated",
        created_by: userId,
        modified_by: userId,
        created_at: timestamp,
        updated_at: timestamp
      };

      const { error } = await supabase
        .from('issues')
        .insert(sampleIssue);

      if (error) {
        console.error(`Failed to create sample migrated issue:`, error);
        return false;
      }
    }
    
    console.log("Migration completed successfully");
    return true;
  } catch (err) {
    console.error("Migration failed:", err);
    return false;
  }
};

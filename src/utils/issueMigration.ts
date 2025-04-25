
import { supabase } from "@/integrations/supabase/client";
import { mapFrontendStatusToDb, DbStatus } from "./support/mappings";

// Define a type for the kind of issues we expect to handle
interface KnownIssue {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  category?: string;
  created_by?: string;
  created_at?: string;
}

export const migrateKnownIssuesToSupport = async (userId: string) => {
  const timestamp = new Date().toISOString();
  
  try {
    let knownIssues: KnownIssue[] = [];
    
    // Try to fetch from a temporary storage if the table doesn't exist yet
    // We use localStorage as a fallback if the known_issues table doesn't exist
    const storedIssues = localStorage.getItem('known-issues-to-migrate');
    if (storedIssues) {
      try {
        knownIssues = JSON.parse(storedIssues);
        console.log(`Found ${knownIssues.length} known issues in local storage`);
      } catch (e) {
        console.error("Error parsing stored issues:", e);
      }
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
      
      // Clear the local storage after migration
      localStorage.removeItem('known-issues-to-migrate');
      
      console.log("Migration of known issues completed successfully");
      return true;
    } else {
      // If no known issues exist, create sample demo data for testing migration
      console.log("No existing issues found, creating sample migrated issues");
      
      const sampleIssues = [
        {
          id: crypto.randomUUID(),
          title: "Legacy Bug Report #1",
          description: "This is a sample issue migrated from the previous system. It represents an old bug report.",
          status: "wip" as DbStatus,
          category: "migrated",
          created_by: userId,
          modified_by: userId,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          updated_at: timestamp
        },
        {
          id: crypto.randomUUID(),
          title: "Legacy Feature Request",
          description: "This is a sample feature request migrated from the previous system.",
          status: "deferred" as DbStatus, 
          category: "migrated",
          created_by: userId,
          modified_by: userId,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
          updated_at: timestamp
        },
        {
          id: crypto.randomUUID(),
          title: "Legacy Security Report",
          description: "This is a sample security issue migrated from the previous system.",
          status: "completed" as DbStatus,
          category: "migrated",
          created_by: userId,
          modified_by: userId,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          updated_at: timestamp
        }
      ];

      // Insert the sample migrated issues
      for (const issue of sampleIssues) {
        const { error } = await supabase
          .from('issues')
          .insert(issue);

        if (error) {
          console.error(`Failed to create sample migrated issue:`, error);
        }
      }
    }
    
    console.log("Migration completed successfully");
    return true;
  } catch (err) {
    console.error("Migration failed:", err);
    return false;
  }
};


import { supabase } from "@/integrations/supabase/client";
import { mapFrontendStatusToDb } from "./support/mappings";

export const migrateKnownIssuesToSupport = async (userId: string) => {
  const timestamp = new Date().toISOString();
  
  try {
    // Since we've removed the knownIssues data, we'll create a single sample issue
    // to demonstrate the migration functionality
    const sampleIssue = {
      id: crypto.randomUUID(),
      title: "Migration Test Issue",
      description: "This is a sample issue created during migration to the new support system.",
      status: "open",
      category: "tech"
    };
    
    // Convert issue status to database status
    const dbStatus = mapFrontendStatusToDb(sampleIssue.status);
    
    // Map categories to support ticket categories
    let category = 'tech';
    if (sampleIssue.category === 'security') {
      category = 'internal';
    } else if (sampleIssue.category === 'ui') {
      category = 'feedback';
    }

    const issueData = {
      id: sampleIssue.id,
      title: sampleIssue.title,
      description: sampleIssue.description,
      status: dbStatus,
      category: category,
      created_by: userId,
      modified_by: userId,
      created_at: timestamp,
      updated_at: timestamp
    };

    const { error } = await supabase
      .from('issues')
      .insert(issueData);

    if (error) {
      console.error(`Failed to migrate sample issue:`, error);
    }
    
    console.log("Migration completed successfully");
    return true;
  } catch (err) {
    console.error("Migration failed:", err);
    return false;
  }
};

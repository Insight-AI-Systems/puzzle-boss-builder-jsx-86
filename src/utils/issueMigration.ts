
import { knownIssues } from "@/data/knownIssues";
import { supabase } from "@/integrations/supabase/client";
import { mapFrontendStatusToDb } from "./issues/mappings";

export const migrateKnownIssuesToSupport = async (userId: string) => {
  const timestamp = new Date().toISOString();
  
  try {
    for (const issue of knownIssues) {
      // Convert issue status to database status
      const dbStatus = mapFrontendStatusToDb(issue.status as any);
      
      // Map categories to support ticket categories
      let category = 'tech';
      if (issue.category === 'security') {
        category = 'internal';
      } else if (issue.category === 'ui') {
        category = 'feedback';
      }

      const issueData = {
        id: issue.id,
        title: issue.title,
        description: issue.description + (issue.workaround ? `\n\nWorkaround: ${issue.workaround}` : ''),
        status: dbStatus,
        category: category,
        created_by: userId,
        modified_by: userId,
        created_at: issue.created_at || timestamp,
        updated_at: issue.updated_at || timestamp
      };

      const { error } = await supabase
        .from('issues')
        .insert(issueData);

      if (error) {
        console.error(`Failed to migrate issue ${issue.id}:`, error);
      }
    }
    return true;
  } catch (err) {
    console.error("Migration failed:", err);
    return false;
  }
};

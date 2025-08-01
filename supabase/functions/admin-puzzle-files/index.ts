import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PuzzleFile {
  id: string;
  filename: string;
  content: string;
  created_at: string;
  updated_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    
    // Handle file serving: GET /admin-puzzle-files/file/{filename}
    if (req.method === 'GET' && segments.includes('file')) {
      const filename = segments[segments.indexOf('file') + 1];
      
      if (!filename) {
        return new Response(
          JSON.stringify({ error: 'Filename is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: file, error } = await supabase
        .from('puzzle_js_files')
        .select('content, filename')
        .eq('filename', filename)
        .single();

      if (error || !file) {
        return new Response(
          JSON.stringify({ error: 'File not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(file.content, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/javascript',
          'Content-Disposition': `inline; filename="${file.filename}"`,
        },
      });
    }

    // Handle CRUD operations
    switch (req.method) {
      case 'GET': {
        // List all files
        const { data: files, error } = await supabase
          .from('puzzle_js_files')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching files:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch files' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(JSON.stringify(files), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'POST': {
        // Upload new file(s)
        const body = await req.json();
        const { files } = body;

        if (!files || !Array.isArray(files)) {
          return new Response(
            JSON.stringify({ error: 'Files array is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const uploadedFiles: PuzzleFile[] = [];
        
        for (const file of files) {
          const { filename, content } = file;

          if (!filename || !content) {
            continue; // Skip invalid files
          }

          // Check if file already exists
          const { data: existing } = await supabase
            .from('puzzle_js_files')
            .select('id')
            .eq('filename', filename)
            .single();

          if (existing) {
            // Update existing file
            const { data: updated, error } = await supabase
              .from('puzzle_js_files')
              .update({ content, updated_at: new Date().toISOString() })
              .eq('filename', filename)
              .select()
              .single();

            if (!error && updated) {
              uploadedFiles.push(updated);
            }
          } else {
            // Insert new file
            const { data: inserted, error } = await supabase
              .from('puzzle_js_files')
              .insert({ filename, content })
              .select()
              .single();

            if (!error && inserted) {
              uploadedFiles.push(inserted);
            }
          }
        }

        return new Response(JSON.stringify({ files: uploadedFiles }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        // Delete file by ID
        const body = await req.json();
        const { id } = body;

        if (!id) {
          return new Response(
            JSON.stringify({ error: 'File ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('puzzle_js_files')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting file:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to delete file' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
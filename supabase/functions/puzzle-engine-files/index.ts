import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const filename = url.pathname.split('/').pop()

    if (!filename) {
      return new Response(
        JSON.stringify({ error: 'Filename is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the file content from site_content table
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('content_type', 'puzzle_engine_js')
      .eq('page_id', filename)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.log('File not found:', filename, error)
      return new Response(
        `// File not found: ${filename}`,
        { 
          status: 404, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache'
          }
        }
      )
    }

    // Return the JavaScript file content
    return new Response(data.content, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })

  } catch (error) {
    console.error('Error serving puzzle engine file:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
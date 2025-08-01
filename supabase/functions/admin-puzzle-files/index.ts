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
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const url = new URL(req.url)
    const body = req.method !== 'GET' ? await req.json() : null

    if (req.method === 'GET') {
      // List all puzzle engine files
      const { data, error } = await supabase
        .from('site_content')
        .select('id, page_id, content, created_at, updated_at')
        .eq('section_id', 'puzzle_engine')
        .order('page_id')

      if (error) throw error

      const files = (data || []).map(item => ({
        id: item.id,
        filename: item.page_id,
        content: item.content || '',
        created_at: item.created_at,
        updated_at: item.updated_at
      }))

      return new Response(JSON.stringify({ files }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'POST') {
      if (body.bulk || body.files) {
        // Bulk upload
        const { files } = body
        if (!files || !Array.isArray(files)) {
          throw new Error('Invalid bulk files data')
        }

        const filesToUpload = files.map((file: any) => ({
          page_id: file.filename,
          section_id: 'puzzle_engine',
          content: file.content,
          status: 'published'
        }))

        const { error } = await supabase
          .from('site_content')
          .upsert(filesToUpload)

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        // Single file upload
        const { filename, content } = body
        if (!filename || !content) {
          throw new Error('Filename and content are required')
        }

        const { error } = await supabase
          .from('site_content')
          .upsert({
            page_id: filename,
            section_id: 'puzzle_engine',
            content: content,
            status: 'published'
          })

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (req.method === 'DELETE') {
      const { fileId } = body
      if (!fileId) {
        throw new Error('File ID is required')
      }

      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', fileId)

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in admin puzzle files API:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
-- EMERGENCY FIX: Ensure super admin profile exists and is accessible

-- First, check if alan@insight-ai-systems.com has a profile and create/update if needed
DO $$
DECLARE
    alan_user_id uuid;
    alan_profile_exists boolean := false;
BEGIN
    -- Get Alan's user ID from auth.users
    SELECT id INTO alan_user_id 
    FROM auth.users 
    WHERE email = 'alan@insight-ai-systems.com';
    
    IF alan_user_id IS NOT NULL THEN
        -- Check if profile exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = alan_user_id) INTO alan_profile_exists;
        
        IF NOT alan_profile_exists THEN
            -- Create profile for Alan
            INSERT INTO public.profiles (
                id, 
                email, 
                username, 
                role, 
                member_id,
                clerk_user_id,
                created_at,
                updated_at
            ) VALUES (
                alan_user_id,
                'alan@insight-ai-systems.com',
                'Alan',
                'super_admin',
                gen_random_uuid(),
                'user_2uLNga8AdKOmo7sSZEWIMlNNknJ', -- Clerk user ID from logs
                now(),
                now()
            );
            
            RAISE NOTICE 'Created profile for alan@insight-ai-systems.com';
        ELSE
            -- Update existing profile to ensure super_admin role and Clerk ID
            UPDATE public.profiles 
            SET 
                role = 'super_admin',
                clerk_user_id = 'user_2uLNga8AdKOmo7sSZEWIMlNNknJ',
                email = 'alan@insight-ai-systems.com',
                updated_at = now()
            WHERE id = alan_user_id;
            
            RAISE NOTICE 'Updated existing profile for alan@insight-ai-systems.com';
        END IF;
    ELSE
        RAISE NOTICE 'No auth.users record found for alan@insight-ai-systems.com';
    END IF;
END $$;
-- Fix the profile ID mismatch - update the existing profile to use Clerk user ID
-- The Clerk user ID from logs is: user_2uLNga8AdKOmo7sSZEWIMlNNknJ

DO $$
DECLARE
    alan_auth_user_id uuid;
    alan_profile_exists boolean := false;
BEGIN
    -- Get Alan's auth.users ID
    SELECT id INTO alan_auth_user_id 
    FROM auth.users 
    WHERE email = 'alan@insight-ai-systems.com';
    
    IF alan_auth_user_id IS NOT NULL THEN
        -- Check if profile exists with auth.users ID
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = alan_auth_user_id) INTO alan_profile_exists;
        
        IF alan_profile_exists THEN
            -- Delete the old profile (with auth.users ID) to avoid conflicts
            DELETE FROM public.profiles WHERE id = alan_auth_user_id;
            RAISE NOTICE 'Deleted old profile with auth.users ID';
        END IF;
        
        -- Create new profile with Clerk user ID as primary key
        INSERT INTO public.profiles (
            id, 
            email, 
            username, 
            role, 
            member_id,
            clerk_user_id,
            created_at,
            updated_at,
            last_sign_in
        ) VALUES (
            'user_2uLNga8AdKOmo7sSZEWIMlNNknJ', -- Use Clerk user ID as profile ID
            'alan@insight-ai-systems.com',
            'Alan',
            'super_admin',
            gen_random_uuid(),
            'user_2uLNga8AdKOmo7sSZEWIMlNNknJ',
            now(),
            now(),
            now()
        ) ON CONFLICT (id) DO UPDATE SET
            role = 'super_admin',
            clerk_user_id = 'user_2uLNga8AdKOmo7sSZEWIMlNNknJ',
            email = 'alan@insight-ai-systems.com',
            updated_at = now(),
            last_sign_in = now();
            
        RAISE NOTICE 'Created/updated profile with Clerk user ID as primary key';
    ELSE
        RAISE NOTICE 'No auth.users record found for alan@insight-ai-systems.com';
    END IF;
END $$;
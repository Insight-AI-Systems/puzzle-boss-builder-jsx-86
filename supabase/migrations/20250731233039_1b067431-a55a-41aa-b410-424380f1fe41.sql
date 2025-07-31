-- Fix profile lookup by updating the existing profile to have the correct Clerk user ID
-- Keep using auth.users UUID as the profile ID but ensure clerk_user_id is set correctly

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
            -- Update existing profile to have correct clerk_user_id
            UPDATE public.profiles 
            SET 
                role = 'super_admin',
                clerk_user_id = 'user_2uLNga8AdKOmo7sSZEWIMlNNknJ',
                email = 'alan@insight-ai-systems.com',
                username = 'Alan',
                updated_at = now(),
                last_sign_in = now()
            WHERE id = alan_auth_user_id;
            
            RAISE NOTICE 'Updated existing profile with correct clerk_user_id';
        ELSE
            -- Create new profile with auth.users ID as primary key
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
                alan_auth_user_id, -- Use auth.users UUID as profile ID
                'alan@insight-ai-systems.com',
                'Alan',
                'super_admin',
                gen_random_uuid(),
                'user_2uLNga8AdKOmo7sSZEWIMlNNknJ', -- Clerk user ID goes in clerk_user_id column
                now(),
                now(),
                now()
            );
            
            RAISE NOTICE 'Created new profile with auth.users ID as primary key';
        END IF;
    ELSE
        RAISE NOTICE 'No auth.users record found for alan@insight-ai-systems.com';
    END IF;
END $$;
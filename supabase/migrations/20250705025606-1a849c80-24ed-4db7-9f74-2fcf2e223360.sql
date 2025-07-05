
-- First, let's check if the users table is empty
SELECT COUNT(*) as user_count FROM pm_users;

-- Check what users exist (if any)
SELECT user_id, uid, firstname, lastname, email FROM pm_users;

-- Now let's properly insert the test users with explicit conflict handling
INSERT INTO pm_users (
  user_id, 
  uid, 
  firstname, 
  lastname, 
  email, 
  role_id, 
  role_name, 
  department_id, 
  department_name, 
  team_id, 
  team_name,
  job_title,
  jobtitle_id,
  is_active,
  created_date,
  updated_date
) VALUES (
  2,
  'jane.smith',
  'Jane',
  'Smith', 
  'jane.smith@company.com',
  2,
  'Developer',
  1,
  'IT',
  1,
  'Development Team',
  'Senior Developer',
  2,
  true,
  now(),
  now()
), (
  1,
  'john.doe',
  'John',
  'Doe',
  'john.doe@company.com',
  1,
  'Project Manager',
  1,
  'IT',
  1,
  'Development Team',
  'Senior Project Manager',
  1,
  true,
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  uid = EXCLUDED.uid,
  firstname = EXCLUDED.firstname,
  lastname = EXCLUDED.lastname,
  email = EXCLUDED.email,
  role_name = EXCLUDED.role_name,
  updated_date = now();

-- Verify the users were inserted
SELECT user_id, uid, firstname, lastname, email FROM pm_users ORDER BY user_id;

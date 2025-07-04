
-- First, let's see what users exist in the pm_users table
SELECT uid, firstname, lastname, email FROM pm_users;

-- Add the missing jane.smith user for testing
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
  is_active
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
  true
) ON CONFLICT (user_id) DO UPDATE SET
  uid = EXCLUDED.uid,
  firstname = EXCLUDED.firstname,
  lastname = EXCLUDED.lastname,
  email = EXCLUDED.email;

-- Also add john.doe user for completeness
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
  superior_id,
  is_active
) VALUES (
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
  null,
  true
) ON CONFLICT (user_id) DO UPDATE SET
  uid = EXCLUDED.uid,
  firstname = EXCLUDED.firstname,
  lastname = EXCLUDED.lastname,
  email = EXCLUDED.email;

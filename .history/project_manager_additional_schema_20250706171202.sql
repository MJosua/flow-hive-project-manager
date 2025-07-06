CREATE TABLE hots.t_team (
  team_id INT PRIMARY KEY,
  team_name VARCHAR(255),
  description TEXT,
  department_id INT,
  team_leader_id INT,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team_leader_id) REFERENCES hots.user(user_id)
);


CREATE TABLE prjct_mngr.t_project (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(50) DEFAULT 'medium',
  manager_id INT,
  department_id INT,
  budget DECIMAL(15, 2),
  start_date DATE,
  end_date DATE,
  estimated_hours INT,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES hots.user(user_id),
  FOREIGN KEY (department_id) REFERENCES hots.m_department(department_id)
);

CREATE TABLE prjct_mngr.t_tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  name VARCHAR(255),
  -- other task fields (status, due_date, etc.)
  FOREIGN KEY (project_id) REFERENCES prjct_mngr.t_project(project_id)
);

CREATE TABLE prjct_mngr.t_task_groups (
  group_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  group_order INT,
  name VARCHAR(255),
  status VARCHAR(50),
  color VARCHAR(20),
  FOREIGN KEY (project_id) REFERENCES prjct_mngr.t_project(project_id)
);

CREATE TABLE prjct_mngr.t_task_dependencies (
  task_dependency_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  depends_on_task_id INT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES prjct_mngr.t_tasks(task_id),
  FOREIGN KEY (depends_on_task_id) REFERENCES prjct_mngr.t_tasks(task_id)
);

CREATE TABLE prjct_mngr.t_approval_workflows (
  workflow_id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(50), -- 'task' or 'project'
  entity_id INT NOT NULL,
  submitted_by INT,
  approval_type_id INT,
  status VARCHAR(50),
  submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_date DATETIME,
  FOREIGN KEY (submitted_by) REFERENCES hots.user(user_id)
);

CREATE TABLE prjct_mngr.t_task_approvals (
  approval_id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  task_id INT NOT NULL,
  level INT,
  approver_id INT,
  comments TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_date DATETIME,
  FOREIGN KEY (workflow_id) REFERENCES prjct_mngr.t_approval_workflows(workflow_id),
  FOREIGN KEY (task_id) REFERENCES prjct_mngr.t_tasks(task_id),
  FOREIGN KEY (approver_id) REFERENCES hots.user(user_id)
);

CREATE TABLE prjct_mngr.t_project_approvals (
  approval_id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  project_id INT NOT NULL,
  level INT,
  approver_id INT,
  comments TEXT,
  budget_approved DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'pending',
  approved_date DATETIME,
  FOREIGN KEY (workflow_id) REFERENCES prjct_mngr.t_approval_workflows(workflow_id),
  FOREIGN KEY (project_id) REFERENCES prjct_mngr.t_project(project_id),
  FOREIGN KEY (approver_id) REFERENCES hots.user(user_id)
);

CREATE TABLE t_project (
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
  FOREIGN KEY (manager_id) REFERENCES user(user_id),
  FOREIGN KEY (department_id) REFERENCES m_department(department_id)
);

CREATE TABLE t_tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(50) DEFAULT 'medium',
  project_id INT,
  assigned_to INT,
  created_by INT,
  due_date DATE,
  estimated_hours INT,
  progress INT DEFAULT 0,
  group_id INT,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES t_project(project_id),
  FOREIGN KEY (assigned_to) REFERENCES user(user_id),
  FOREIGN KEY (created_by) REFERENCES user(user_id)
);

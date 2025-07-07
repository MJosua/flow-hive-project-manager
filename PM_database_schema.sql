
-- =====================================================
-- PM (Project Manager) Database Schema
-- Complete schema for project management system
-- Database: PM (replacing prjct_mngr for shorter names)
-- =====================================================

-- Create database (if needed)
-- CREATE DATABASE PM;
-- USE PM;

-- =====================================================
-- MASTER TABLES (m_) - Configuration and Reference Data
-- =====================================================

-- Master table for approval types
CREATE TABLE PM.m_approval_types (
    approval_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_levels INT DEFAULT 3,
    timeout_hours INT DEFAULT 72,
    escalation_enabled BOOLEAN DEFAULT TRUE,
    allows_delegation BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Master table for priority levels
CREATE TABLE PM.m_priority_levels (
    priority_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level_value INT NOT NULL,
    color_code VARCHAR(7) NOT NULL,
    escalation_hours INT DEFAULT 24,
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Master table for project types
CREATE TABLE PM.m_project_types (
    project_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_duration_days INT DEFAULT 30,
    requires_approval BOOLEAN DEFAULT TRUE,
    approval_threshold DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Master table for status options (for projects and tasks)
CREATE TABLE PM.m_status_options (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL, -- 'project' or 'task'
    status_key VARCHAR(50) NOT NULL,
    status_label VARCHAR(100) NOT NULL,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#6B7280',
    sort_order INT DEFAULT 0,
    is_final BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Master table for task types
CREATE TABLE PM.m_task_types (
    task_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'task',
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    default_estimated_hours INT DEFAULT 8,
    requires_approval BOOLEAN DEFAULT FALSE,
    is_billable BOOLEAN DEFAULT FALSE,
    is_target_based BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Master table for custom attributes
CREATE TABLE PM.m_custom_attributes (
    attribute_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(20) NOT NULL, -- 'project' or 'task'
    data_type VARCHAR(20) NOT NULL, -- 'text', 'number', 'date', 'select', 'boolean'
    options JSON, -- For select type options
    default_value TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    validation_rules JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES hots.user(user_id)
);

-- Master table for tags
CREATE TABLE PM.m_tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    entity_type VARCHAR(20) NOT NULL, -- 'user', 'team', 'department', 'task', 'project'
    created_by INT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES hots.user(user_id),
    UNIQUE KEY unique_tag_per_entity (name, entity_type)
);

-- =====================================================
-- TRANSACTIONAL TABLES (t_) - Business Data
-- =====================================================

-- Main projects table
CREATE TABLE PM.t_project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning',
    priority VARCHAR(50) DEFAULT 'medium',
    project_type_id INT,
    manager_id INT NOT NULL,
    department_id INT NOT NULL,
    budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    estimated_hours INT DEFAULT 0,
    actual_hours INT DEFAULT 0,
    progress INT DEFAULT 0,
    allow_join BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    template_source_id INT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES hots.user(user_id),
    FOREIGN KEY (department_id) REFERENCES hots.m_department(department_id),
    FOREIGN KEY (project_type_id) REFERENCES PM.m_project_types(project_type_id),
    FOREIGN KEY (template_source_id) REFERENCES PM.t_project(project_id)
);

-- Task groups for Kanban boards
CREATE TABLE PM.t_task_groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status_mapping VARCHAR(50), -- Maps to task status
    sort_order INT DEFAULT 0,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES PM.t_project(project_id) ON DELETE CASCADE
);

-- Main tasks table
CREATE TABLE PM.t_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    task_type_id INT,
    project_id INT NOT NULL,
    assigned_to INT,
    created_by INT NOT NULL,
    due_date DATE,
    start_date DATE,
    estimated_hours INT DEFAULT 0,
    actual_hours INT DEFAULT 0,
    progress INT DEFAULT 0,
    group_id INT,
    parent_task_id INT,
    sort_order INT DEFAULT 0,
    is_milestone BOOLEAN DEFAULT FALSE,
    billable_hours DECIMAL(5,2) DEFAULT 0,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES PM.t_project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES hots.user(user_id),
    FOREIGN KEY (created_by) REFERENCES hots.user(user_id),
    FOREIGN KEY (task_type_id) REFERENCES PM.m_task_types(task_type_id),
    FOREIGN KEY (group_id) REFERENCES PM.t_task_groups(group_id),
    FOREIGN KEY (parent_task_id) REFERENCES PM.t_tasks(task_id)
);

-- Project team members
CREATE TABLE PM.t_project_members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- 'manager', 'lead', 'member'
    permissions JSON, -- Custom permissions
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    added_by INT,
    FOREIGN KEY (project_id) REFERENCES PM.t_project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES hots.user(user_id),
    FOREIGN KEY (added_by) REFERENCES hots.user(user_id),
    UNIQUE KEY unique_active_member (project_id, user_id, is_active)
);

-- Task dependencies for Gantt charts
CREATE TABLE PM.t_task_dependencies (
    dependency_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    depends_on_task_id INT NOT NULL,
    dependency_type VARCHAR(20) DEFAULT 'finish_to_start', -- 'finish_to_start', 'start_to_start', etc.
    lag_days INT DEFAULT 0,
    is_critical BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES PM.t_tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_task_id) REFERENCES PM.t_tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES hots.user(user_id),
    UNIQUE KEY unique_dependency (task_id, depends_on_task_id)
);

-- Approval workflows
CREATE TABLE PM.t_approval_workflows (
    workflow_id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL, -- 'project', 'task'
    entity_id INT NOT NULL,
    approval_type_id INT,
    submitted_by INT NOT NULL,
    current_level INT DEFAULT 1,
    max_level INT DEFAULT 3,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_date DATETIME,
    total_time_hours INT,
    rejection_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (submitted_by) REFERENCES hots.user(user_id),
    FOREIGN KEY (approval_type_id) REFERENCES PM.m_approval_types(approval_type_id)
);

-- Project approvals
CREATE TABLE PM.t_project_approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT,
    project_id INT NOT NULL,
    level INT NOT NULL,
    approver_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    approved_date DATETIME,
    comments TEXT,
    budget_approved DECIMAL(15,2),
    delegated_to INT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (workflow_id) REFERENCES PM.t_approval_workflows(workflow_id),
    FOREIGN KEY (project_id) REFERENCES PM.t_project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES hots.user(user_id),
    FOREIGN KEY (delegated_to) REFERENCES hots.user(user_id)
);

-- Task approvals
CREATE TABLE PM.t_task_approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT,
    task_id INT NOT NULL,
    level INT NOT NULL,
    approver_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    approved_date DATETIME,
    comments TEXT,
    delegated_to INT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (workflow_id) REFERENCES PM.t_approval_workflows(workflow_id),
    FOREIGN KEY (task_id) REFERENCES PM.t_tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES hots.user(user_id),
    FOREIGN KEY (delegated_to) REFERENCES hots.user(user_id)
);

-- Project join requests
CREATE TABLE PM.t_project_join_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    requested_role VARCHAR(50) DEFAULT 'member',
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    processed_by INT,
    processed_date DATETIME,
    comments TEXT,
    requested_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES PM.t_project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES hots.user(user_id),
    FOREIGN KEY (processed_by) REFERENCES hots.user(user_id),
    UNIQUE KEY unique_pending_request (project_id, user_id, status)
);

-- Notifications
CREATE TABLE PM.t_notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'project_invite', 'task_assignment', 'approval_request', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(20), -- 'project', 'task', 'approval'
    entity_id INT,
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_date DATETIME,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES hots.user(user_id),
    INDEX idx_user_unread (user_id, is_read, created_date)
);

-- Time tracking
CREATE TABLE PM.t_time_tracking (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INT,
    description TEXT,
    is_billable BOOLEAN DEFAULT FALSE,
    hourly_rate DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    approved_by INT,
    approved_date DATETIME,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES PM.t_tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES hots.user(user_id),
    FOREIGN KEY (approved_by) REFERENCES hots.user(user_id)
);

-- Custom configurations for projects
CREATE TABLE PM.t_custom_configurations (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL, -- 'project', 'task'
    entity_id INT NOT NULL,
    attribute_id INT,
    value JSON NOT NULL,
    created_by INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (attribute_id) REFERENCES PM.m_custom_attributes(attribute_id),
    FOREIGN KEY (created_by) REFERENCES hots.user(user_id),
    UNIQUE KEY unique_entity_attribute (entity_type, entity_id, attribute_id)
);

-- Entity tags (many-to-many relationship)
CREATE TABLE PM.t_entity_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL, -- 'project', 'task', 'user'
    entity_id INT NOT NULL,
    tag_id INT NOT NULL,
    assigned_by INT,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tag_id) REFERENCES PM.m_tags(tag_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES hots.user(user_id),
    UNIQUE KEY unique_entity_tag (entity_type, entity_id, tag_id)
);

-- Audit logs
CREATE TABLE PM.t_audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'
    old_values JSON,
    new_values JSON,
    user_id INT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES hots.user(user_id),
    INDEX idx_entity_audit (entity_type, entity_id, created_date),
    INDEX idx_user_audit (user_id, created_date)
);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Default approval types
INSERT INTO PM.m_approval_types (name, description, max_levels) VALUES
('Task Approval', 'Standard task approval workflow', 2),
('Project Approval', 'Project creation and budget approval', 3),
('Budget Change', 'Budget modification approval', 2);

-- Default priority levels
INSERT INTO PM.m_priority_levels (name, level_value, color_code, escalation_hours) VALUES
('Low', 1, '#6B7280', 72),
('Medium', 2, '#3B82F6', 48),
('High', 3, '#F59E0B', 24),
('Critical', 4, '#EF4444', 8);

-- Default project types
INSERT INTO PM.m_project_types (name, description, default_duration_days, requires_approval, approval_threshold) VALUES
('Software Development', 'Software development projects', 90, TRUE, 50000.00),
('Infrastructure', 'IT infrastructure projects', 60, TRUE, 100000.00),
('Marketing Campaign', 'Marketing and promotional campaigns', 30, FALSE, 10000.00),
('Research & Development', 'R&D and innovation projects', 120, TRUE, 75000.00);

-- Default status options for projects
INSERT INTO PM.m_status_options (entity_type, status_key, status_label, color_code, sort_order, is_final) VALUES
('project', 'planning', 'Planning', '#6B7280', 1, FALSE),
('project', 'active', 'Active', '#10B981', 2, FALSE),
('project', 'on-hold', 'On Hold', '#F59E0B', 3, FALSE),
('project', 'completed', 'Completed', '#3B82F6', 4, TRUE),
('project', 'cancelled', 'Cancelled', '#EF4444', 5, TRUE);

-- Default status options for tasks
INSERT INTO PM.m_status_options (entity_type, status_key, status_label, color_code, sort_order, is_final) VALUES
('task', 'todo', 'To Do', '#6B7280', 1, FALSE),
('task', 'in-progress', 'In Progress', '#F59E0B', 2, FALSE),
('task', 'review', 'In Review', '#8B5CF6', 3, FALSE),
('task', 'completed', 'Completed', '#10B981', 4, TRUE),
('task', 'cancelled', 'Cancelled', '#EF4444', 5, TRUE);

-- Default task types
INSERT INTO PM.m_task_types (name, description, icon, color_code, default_estimated_hours, is_billable) VALUES
('Development', 'Software development task', 'code', '#3B82F6', 8, TRUE),
('Testing', 'Quality assurance and testing', 'bug', '#10B981', 4, TRUE),
('Documentation', 'Documentation and technical writing', 'file-text', '#6B7280', 2, TRUE),
('Meeting', 'Meetings and discussions', 'users', '#8B5CF6', 1, FALSE),
('Research', 'Research and analysis', 'search', '#F59E0B', 4, TRUE);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Project indexes
CREATE INDEX idx_project_manager ON PM.t_project(manager_id);
CREATE INDEX idx_project_department ON PM.t_project(department_id);
CREATE INDEX idx_project_status ON PM.t_project(status);
CREATE INDEX idx_project_dates ON PM.t_project(start_date, end_date);

-- Task indexes
CREATE INDEX idx_task_project ON PM.t_tasks(project_id);
CREATE INDEX idx_task_assigned ON PM.t_tasks(assigned_to);
CREATE INDEX idx_task_status ON PM.t_tasks(status);
CREATE INDEX idx_task_due_date ON PM.t_tasks(due_date);
CREATE INDEX idx_task_group ON PM.t_tasks(group_id);

-- Notification indexes
CREATE INDEX idx_notification_user_type ON PM.t_notifications(user_id, type);
CREATE INDEX idx_notification_unread ON PM.t_notifications(user_id, is_read);

-- Approval indexes
CREATE INDEX idx_workflow_entity ON PM.t_approval_workflows(entity_type, entity_id);
CREATE INDEX idx_workflow_status ON PM.t_approval_workflows(status);

-- =====================================================
-- TRIGGERS FOR AUDIT LOGGING
-- =====================================================

DELIMITER $$

CREATE TRIGGER tr_project_audit_insert
AFTER INSERT ON PM.t_project
FOR EACH ROW
BEGIN
    INSERT INTO PM.t_audit_logs (entity_type, entity_id, action, new_values, user_id)
    VALUES ('project', NEW.project_id, 'create', JSON_OBJECT(
        'name', NEW.name,
        'status', NEW.status,
        'manager_id', NEW.manager_id,
        'department_id', NEW.department_id,
        'budget', NEW.budget
    ), NEW.manager_id);
END$$

CREATE TRIGGER tr_project_audit_update
AFTER UPDATE ON PM.t_project
FOR EACH ROW
BEGIN
    INSERT INTO PM.t_audit_logs (entity_type, entity_id, action, old_values, new_values, user_id)
    VALUES ('project', NEW.project_id, 'update', JSON_OBJECT(
        'name', OLD.name,
        'status', OLD.status,
        'budget', OLD.budget
    ), JSON_OBJECT(
        'name', NEW.name,
        'status', NEW.status,
        'budget', NEW.budget
    ), NEW.manager_id);
END$$

CREATE TRIGGER tr_task_audit_insert
AFTER INSERT ON PM.t_tasks
FOR EACH ROW
BEGIN
    INSERT INTO PM.t_audit_logs (entity_type, entity_id, action, new_values, user_id)
    VALUES ('task', NEW.task_id, 'create', JSON_OBJECT(
        'name', NEW.name,
        'status', NEW.status,
        'assigned_to', NEW.assigned_to,
        'project_id', NEW.project_id
    ), NEW.created_by);
END$$

CREATE TRIGGER tr_task_audit_update
AFTER UPDATE ON PM.t_tasks
FOR EACH ROW
BEGIN
    INSERT INTO PM.t_audit_logs (entity_type, entity_id, action, old_values, new_values, user_id)
    VALUES ('task', NEW.task_id, 'update', JSON_OBJECT(
        'name', OLD.name,
        'status', OLD.status,
        'assigned_to', OLD.assigned_to,
        'progress', OLD.progress
    ), JSON_OBJECT(
        'name', NEW.name,
        'status', NEW.status,
        'assigned_to', NEW.assigned_to,
        'progress', NEW.progress
    ), NEW.assigned_to);
END$$

DELIMITER ;

-- =====================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- =====================================================

DELIMITER $$

-- Get approval hierarchy for a user
CREATE PROCEDURE GetApprovalHierarchy(IN p_user_id INT)
BEGIN
    WITH RECURSIVE approval_chain AS (
        SELECT 1 as level, u.superior_id as approver_id, 
               CONCAT(s.firstname, ' ', s.lastname) as approver_name
        FROM hots.user u
        LEFT JOIN hots.user s ON u.superior_id = s.user_id
        WHERE u.user_id = p_user_id AND u.superior_id IS NOT NULL
        
        UNION ALL
        
        SELECT ac.level + 1, u.superior_id,
               CONCAT(s.firstname, ' ', s.lastname)
        FROM approval_chain ac
        JOIN hots.user u ON ac.approver_id = u.user_id
        LEFT JOIN hots.user s ON u.superior_id = s.user_id
        WHERE u.superior_id IS NOT NULL AND ac.level < 4
    )
    SELECT * FROM approval_chain;
END$$

-- Calculate project progress based on tasks
CREATE PROCEDURE UpdateProjectProgress(IN p_project_id INT)
BEGIN
    DECLARE total_tasks INT DEFAULT 0;
    DECLARE completed_tasks INT DEFAULT 0;
    DECLARE project_progress INT DEFAULT 0;
    
    SELECT COUNT(*) INTO total_tasks
    FROM PM.t_tasks
    WHERE project_id = p_project_id;
    
    SELECT COUNT(*) INTO completed_tasks
    FROM PM.t_tasks
    WHERE project_id = p_project_id AND status = 'completed';
    
    IF total_tasks > 0 THEN
        SET project_progress = ROUND((completed_tasks * 100) / total_tasks);
    END IF;
    
    UPDATE PM.t_project
    SET progress = project_progress,
        updated_date = CURRENT_TIMESTAMP
    WHERE project_id = p_project_id;
END$$

DELIMITER ;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Project summary view with manager and department names
CREATE VIEW PM.v_project_summary AS
SELECT 
    p.project_id,
    p.name,
    p.description,
    p.status,
    p.priority,
    p.budget,
    p.actual_cost,
    p.start_date,
    p.end_date,
    p.progress,
    CONCAT(u.firstname, ' ', u.lastname) AS manager_name,
    d.department_name,
    p.created_date,
    p.updated_date
FROM PM.t_project p
LEFT JOIN hots.user u ON p.manager_id = u.user_id
LEFT JOIN hots.m_department d ON p.department_id = d.department_id;

-- Task summary view with assignee and project names
CREATE VIEW PM.v_task_summary AS
SELECT 
    t.task_id,
    t.name,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    t.progress,
    t.estimated_hours,
    t.actual_hours,
    p.name AS project_name,
    CONCAT(u_assigned.firstname, ' ', u_assigned.lastname) AS assigned_to_name,
    CONCAT(u_created.firstname, ' ', u_created.lastname) AS created_by_name,
    t.created_date,
    t.updated_date
FROM PM.t_tasks t
LEFT JOIN PM.t_project p ON t.project_id = p.project_id
LEFT JOIN hots.user u_assigned ON t.assigned_to = u_assigned.user_id
LEFT JOIN hots.user u_created ON t.created_by = u_created.user_id;

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to application user (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON PM.* TO 'pm_app_user'@'%';
-- GRANT EXECUTE ON PROCEDURE PM.GetApprovalHierarchy TO 'pm_app_user'@'%';
-- GRANT EXECUTE ON PROCEDURE PM.UpdateProjectProgress TO 'pm_app_user'@'%';

-- =====================================================
-- END OF PM DATABASE SCHEMA
-- =====================================================

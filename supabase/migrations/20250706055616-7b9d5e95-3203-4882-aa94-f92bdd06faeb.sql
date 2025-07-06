
-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS t_audit_logs CASCADE;
DROP TABLE IF EXISTS t_custom_configurations CASCADE;
DROP TABLE IF EXISTS t_time_tracking CASCADE;
DROP TABLE IF EXISTS t_task_dependencies CASCADE;
DROP TABLE IF EXISTS t_project_approvals CASCADE;
DROP TABLE IF EXISTS t_task_approvals CASCADE;
DROP TABLE IF EXISTS t_approval_workflows CASCADE;
DROP TABLE IF EXISTS m_custom_attributes CASCADE;
DROP TABLE IF EXISTS m_priority_levels CASCADE;
DROP TABLE IF EXISTS m_status_options CASCADE;
DROP TABLE IF EXISTS m_approval_types CASCADE;
DROP TABLE IF EXISTS m_task_types CASCADE;
DROP TABLE IF EXISTS m_project_types CASCADE;

-- Master Tables (m_ prefix)
CREATE TABLE m_project_types (
    project_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_duration_days INTEGER DEFAULT 30,
    requires_approval BOOLEAN DEFAULT TRUE,
    approval_threshold DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT NOW(),
    updated_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE m_task_types (
    task_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_billable BOOLEAN DEFAULT FALSE,
    is_target_based BOOLEAN DEFAULT FALSE,
    default_estimated_hours INTEGER DEFAULT 8,
    requires_approval BOOLEAN DEFAULT FALSE,
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'task',
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE m_approval_types (
    approval_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_levels INTEGER DEFAULT 3,
    timeout_hours INTEGER DEFAULT 72,
    allows_delegation BOOLEAN DEFAULT TRUE,
    escalation_enabled BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE m_status_options (
    status_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'project', 'task', 'approval'
    status_key VARCHAR(50) NOT NULL,
    status_label VARCHAR(100) NOT NULL,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#6B7280',
    is_final BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE m_priority_levels (
    priority_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level_value INTEGER NOT NULL UNIQUE,
    color_code VARCHAR(7) NOT NULL,
    escalation_hours INTEGER DEFAULT 24,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE m_custom_attributes (
    attribute_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'project', 'task', 'user', 'team'
    data_type VARCHAR(20) NOT NULL, -- 'text', 'number', 'date', 'select', 'multiselect', 'boolean'
    options JSONB, -- For select/multiselect types
    is_required BOOLEAN DEFAULT FALSE,
    default_value TEXT,
    validation_rules JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER,
    created_date TIMESTAMP DEFAULT NOW()
);

-- Transactional Tables (t_ prefix)
CREATE TABLE t_approval_workflows (
    workflow_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'project', 'task', 'user_assignment'
    entity_id INTEGER NOT NULL,
    approval_type_id INTEGER REFERENCES m_approval_types(approval_type_id),
    current_level INTEGER DEFAULT 1,
    max_level INTEGER DEFAULT 3,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    submitted_by INTEGER NOT NULL,
    submitted_date TIMESTAMP DEFAULT NOW(),
    completed_date TIMESTAMP,
    total_time_hours INTEGER,
    rejection_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE t_task_approvals (
    approval_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES t_approval_workflows(workflow_id),
    task_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'delegated'
    comments TEXT,
    approved_date TIMESTAMP,
    delegated_to INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE t_project_approvals (
    approval_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES t_approval_workflows(workflow_id),
    project_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    budget_approved DECIMAL(10,2),
    comments TEXT,
    approved_date TIMESTAMP,
    delegated_to INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE t_task_dependencies (
    dependency_id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    depends_on_task_id INTEGER NOT NULL,
    dependency_type VARCHAR(20) DEFAULT 'finish_to_start', -- 'finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish'
    lag_days INTEGER DEFAULT 0,
    is_critical BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_task_dependency UNIQUE(task_id, depends_on_task_id)
);

CREATE TABLE t_time_tracking (
    entry_id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    description TEXT,
    is_billable BOOLEAN DEFAULT FALSE,
    hourly_rate DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    approved_by INTEGER,
    approved_date TIMESTAMP,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_custom_configurations (
    config_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    attribute_id INTEGER REFERENCES m_custom_attributes(attribute_id),
    value JSONB NOT NULL,
    created_by INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT NOW(),
    updated_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_entity_attribute UNIQUE(entity_type, entity_id, attribute_id)
);

CREATE TABLE t_audit_logs (
    log_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject'
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_date TIMESTAMP DEFAULT NOW()
);

-- Insert default data
INSERT INTO m_project_types (name, description, default_duration_days, approval_threshold) VALUES
('Software Development', 'Standard software development project', 90, 10000),
('Infrastructure', 'IT infrastructure and system projects', 60, 25000),
('Research & Development', 'R&D and innovation projects', 120, 50000),
('Marketing Campaign', 'Marketing and promotional projects', 30, 5000);

INSERT INTO m_task_types (name, description, is_billable, color_code, icon) VALUES
('Development', 'Software development tasks', TRUE, '#10B981', 'code'),
('Testing', 'Quality assurance and testing', TRUE, '#F59E0B', 'bug'),
('Design', 'UI/UX and graphic design', TRUE, '#8B5CF6', 'palette'),
('Documentation', 'Documentation and writing', FALSE, '#6B7280', 'file-text'),
('Meeting', 'Meetings and discussions', FALSE, '#EF4444', 'users'),
('Research', 'Research and analysis', TRUE, '#3B82F6', 'search');

INSERT INTO m_approval_types (name, description, max_levels, timeout_hours) VALUES
('Standard Task Approval', 'Standard task approval workflow', 2, 48),
('Project Budget Approval', 'Project budget approval workflow', 3, 72),
('Resource Assignment', 'Resource assignment approval', 2, 24),
('High Value Approval', 'High value item approval workflow', 4, 96);

INSERT INTO m_status_options (entity_type, status_key, status_label, color_code, is_final) VALUES
('task', 'todo', 'To Do', '#6B7280', FALSE),
('task', 'in-progress', 'In Progress', '#3B82F6', FALSE),
('task', 'review', 'In Review', '#F59E0B', FALSE),
('task', 'done', 'Done', '#10B981', TRUE),
('task', 'blocked', 'Blocked', '#EF4444', FALSE),
('project', 'planning', 'Planning', '#6B7280', FALSE),
('project', 'active', 'Active', '#10B981', FALSE),
('project', 'on-hold', 'On Hold', '#F59E0B', FALSE),
('project', 'completed', 'Completed', '#059669', TRUE),
('project', 'cancelled', 'Cancelled', '#EF4444', TRUE);

INSERT INTO m_priority_levels (name, level_value, color_code, escalation_hours) VALUES
('Low', 1, '#6B7280', 168),
('Medium', 2, '#3B82F6', 72),
('High', 3, '#F59E0B', 24),
('Critical', 4, '#EF4444', 4);

-- Create indexes for performance
CREATE INDEX idx_t_approval_workflows_entity ON t_approval_workflows(entity_type, entity_id);
CREATE INDEX idx_t_approval_workflows_status ON t_approval_workflows(status);
CREATE INDEX idx_t_task_dependencies_task_id ON t_task_dependencies(task_id);
CREATE INDEX idx_t_task_dependencies_depends_on ON t_task_dependencies(depends_on_task_id);
CREATE INDEX idx_t_time_tracking_task_user ON t_time_tracking(task_id, user_id);
CREATE INDEX idx_t_time_tracking_date ON t_time_tracking(start_time);
CREATE INDEX idx_t_custom_configurations_entity ON t_custom_configurations(entity_type, entity_id);
CREATE INDEX idx_t_audit_logs_entity ON t_audit_logs(entity_type, entity_id);
CREATE INDEX idx_t_audit_logs_date ON t_audit_logs(created_date);

-- Create stored procedures for common operations
CREATE OR REPLACE FUNCTION get_approval_hierarchy(p_user_id INTEGER)
RETURNS TABLE(level INTEGER, approver_id INTEGER, approver_name TEXT) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE approval_chain AS (
        -- Start with the user
        SELECT 1 as level, u.superior_id as approver_id, 
               CONCAT(s.firstname, ' ', s.lastname) as approver_name
        FROM pm_users u
        LEFT JOIN pm_users s ON u.superior_id = s.user_id
        WHERE u.user_id = p_user_id AND u.superior_id IS NOT NULL
        
        UNION ALL
        
        -- Recursively get superiors
        SELECT ac.level + 1, u.superior_id,
               CONCAT(s.firstname, ' ', s.lastname)
        FROM approval_chain ac
        JOIN pm_users u ON ac.approver_id = u.user_id
        LEFT JOIN pm_users s ON u.superior_id = s.user_id
        WHERE u.superior_id IS NOT NULL AND ac.level < 4
    )
    SELECT * FROM approval_chain;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_critical_path(p_project_id INTEGER)
RETURNS TABLE(task_id INTEGER, early_start DATE, early_finish DATE, 
              late_start DATE, late_finish DATE, is_critical BOOLEAN) AS $$
BEGIN
    -- This is a simplified critical path calculation
    -- In production, you'd want a more sophisticated algorithm
    RETURN QUERY
    WITH task_durations AS (
        SELECT t.task_id, t.estimated_hours, t.due_date,
               COALESCE(t.due_date - INTERVAL '1 day' * (t.estimated_hours / 8), NOW()::DATE) as calc_start
        FROM pm_tasks t
        WHERE t.project_id = p_project_id
    )
    SELECT td.task_id, td.calc_start, td.due_date, 
           td.calc_start, td.due_date, FALSE as is_critical
    FROM task_durations td;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit logging
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO t_audit_logs (entity_type, entity_id, action, new_values, user_id)
        VALUES (TG_TABLE_NAME, 
                CASE 
                    WHEN TG_TABLE_NAME = 'pm_projects' THEN NEW.project_id
                    WHEN TG_TABLE_NAME = 'pm_tasks' THEN NEW.task_id
                    ELSE 0
                END,
                'create', row_to_json(NEW), 
                COALESCE(NEW.created_by, NEW.manager_id, 1));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO t_audit_logs (entity_type, entity_id, action, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME,
                CASE 
                    WHEN TG_TABLE_NAME = 'pm_projects' THEN NEW.project_id
                    WHEN TG_TABLE_NAME = 'pm_tasks' THEN NEW.task_id
                    ELSE 0
                END,
                'update', row_to_json(OLD), row_to_json(NEW), 1);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO t_audit_logs (entity_type, entity_id, action, old_values, user_id)
        VALUES (TG_TABLE_NAME,
                CASE 
                    WHEN TG_TABLE_NAME = 'pm_projects' THEN OLD.project_id
                    WHEN TG_TABLE_NAME = 'pm_tasks' THEN OLD.task_id
                    ELSE 0
                END,
                'delete', row_to_json(OLD), 1);
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to main tables
CREATE TRIGGER audit_pm_projects AFTER INSERT OR UPDATE OR DELETE ON pm_projects
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_pm_tasks AFTER INSERT OR UPDATE OR DELETE ON pm_tasks
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

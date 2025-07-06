const {
    dbHots,
    dbQueryHots,
    dbPMS,
    // addSqlLogger
} = require('../../config/db');

const { generateTokenHT, hashPasswordHT } = require('../../config/encrypts');

const { hotsForgotPasswordMailer } = require('../../config/mailer');

let yellowTerminal = "\x1b[33m";

module.exports = {

    getProjects: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            console.log(timestamp, `Getting projects for user: ${user_id}`);

            const [projects] = await dbPMS.promise().query(`
                    SELECT 
                        p.*,
                        CONCAT(u.first_name, ' ', u.last_name) as manager_name,
                        d.department_name,
                        (SELECT COUNT(*) FROM t_tasks WHERE project_id = p.project_id) as task_count,
                        (SELECT COUNT(*) FROM t_tasks WHERE project_id = p.project_id AND status = 'done') as completed_tasks,
                        (SELECT COUNT(*) FROM t_project_members WHERE project_id = p.project_id) as member_count
                    FROM t_projects p
                    LEFT JOIN m_users u ON p.manager_id = u.user_id
                    LEFT JOIN m_departments d ON p.department_id = d.department_id
                    WHERE p.is_deleted = 0
                    ORDER BY p.created_date DESC
                `);

            console.log(timestamp, `Retrieved ${projects.length} projects`);

            res.status(200).json({
                success: true,
                message: "Projects retrieved successfully",
                data: projects
            });
        } catch (err) {
            console.log(timestamp, 'Error getting projects:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    createProject: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { name, description, status, priority, start_date, end_date, manager_id, department_id, budget, estimated_hours } = req.body;

            console.log(timestamp, `Creating project: ${name} by user: ${user_id}`);

            const [result] = await dbPMS.promise().query(`
                    INSERT INTO t_projects 
                    (name, description, status, priority, start_date, end_date, manager_id, department_id, budget, estimated_hours, created_by, created_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                `, [name, description, status, priority, start_date, end_date, manager_id, department_id, budget, estimated_hours, user_id]);

            console.log(timestamp, `Project created successfully with ID: ${result.insertId}`);

            res.status(201).json({
                success: true,
                message: "Project created successfully",
                data: { project_id: result.insertId }
            });
        } catch (err) {
            console.log(timestamp, 'Error creating project:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getProjectDetail: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;

            console.log(timestamp, `Getting project detail for ID: ${id}`);

            const [projects] = await dbPMS.promise().query(`
                    SELECT 
                        p.*,
                        CONCAT(u.first_name, ' ', u.last_name) as manager_name,
                        d.department_name,
                        (SELECT COUNT(*) FROM t_tasks WHERE project_id = p.project_id) as task_count,
                        (SELECT COUNT(*) FROM t_tasks WHERE project_id = p.project_id AND status = 'done') as completed_tasks,
                        (SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'user_id', pm.user_id,
                                    'user_name', CONCAT(u2.first_name, ' ', u2.last_name),
                                    'role', pm.role,
                                    'joined_date', pm.joined_date
                                )
                            )
                            FROM t_project_members pm 
                            LEFT JOIN m_users u2 ON pm.user_id = u2.user_id 
                            WHERE pm.project_id = p.project_id
                        ) as members,
                        (SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'group_id', tg.group_id,
                                    'group_name', tg.group_name,
                                    'task_count', (SELECT COUNT(*) FROM t_tasks WHERE group_id = tg.group_id)
                                )
                            )
                            FROM t_task_groups tg 
                            WHERE tg.project_id = p.project_id
                        ) as task_groups
                    FROM t_projects p
                    LEFT JOIN m_users u ON p.manager_id = u.user_id
                    LEFT JOIN m_departments d ON p.department_id = d.department_id
                    WHERE p.project_id = ? AND p.is_deleted = 0
                `, [id]);

            if (projects.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found"
                });
            }

            console.log(timestamp, `Project detail retrieved for ID: ${id}`);

            res.status(200).json({
                success: true,
                message: "Project detail retrieved successfully",
                data: projects[0]
            });
        } catch (err) {
            console.log(timestamp, 'Error getting project detail:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    updateProject: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;
            const { name, description, status, priority, start_date, end_date, manager_id, department_id, budget, estimated_hours } = req.body;

            console.log(timestamp, `Updating project ID: ${id} by user: ${user_id}`);

            const [result] = await dbPMS.promise().query(`
                    UPDATE t_projects 
                    SET name = ?, description = ?, status = ?, priority = ?, start_date = ?, end_date = ?, 
                        manager_id = ?, department_id = ?, budget = ?, estimated_hours = ?, updated_date = NOW()
                    WHERE project_id = ?
                `, [name, description, status, priority, start_date, end_date, manager_id, department_id, budget, estimated_hours, id]);

            console.log(timestamp, `Project updated successfully: ${id}`);

            res.status(200).json({
                success: true,
                message: "Project updated successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error updating project:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    deleteProject: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;

            console.log(timestamp, `Deleting project ID: ${id} by user: ${user_id}`);

            const [result] = await dbPMS.promise().query(`
                    UPDATE t_projects 
                    SET is_deleted = 1, updated_date = NOW()
                    WHERE project_id = ?
                `, [id]);

            console.log(timestamp, `Project deleted successfully: ${id}`);

            res.status(200).json({
                success: true,
                message: "Project deleted successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error deleting project:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Task Groups Management
    getTaskGroups: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { projectId } = req.params;

            console.log(timestamp, `Getting task groups for project: ${projectId}`);

            const [groups] = await dbPMS.promise().query(`
                    SELECT 
                        tg.*,
                        (SELECT COUNT(*) FROM t_tasks WHERE group_id = tg.group_id) as task_count,
                        (SELECT COUNT(*) FROM t_tasks WHERE group_id = tg.group_id AND status = 'done') as completed_tasks
                    FROM t_task_groups tg
                    WHERE tg.project_id = ? AND tg.is_deleted = 0
                    ORDER BY tg.created_date ASC
                `, [projectId]);

            console.log(timestamp, `Retrieved ${groups.length} task groups`);

            res.status(200).json({
                success: true,
                message: "Task groups retrieved successfully",
                data: groups
            });
        } catch (err) {
            console.log(timestamp, 'Error getting task groups:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    createTaskGroup: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { project_id, group_name, description, color } = req.body;

            console.log(timestamp, `Creating task group: ${group_name} for project: ${project_id}`);

            const [result] = await dbPMS.promise().query(`
                    INSERT INTO t_task_groups 
                    (project_id, group_name, description, color, created_by, created_date)
                    VALUES (?, ?, ?, ?, ?, NOW())
                `, [project_id, group_name, description, color, user_id]);

            console.log(timestamp, `Task group created successfully with ID: ${result.insertId}`);

            res.status(201).json({
                success: true,
                message: "Task group created successfully",
                data: { group_id: result.insertId }
            });
        } catch (err) {
            console.log(timestamp, 'Error creating task group:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    updateTaskGroup: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;
            const { group_name, description, color } = req.body;

            console.log(timestamp, `Updating task group ID: ${id} by user: ${user_id}`);

            const [result] = await dbPMS.promise().query(`
                    UPDATE t_task_groups 
                    SET group_name = ?, description = ?, color = ?, updated_date = NOW()
                    WHERE group_id = ?
                `, [group_name, description, color, id]);

            console.log(timestamp, `Task group updated successfully: ${id}`);

            res.status(200).json({
                success: true,
                message: "Task group updated successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error updating task group:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    deleteTaskGroup: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;

            console.log(timestamp, `Deleting task group ID: ${id} by user: ${user_id}`);

            // First, move all tasks in this group to ungrouped (group_id = NULL)
            await dbPMS.promise().query(`
                    UPDATE t_tasks 
                    SET group_id = NULL, updated_date = NOW()
                    WHERE group_id = ?
                `, [id]);

            // Then soft delete the group
            const [result] = await dbPMS.promise().query(`
                    UPDATE t_task_groups 
                    SET is_deleted = 1, updated_date = NOW()
                    WHERE group_id = ?
                `, [id]);

            console.log(timestamp, `Task group deleted successfully: ${id}`);

            res.status(200).json({
                success: true,
                message: "Task group deleted successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error deleting task group:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getProjectMembers: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { projectId } = req.params;

        try {
            const [members] = await dbPM.promise().query(`
                SELECT 
                    pm.member_id, pm.project_id, pm.user_id, pm.role, pm.permissions,
                    pm.joined_date, pm.left_date, pm.is_active,
                    u.firstname, u.lastname, u.email, u.avatar_url,
                    CONCAT(u.firstname, ' ', u.lastname) as user_name
                FROM pm_project_members pm
                JOIN pm_users u ON pm.user_id = u.user_id
                WHERE pm.project_id = ? AND pm.is_active = 1
                ORDER BY pm.joined_date ASC
            `, [projectId]);

            console.log(`${timestamp}Get project members success for project ${projectId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: members,
                message: "Project members retrieved successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    addProjectMember: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { projectId } = req.params;
        const { user_id: memberId, role, permissions } = req.body;

        try {
            await dbPM.promise().query(`
                INSERT INTO pm_project_members 
                (project_id, user_id, role, permissions, joined_date, is_active, created_by, created_date)
                VALUES (?, ?, ?, ?, NOW(), 1, ?, NOW())
            `, [projectId, memberId, role, JSON.stringify(permissions), user_id]);

            console.log(`${timestamp}Add project member success for project ${projectId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Project member added successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    updateProjectMember: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { memberId } = req.params;
        const { role, permissions } = req.body;

        try {
            await dbPM.promise().query(`
                UPDATE pm_project_members 
                SET role = ?, permissions = ?, updated_date = NOW()
                WHERE member_id = ?
            `, [role, JSON.stringify(permissions), memberId]);

            console.log(`${timestamp}Update project member success for member ${memberId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Project member updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    removeProjectMember: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { memberId } = req.params;

        try {
            await dbPM.promise().query(`
                UPDATE pm_project_members 
                SET is_active = 0, left_date = NOW(), updated_date = NOW()
                WHERE member_id = ?
            `, [memberId]);

            console.log(`${timestamp}Remove project member success for member ${memberId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Project member removed successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },
    getProjectTasks: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { projectId } = req.params;

        try {
            const [tasks] = await dbPM.promise().query(`
                SELECT 
                    t.*, 
                    tg.group_name,
                    CONCAT(u1.firstname, ' ', u1.lastname) as assigned_to_name,
                    CONCAT(u2.firstname, ' ', u2.lastname) as created_by_name,
                    p.name as project_name
                FROM pm_tasks t
                LEFT JOIN pm_task_groups tg ON t.group_id = tg.group_id
                LEFT JOIN pm_users u1 ON t.assigned_to = u1.user_id
                LEFT JOIN pm_users u2 ON t.created_by = u2.user_id
                LEFT JOIN pm_projects p ON t.project_id = p.project_id
                WHERE t.project_id = ? AND t.is_active = 1
                ORDER BY t.created_date DESC
            `, [projectId]);

            console.log(`${timestamp}Get project tasks success for project ${projectId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: tasks,
                message: "Project tasks retrieved successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getKanbanData: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { projectId } = req.params;

        try {
            const [columns] = await dbPM.promise().query(`
                SELECT * FROM pm_kanban_columns 
                WHERE project_id = ? OR project_id IS NULL
                ORDER BY column_order ASC
            `, [projectId]);

            const [tasks] = await dbPM.promise().query(`
                SELECT 
                    t.*, 
                    tg.group_name,
                    CONCAT(u1.firstname, ' ', u1.lastname) as assigned_to_name,
                    CONCAT(u2.firstname, ' ', u2.lastname) as created_by_name
                FROM pm_tasks t
                LEFT JOIN pm_task_groups tg ON t.group_id = tg.group_id
                LEFT JOIN pm_users u1 ON t.assigned_to = u1.user_id
                LEFT JOIN pm_users u2 ON t.created_by = u2.user_id
                WHERE t.project_id = ? AND t.is_active = 1
                ORDER BY t.kanban_order ASC
            `, [projectId]);

            console.log(`${timestamp}Get kanban data success for project ${projectId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: {
                    columns: columns,
                    tasks: tasks
                },
                message: "Kanban data retrieved successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getGanttData: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { projectId } = req.params;

        try {
            const [tasks] = await dbPM.promise().query(`
                SELECT 
                    t.task_id, t.name, t.description, t.status, t.priority,
                    t.start_date, t.due_date, t.estimated_hours, t.actual_hours,
                    t.progress, t.is_milestone, t.parent_task_id,
                    tg.group_name,
                    CONCAT(u1.firstname, ' ', u1.lastname) as assigned_to_name
                FROM pm_tasks t
                LEFT JOIN pm_task_groups tg ON t.group_id = tg.group_id
                LEFT JOIN pm_users u1 ON t.assigned_to = u1.user_id
                WHERE t.project_id = ? AND t.is_active = 1
                ORDER BY t.start_date ASC, t.gantt_order ASC
            `, [projectId]);

            const [dependencies] = await dbPM.promise().query(`
                SELECT td.*, t1.name as task_name, t2.name as dependency_name
                FROM pm_task_dependencies td
                JOIN pm_tasks t1 ON td.task_id = t1.task_id
                JOIN pm_tasks t2 ON td.dependency_task_id = t2.task_id
                WHERE t1.project_id = ?
            `, [projectId]);

            console.log(`${timestamp}Get gantt data success for project ${projectId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: {
                    tasks: tasks,
                    dependencies: dependencies
                },
                message: "Gantt data retrieved successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },
    getChatMessages: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { projectId } = req.params;
        const { taskId, limit = 50, offset = 0 } = req.query;

        try {
            let query = `
                SELECT 
                    cm.*, 
                    CONCAT(u.firstname, ' ', u.lastname) as user_name,
                    u.avatar_url,
                    reply_to_msg.message as reply_to_message,
                    CONCAT(reply_user.firstname, ' ', reply_user.lastname) as reply_to_user_name
                FROM pm_chat_messages cm
                JOIN pm_users u ON cm.user_id = u.user_id
                LEFT JOIN pm_chat_messages reply_to_msg ON cm.reply_to = reply_to_msg.message_id
                LEFT JOIN pm_users reply_user ON reply_to_msg.user_id = reply_user.user_id
                WHERE cm.project_id = ?
            `;

            let params = [projectId];

            if (taskId) {
                query += ` AND cm.task_id = ?`;
                params.push(taskId);
            } else {
                query += ` AND cm.task_id IS NULL`;
            }

            query += ` ORDER BY cm.created_date DESC LIMIT ? OFFSET ?`;
            params.push(parseInt(limit), parseInt(offset));

            const [messages] = await dbPM.promise().query(query, params);

            console.log(`${timestamp}Get chat messages success for project ${projectId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: messages.reverse(), // Reverse to show oldest first
                message: "Chat messages retrieved successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    sendMessage: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { projectId } = req.params;
        const { message, task_id, message_type = 'text', file_url, file_name, reply_to } = req.body;

        try {
            const [result] = await dbPM.promise().query(`
                INSERT INTO pm_chat_messages 
                (project_id, task_id, user_id, message, message_type, file_url, file_name, reply_to, created_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [projectId, task_id || null, user_id, message, message_type, file_url || null, file_name || null, reply_to || null]);

            // Get the inserted message with user details
            const [newMessage] = await dbPM.promise().query(`
                SELECT 
                    cm.*, 
                    CONCAT(u.firstname, ' ', u.lastname) as user_name,
                    u.avatar_url
                FROM pm_chat_messages cm
                JOIN pm_users u ON cm.user_id = u.user_id
                WHERE cm.message_id = ?
            `, [result.insertId]);

            console.log(`${timestamp}Send message success for project ${projectId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: newMessage[0],
                message: "Message sent successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },


};

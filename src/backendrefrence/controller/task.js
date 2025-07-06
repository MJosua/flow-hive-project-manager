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

    getAllTasks: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            console.log(timestamp, `Getting all tasks for user: ${user_id}`);

            const [tasks] = await dbPMS.promise().query(`
                SELECT 
                    t.*,
                    p.name as project_name,
                    CONCAT(ua.first_name, ' ', ua.last_name) as assigned_to_name,
                    CONCAT(uc.first_name, ' ', uc.last_name) as created_by_name,
                    tg.group_name,
                    tg.color as group_color
                FROM t_tasks t
                LEFT JOIN t_projects p ON t.project_id = p.project_id
                LEFT JOIN m_users ua ON t.assigned_to = ua.user_id
                LEFT JOIN m_users uc ON t.created_by = uc.user_id
                LEFT JOIN t_task_groups tg ON t.group_id = tg.group_id
                WHERE t.is_deleted = 0
                ORDER BY t.created_date DESC
            `);

            console.log(timestamp, `Retrieved ${tasks.length} tasks`);

            res.status(200).json({
                success: true,
                message: "Tasks retrieved successfully",
                data: tasks
            });
        } catch (err) {
            console.log(timestamp, 'Error getting tasks:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getMyTasks: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            console.log(timestamp, `Getting my tasks for user: ${user_id}`);

            const [tasks] = await dbPMS.promise().query(`
                SELECT 
                    t.*,
                    p.name as project_name,
                    CONCAT(ua.first_name, ' ', ua.last_name) as assigned_to_name,
                    CONCAT(uc.first_name, ' ', uc.last_name) as created_by_name,
                    tg.group_name,
                    tg.color as group_color
                FROM t_tasks t
                LEFT JOIN t_projects p ON t.project_id = p.project_id
                LEFT JOIN m_users ua ON t.assigned_to = ua.user_id
                LEFT JOIN m_users uc ON t.created_by = uc.user_id
                LEFT JOIN t_task_groups tg ON t.group_id = tg.group_id
                WHERE t.assigned_to = ? AND t.is_deleted = 0
                ORDER BY t.due_date ASC, t.priority DESC
            `, [user_id]);

            console.log(timestamp, `Retrieved ${tasks.length} my tasks`);

            res.status(200).json({
                success: true,
                message: "My tasks retrieved successfully",
                data: tasks
            });
        } catch (err) {
            console.log(timestamp, 'Error getting my tasks:', err.message);
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

        try {
            const { projectId } = req.params;

            console.log(timestamp, `Getting tasks for project: ${projectId}`);

            const [tasks] = await dbPMS.promise().query(`
                SELECT 
                    t.*,
                    p.name as project_name,
                    CONCAT(ua.first_name, ' ', ua.last_name) as assigned_to_name,
                    CONCAT(uc.first_name, ' ', uc.last_name) as created_by_name,
                    tg.group_name,
                    tg.color as group_color
                FROM t_tasks t
                LEFT JOIN t_projects p ON t.project_id = p.project_id
                LEFT JOIN m_users ua ON t.assigned_to = ua.user_id
                LEFT JOIN m_users uc ON t.created_by = uc.user_id
                LEFT JOIN t_task_groups tg ON t.group_id = tg.group_id
                WHERE t.project_id = ? AND t.is_deleted = 0
                ORDER BY tg.group_name, t.created_date DESC
            `, [projectId]);

            console.log(timestamp, `Retrieved ${tasks.length} tasks for project: ${projectId}`);

            res.status(200).json({
                success: true,
                message: "Project tasks retrieved successfully",
                data: tasks
            });
        } catch (err) {
            console.log(timestamp, 'Error getting project tasks:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    createTask: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { project_id, group_id, name, description, status, priority, assigned_to, due_date, estimated_hours, tags, custom_attributes } = req.body;

            console.log(timestamp, `Creating task: ${name} by user: ${user_id}`);

            const [result] = await dbPMS.promise().query(`
                INSERT INTO t_tasks 
                (project_id, group_id, name, description, status, priority, assigned_to, created_by, due_date, estimated_hours, tags, custom_attributes, created_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [project_id, group_id, name, description, status, priority, assigned_to, user_id, due_date, estimated_hours, JSON.stringify(tags), JSON.stringify(custom_attributes)]);

            console.log(timestamp, `Task created successfully with ID: ${result.insertId}`);

            res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: { task_id: result.insertId }
            });
        } catch (err) {
            console.log(timestamp, 'Error creating task:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getTaskDetail: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;

            console.log(timestamp, `Getting task detail for ID: ${id}`);

            const [tasks] = await dbPMS.promise().query(`
                SELECT 
                    t.*,
                    p.name as project_name,
                    CONCAT(ua.first_name, ' ', ua.last_name) as assigned_to_name,
                    CONCAT(uc.first_name, ' ', uc.last_name) as created_by_name,
                    tg.group_name,
                    tg.color as group_color,
                    (SELECT 
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'attachment_id', a.attachment_id,
                                'file_name', a.file_name,
                                'file_url', a.file_url,
                                'file_size', a.file_size,
                                'uploaded_date', a.uploaded_date
                            )
                        )
                        FROM t_task_attachments a 
                        WHERE a.task_id = t.task_id
                    ) as attachments,
                    (SELECT 
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'log_id', tl.log_id,
                                'hours_logged', tl.hours_logged,
                                'description', tl.description,
                                'log_date', tl.log_date,
                                'user_name', CONCAT(u.first_name, ' ', u.last_name)
                            )
                        )
                        FROM t_task_time_logs tl 
                        LEFT JOIN m_users u ON tl.user_id = u.user_id
                        WHERE tl.task_id = t.task_id
                    ) as time_logs
                FROM t_tasks t
                LEFT JOIN t_projects p ON t.project_id = p.project_id
                LEFT JOIN m_users ua ON t.assigned_to = ua.user_id
                LEFT JOIN m_users uc ON t.created_by = uc.user_id
                LEFT JOIN t_task_groups tg ON t.group_id = tg.group_id
                WHERE t.task_id = ? AND t.is_deleted = 0
            `, [id]);

            if (tasks.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }

            console.log(timestamp, `Task detail retrieved for ID: ${id}`);

            res.status(200).json({
                success: true,
                message: "Task detail retrieved successfully",
                data: tasks[0]
            });
        } catch (err) {
            console.log(timestamp, 'Error getting task detail:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    updateTask: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;
            const { group_id, name, description, status, priority, assigned_to, due_date, estimated_hours, tags, custom_attributes } = req.body;

            console.log(timestamp, `Updating task ID: ${id} by user: ${user_id}`);

            const [result] = await dbPMS.promise().query(`
                UPDATE t_tasks 
                SET group_id = ?, name = ?, description = ?, status = ?, priority = ?, assigned_to = ?, 
                    due_date = ?, estimated_hours = ?, tags = ?, custom_attributes = ?, updated_date = NOW()
                WHERE task_id = ?
            `, [group_id, name, description, status, priority, assigned_to, due_date, estimated_hours, JSON.stringify(tags), JSON.stringify(custom_attributes), id]);

            console.log(timestamp, `Task updated successfully: ${id}`);

            res.status(200).json({
                success: true,
                message: "Task updated successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error updating task:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    updateTaskStatus: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;
            const { status } = req.body;

            console.log(timestamp, `Updating task status for ID: ${id} to: ${status}`);

            const [result] = await dbPMS.promise().query(`
                UPDATE t_tasks 
                SET status = ?, updated_date = NOW()
                WHERE task_id = ?
            `, [status, id]);

            console.log(timestamp, `Task status updated successfully: ${id}`);

            res.status(200).json({
                success: true,
                message: "Task status updated successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error updating task status:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    deleteTask: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { id } = req.params;

            console.log(timestamp, `Deleting task ID: ${id} by user: ${user_id}`);

            const [result] = await dbPMS.promise().query(`
                UPDATE t_tasks 
                SET is_deleted = 1, updated_date = NOW()
                WHERE task_id = ?
            `, [id]);

            console.log(timestamp, `Task deleted successfully: ${id}`);

            res.status(200).json({
                success: true,
                message: "Task deleted successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error deleting task:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Time logging
    logTime: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const { task_id, hours_logged, description } = req.body;

            console.log(timestamp, `Logging ${hours_logged} hours for task: ${task_id}`);

            const [result] = await dbPMS.promise().query(`
                INSERT INTO t_task_time_logs 
                (task_id, user_id, hours_logged, description, log_date)
                VALUES (?, ?, ?, ?, NOW())
            `, [task_id, user_id, hours_logged, description]);

            // Update actual hours in task
            await dbPMS.promise().query(`
                UPDATE t_tasks 
                SET actual_hours = COALESCE(actual_hours, 0) + ?, updated_date = NOW()
                WHERE task_id = ?
            `, [hours_logged, task_id]);

            console.log(timestamp, `Time logged successfully for task: ${task_id}`);

            res.status(201).json({
                success: true,
                message: "Time logged successfully"
            });
        } catch (err) {
            console.log(timestamp, 'Error logging time:', err.message);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    moveTaskToGroup: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { taskId } = req.params;
        const { group_id } = req.body;

        try {
            await dbPM.promise().query(`
                UPDATE pm_tasks 
                SET group_id = ?, updated_date = NOW()
                WHERE task_id = ?
            `, [group_id, taskId]);

            console.log(`${timestamp}Task moved to group success for task ${taskId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Task moved to group successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Get task dependencies
    getTaskDependencies: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { taskId } = req.params;

        try {
            const [result] = await dbPM.promise().query(`
                SELECT td.*, t.name as dependency_task_name, t.status as dependency_status
                FROM pm_task_dependencies td
                JOIN pm_tasks t ON td.dependency_task_id = t.task_id
                WHERE td.task_id = ?
                ORDER BY td.created_date
            `, [taskId]);

            console.log(`${timestamp}Task dependencies fetch success for task ${taskId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Add task dependency
    addTaskDependency: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { task_id, dependency_task_id, dependency_type } = req.body;

        try {
            await dbPM.promise().query(`
                INSERT INTO pm_task_dependencies 
                (task_id, dependency_task_id, dependency_type, created_by, created_date)
                VALUES (?, ?, ?, ?, NOW())
            `, [task_id, dependency_task_id, dependency_type, user_id]);

            console.log(`${timestamp}Task dependency added success by ${user_id}`);

            res.status(201).json({
                success: true,
                message: "Task dependency added successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Remove task dependency
    removeTaskDependency: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { dependencyId } = req.params;

        try {
            await dbPM.promise().query(`
                DELETE FROM pm_task_dependencies WHERE dependency_id = ?
            `, [dependencyId]);

            console.log(`${timestamp}Task dependency removal success for ${dependencyId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Task dependency removed successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Get time entries
    getTimeEntries: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { taskId } = req.params;

        try {
            const [result] = await dbPM.promise().query(`
                SELECT te.*, CONCAT(u.firstname, ' ', u.lastname) as user_name
                FROM pm_time_entries te
                JOIN pm_users u ON te.user_id = u.user_id
                WHERE te.task_id = ?
                ORDER BY te.start_time DESC
            `, [taskId]);

            console.log(`${timestamp}Time entries fetch success for task ${taskId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Update time entry
    updateTimeEntry: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { entryId } = req.params;
        const { start_time, end_time, description, hours_logged } = req.body;

        try {
            await dbPM.promise().query(`
                UPDATE pm_time_entries 
                SET start_time = ?, end_time = ?, description = ?, hours_logged = ?, updated_date = NOW()
                WHERE entry_id = ? AND user_id = ?
            `, [start_time, end_time, description, hours_logged, entryId, user_id]);

            console.log(`${timestamp}Time entry update success for ${entryId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Time entry updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Delete time entry
    deleteTimeEntry: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { entryId } = req.params;

        try {
            await dbPM.promise().query(`
                DELETE FROM pm_time_entries WHERE entry_id = ? AND user_id = ?
            `, [entryId, user_id]);

            console.log(`${timestamp}Time entry deletion success for ${entryId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Time entry deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Get task attachments
    getTaskAttachments: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { taskId } = req.params;

        try {
            const [result] = await dbPM.promise().query(`
                SELECT ta.*, CONCAT(u.firstname, ' ', u.lastname) as uploaded_by_name
                FROM pm_task_attachments ta
                JOIN pm_users u ON ta.uploaded_by = u.user_id
                WHERE ta.task_id = ?
                ORDER BY ta.uploaded_date DESC
            `, [taskId]);

            console.log(`${timestamp}Task attachments fetch success for task ${taskId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Upload attachment
    uploadAttachment: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { taskId } = req.params;
        const { file_name, file_path, file_size, file_type } = req.body;

        try {
            await dbPM.promise().query(`
                INSERT INTO pm_task_attachments 
                (task_id, file_name, file_path, file_size, file_type, uploaded_by, uploaded_date)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `, [taskId, file_name, file_path, file_size, file_type, user_id]);

            console.log(`${timestamp}Attachment upload success for task ${taskId} by ${user_id}`);

            res.status(201).json({
                success: true,
                message: "Attachment uploaded successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Delete attachment
    deleteAttachment: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { attachmentId } = req.params;

        try {
            await dbPM.promise().query(`
                DELETE FROM pm_task_attachments WHERE attachment_id = ? AND uploaded_by = ?
            `, [attachmentId, user_id]);

            console.log(`${timestamp}Attachment deletion success for ${attachmentId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Attachment deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },


};

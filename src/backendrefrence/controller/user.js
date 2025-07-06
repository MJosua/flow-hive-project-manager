const {
    dbHots,
    dbQueryHots,
    dbPMS,
    // addSqlLogger
} = require('../../config/db');

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const yellowTerminal = '\x1b[33m';

/**
 * Custom Function Controller
 * Base Path: /hots_settings/custom_functions/
 */

module.exports = {
    getUsers: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const [users] = await dbPMS.promise().query(`
            SELECT u.user_id, u.email, u.full_name, u.role_id, u.department_id, u.is_active, u.created_date,
                   r.role_name, d.department_name
            FROM m_users u
            LEFT JOIN m_roles r ON u.role_id = r.role_id
            LEFT JOIN m_departments d ON u.department_id = d.department_id
            ORDER BY u.full_name ASC
        `);

            console.log(`${timestamp}Get users success from user ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                data: users
            });
        } catch (err) {
            console.log(`${timestamp}Get users error: ${err.message}`);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    createUser: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { email, password, full_name, role_id, department_id } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await dbPMS.promise().query(`
            INSERT INTO m_users 
            (email, password, full_name, role_id, department_id, created_by, created_date, is_active)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
        `, [email, hashedPassword, full_name, role_id, department_id, user_id]);

            console.log(`${timestamp}Create user success from user ${user_id}`);

            res.status(200).json({
                success: true,
                message: "User created successfully",
                data: { user_id: result.insertId }
            });
        } catch (err) {
            console.log(`${timestamp}Create user error: ${err.message}`);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getDepartments: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const [departments] = await dbPMS.promise().query(`
            SELECT d.*, u.full_name as created_by_name,
                   (SELECT COUNT(*) FROM m_users WHERE department_id = d.department_id AND is_active = 1) as user_count
            FROM m_departments d
            LEFT JOIN m_users u ON d.created_by = u.user_id
            WHERE d.is_active = 1
            ORDER BY d.department_name ASC
        `);

            console.log(`${timestamp}Get departments success from user ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Departments retrieved successfully",
                data: departments
            });
        } catch (err) {
            console.log(`${timestamp}Get departments error: ${err.message}`);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    createDepartment: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { department_name, description } = req.body;

        try {
            const [result] = await dbPMS.promise().query(`
            INSERT INTO m_departments 
            (department_name, description, created_by, created_date, is_active)
            VALUES (?, ?, ?, NOW(), 1)
        `, [department_name, description, user_id]);

            console.log(`${timestamp}Create department success from user ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Department created successfully",
                data: { department_id: result.insertId }
            });
        } catch (err) {
            console.log(`${timestamp}Create department error: ${err.message}`);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },


    getUserDetail: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { userId } = req.params;

        try {
            const [result] = await dbPM.promise().query(`
                SELECT u.*, r.role_name, d.department_name, t.team_name, j.job_title,
                       s.firstname as superior_firstname, s.lastname as superior_lastname
                FROM pm_users u
                LEFT JOIN pm_roles r ON u.role_id = r.role_id
                LEFT JOIN pm_departments d ON u.department_id = d.department_id
                LEFT JOIN pm_teams t ON u.team_id = t.team_id
                LEFT JOIN pm_job_titles j ON u.jobtitle_id = j.jobtitle_id
                LEFT JOIN pm_users s ON u.superior_id = s.user_id
                WHERE u.user_id = ? AND u.is_deleted = 0
            `, [userId]);

            console.log(`${timestamp}User detail fetch success for ${userId} by ${user_id}`);

            res.status(200).json({
                success: true,
                data: result[0] || null
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Update user
    updateUser: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { userId } = req.params;
        const { firstname, lastname, email, role_id, department_id, team_id, jobtitle_id, superior_id, is_active } = req.body;

        try {
            await dbPM.promise().query(`
                UPDATE pm_users 
                SET firstname = ?, lastname = ?, email = ?, role_id = ?, department_id = ?, 
                    team_id = ?, jobtitle_id = ?, superior_id = ?, is_active = ?, updated_date = NOW()
                WHERE user_id = ?
            `, [firstname, lastname, email, role_id, department_id, team_id, jobtitle_id, superior_id, is_active, userId]);

            console.log(`${timestamp}User update success for ${userId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "User updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { userId } = req.params;

        try {
            await dbPM.promise().query(`
                UPDATE pm_users SET is_deleted = 1, finished_date = NOW() WHERE user_id = ?
            `, [userId]);

            console.log(`${timestamp}User deletion success for ${userId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Get teams
    getTeams: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;

        try {
            const [result] = await dbPM.promise().query(`
                SELECT t.*, d.department_name,
                       COUNT(u.user_id) as member_count,
                       CONCAT(l.firstname, ' ', l.lastname) as leader_name
                FROM pm_teams t
                LEFT JOIN pm_departments d ON t.department_id = d.department_id
                LEFT JOIN pm_users u ON t.team_id = u.team_id AND u.is_deleted = 0
                LEFT JOIN pm_users l ON t.team_leader_id = l.user_id
                WHERE t.is_deleted = 0
                GROUP BY t.team_id
                ORDER BY t.team_name
            `);

            console.log(`${timestamp}Teams fetch success by ${user_id}`);

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

    // Create team
    createTeam: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { team_name, department_id, team_leader_id, description } = req.body;

        try {
            await dbPM.promise().query(`
                INSERT INTO pm_teams 
                (team_name, department_id, team_leader_id, description, created_by, created_date)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [team_name, department_id, team_leader_id, description, user_id]);

            console.log(`${timestamp}Team creation success by ${user_id}`);

            res.status(201).json({
                success: true,
                message: "Team created successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Update team
    updateTeam: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { teamId } = req.params;
        const { team_name, department_id, team_leader_id, description } = req.body;

        try {
            await dbPM.promise().query(`
                UPDATE pm_teams 
                SET team_name = ?, department_id = ?, team_leader_id = ?, description = ?, updated_date = NOW()
                WHERE team_id = ?
            `, [team_name, department_id, team_leader_id, description, teamId]);

            console.log(`${timestamp}Team update success for ${teamId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Team updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Delete team
    deleteTeam: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { teamId } = req.params;

        try {
            await dbPM.promise().query(`
                UPDATE pm_teams SET is_deleted = 1, finished_date = NOW() WHERE team_id = ?
            `, [teamId]);

            console.log(`${timestamp}Team deletion success for ${teamId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Team deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Update department
    updateDepartment: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { departmentId } = req.params;
        const { department_name, department_shortname, department_head, description } = req.body;

        try {
            await dbPM.promise().query(`
                UPDATE pm_departments 
                SET department_name = ?, department_shortname = ?, department_head = ?, description = ?, updated_date = NOW()
                WHERE department_id = ?
            `, [department_name, department_shortname, department_head, description, departmentId]);

            console.log(`${timestamp}Department update success for ${departmentId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Department updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // Delete department
    deleteDepartment: async (req, res) => {
        let date = new Date();
        let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';
        let user_id = req.dataToken.user_id;
        const { departmentId } = req.params;

        try {
            await dbPM.promise().query(`
                UPDATE pm_departments SET is_deleted = 1, finished_date = NOW() WHERE department_id = ?
            `, [departmentId]);

            console.log(`${timestamp}Department deletion success for ${departmentId} by ${user_id}`);

            res.status(200).json({
                success: true,
                message: "Department deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },



}
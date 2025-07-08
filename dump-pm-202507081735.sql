-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 172.16.32.20    Database: pm
-- ------------------------------------------------------
-- Server version	5.7.44-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `m_approval_types`
--

DROP TABLE IF EXISTS `m_approval_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_approval_types` (
  `approval_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `max_levels` int(11) DEFAULT '3',
  `timeout_hours` int(11) DEFAULT '72',
  `escalation_enabled` tinyint(1) DEFAULT '1',
  `allows_delegation` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`approval_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_approval_types`
--

LOCK TABLES `m_approval_types` WRITE;
/*!40000 ALTER TABLE `m_approval_types` DISABLE KEYS */;
INSERT INTO `m_approval_types` VALUES (1,'Task Approval','Standard task approval workflow',2,72,1,1,1,'2025-07-07 14:31:49'),(2,'Project Approval','Project creation and budget approval',3,72,1,1,1,'2025-07-07 14:31:49'),(3,'Budget Change','Budget modification approval',2,72,1,1,1,'2025-07-07 14:31:49');
/*!40000 ALTER TABLE `m_approval_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_custom_attributes`
--

DROP TABLE IF EXISTS `m_custom_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_custom_attributes` (
  `attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `entity_type` varchar(20) NOT NULL,
  `data_type` varchar(20) NOT NULL,
  `options` json DEFAULT NULL,
  `default_value` text,
  `is_required` tinyint(1) DEFAULT '0',
  `validation_rules` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attribute_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `m_custom_attributes_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_custom_attributes`
--

LOCK TABLES `m_custom_attributes` WRITE;
/*!40000 ALTER TABLE `m_custom_attributes` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_custom_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_priority_levels`
--

DROP TABLE IF EXISTS `m_priority_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_priority_levels` (
  `priority_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `level_value` int(11) NOT NULL,
  `color_code` varchar(7) NOT NULL,
  `escalation_hours` int(11) DEFAULT '24',
  `is_active` tinyint(1) DEFAULT '1',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`priority_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_priority_levels`
--

LOCK TABLES `m_priority_levels` WRITE;
/*!40000 ALTER TABLE `m_priority_levels` DISABLE KEYS */;
INSERT INTO `m_priority_levels` VALUES (1,'Low',1,'#6B7280',72,1,'2025-07-07 14:31:50'),(2,'Medium',2,'#3B82F6',48,1,'2025-07-07 14:31:50'),(3,'High',3,'#F59E0B',24,1,'2025-07-07 14:31:50'),(4,'Critical',4,'#EF4444',8,1,'2025-07-07 14:31:50');
/*!40000 ALTER TABLE `m_priority_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_project_types`
--

DROP TABLE IF EXISTS `m_project_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_project_types` (
  `project_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `default_duration_days` int(11) DEFAULT '30',
  `requires_approval` tinyint(1) DEFAULT '1',
  `approval_threshold` decimal(15,2) DEFAULT '0.00',
  `is_active` tinyint(1) DEFAULT '1',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_project_types`
--

LOCK TABLES `m_project_types` WRITE;
/*!40000 ALTER TABLE `m_project_types` DISABLE KEYS */;
INSERT INTO `m_project_types` VALUES (1,'Software Development','Software development projects',90,1,50000.00,1,'2025-07-07 14:31:53','2025-07-07 14:31:53'),(2,'Infrastructure','IT infrastructure projects',60,1,100000.00,1,'2025-07-07 14:31:53','2025-07-07 14:31:53'),(3,'Marketing Campaign','Marketing and promotional campaigns',30,0,10000.00,1,'2025-07-07 14:31:53','2025-07-07 14:31:53'),(4,'Research & Development','R&D and innovation projects',120,1,75000.00,1,'2025-07-07 14:31:53','2025-07-07 14:31:53');
/*!40000 ALTER TABLE `m_project_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_status_options`
--

DROP TABLE IF EXISTS `m_status_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_status_options` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(20) NOT NULL,
  `status_key` varchar(50) NOT NULL,
  `status_label` varchar(100) NOT NULL,
  `description` text,
  `color_code` varchar(7) DEFAULT '#6B7280',
  `sort_order` int(11) DEFAULT '0',
  `is_final` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_status_options`
--

LOCK TABLES `m_status_options` WRITE;
/*!40000 ALTER TABLE `m_status_options` DISABLE KEYS */;
INSERT INTO `m_status_options` VALUES (1,'project','planning','Planning',NULL,'#6B7280',1,0,1,'2025-07-07 14:31:55'),(2,'project','active','Active',NULL,'#10B981',2,0,1,'2025-07-07 14:31:55'),(3,'project','on-hold','On Hold',NULL,'#F59E0B',3,0,1,'2025-07-07 14:31:55'),(4,'project','completed','Completed',NULL,'#3B82F6',4,1,1,'2025-07-07 14:31:55'),(5,'project','cancelled','Cancelled',NULL,'#EF4444',5,1,1,'2025-07-07 14:31:55'),(6,'task','todo','To Do',NULL,'#6B7280',1,0,1,'2025-07-07 14:31:57'),(7,'task','in-progress','In Progress',NULL,'#F59E0B',2,0,1,'2025-07-07 14:31:57'),(8,'task','review','In Review',NULL,'#8B5CF6',3,0,1,'2025-07-07 14:31:57'),(9,'task','completed','Completed',NULL,'#10B981',4,1,1,'2025-07-07 14:31:57'),(10,'task','cancelled','Cancelled',NULL,'#EF4444',5,1,1,'2025-07-07 14:31:57');
/*!40000 ALTER TABLE `m_status_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_tags`
--

DROP TABLE IF EXISTS `m_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) NOT NULL,
  `entity_type` varchar(20) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `unique_tag_per_entity` (`name`,`entity_type`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `m_tags_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_tags`
--

LOCK TABLES `m_tags` WRITE;
/*!40000 ALTER TABLE `m_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_task_types`
--

DROP TABLE IF EXISTS `m_task_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_task_types` (
  `task_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `icon` varchar(50) DEFAULT 'task',
  `color_code` varchar(7) DEFAULT '#3B82F6',
  `default_estimated_hours` int(11) DEFAULT '8',
  `requires_approval` tinyint(1) DEFAULT '0',
  `is_billable` tinyint(1) DEFAULT '0',
  `is_target_based` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_task_types`
--

LOCK TABLES `m_task_types` WRITE;
/*!40000 ALTER TABLE `m_task_types` DISABLE KEYS */;
INSERT INTO `m_task_types` VALUES (1,'Development','Software development task','code','#3B82F6',8,0,1,0,1,'2025-07-07 14:31:59'),(2,'Testing','Quality assurance and testing','bug','#10B981',4,0,1,0,1,'2025-07-07 14:31:59'),(3,'Documentation','Documentation and technical writing','file-text','#6B7280',2,0,1,0,1,'2025-07-07 14:31:59'),(4,'Meeting','Meetings and discussions','users','#8B5CF6',1,0,0,0,1,'2025-07-07 14:31:59'),(5,'Research','Research and analysis','search','#F59E0B',4,0,1,0,1,'2025-07-07 14:31:59');
/*!40000 ALTER TABLE `m_task_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_approval_workflows`
--

DROP TABLE IF EXISTS `t_approval_workflows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_approval_workflows` (
  `workflow_id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(20) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `approval_type_id` int(11) DEFAULT NULL,
  `submitted_by` int(11) NOT NULL,
  `current_level` int(11) DEFAULT '1',
  `max_level` int(11) DEFAULT '3',
  `status` varchar(20) DEFAULT 'pending',
  `submitted_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `completed_date` datetime DEFAULT NULL,
  `total_time_hours` int(11) DEFAULT NULL,
  `rejection_reason` text,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`workflow_id`),
  KEY `submitted_by` (`submitted_by`),
  KEY `approval_type_id` (`approval_type_id`),
  KEY `idx_workflow_entity` (`entity_type`,`entity_id`),
  KEY `idx_workflow_status` (`status`),
  CONSTRAINT `t_approval_workflows_ibfk_1` FOREIGN KEY (`submitted_by`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_approval_workflows_ibfk_2` FOREIGN KEY (`approval_type_id`) REFERENCES `m_approval_types` (`approval_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_approval_workflows`
--

LOCK TABLES `t_approval_workflows` WRITE;
/*!40000 ALTER TABLE `t_approval_workflows` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_approval_workflows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_audit_logs`
--

DROP TABLE IF EXISTS `t_audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_audit_logs` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `action` varchar(20) NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_entity_audit` (`entity_type`,`entity_id`,`created_date`),
  KEY `idx_user_audit` (`user_id`,`created_date`),
  CONSTRAINT `t_audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_audit_logs`
--

LOCK TABLES `t_audit_logs` WRITE;
/*!40000 ALTER TABLE `t_audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_custom_configurations`
--

DROP TABLE IF EXISTS `t_custom_configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_custom_configurations` (
  `config_id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(20) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `attribute_id` int(11) DEFAULT NULL,
  `value` json NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`config_id`),
  UNIQUE KEY `unique_entity_attribute` (`entity_type`,`entity_id`,`attribute_id`),
  KEY `attribute_id` (`attribute_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `t_custom_configurations_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `m_custom_attributes` (`attribute_id`),
  CONSTRAINT `t_custom_configurations_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_custom_configurations`
--

LOCK TABLES `t_custom_configurations` WRITE;
/*!40000 ALTER TABLE `t_custom_configurations` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_custom_configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_entity_tags`
--

DROP TABLE IF EXISTS `t_entity_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_entity_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(20) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `assigned_by` int(11) DEFAULT NULL,
  `assigned_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_entity_tag` (`entity_type`,`entity_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `t_entity_tags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `m_tags` (`tag_id`) ON DELETE CASCADE,
  CONSTRAINT `t_entity_tags_ibfk_2` FOREIGN KEY (`assigned_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_entity_tags`
--

LOCK TABLES `t_entity_tags` WRITE;
/*!40000 ALTER TABLE `t_entity_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_entity_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_notifications`
--

DROP TABLE IF EXISTS `t_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_notifications` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `entity_type` varchar(20) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `action_url` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `expires_date` datetime DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `idx_user_unread` (`user_id`,`is_read`,`created_date`),
  KEY `idx_notification_user_type` (`user_id`,`type`),
  KEY `idx_notification_unread` (`user_id`,`is_read`),
  CONSTRAINT `t_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_notifications`
--

LOCK TABLES `t_notifications` WRITE;
/*!40000 ALTER TABLE `t_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_project`
--

DROP TABLE IF EXISTS `t_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_project` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `status` varchar(50) DEFAULT 'planning',
  `priority` varchar(50) DEFAULT 'medium',
  `project_type_id` int(11) DEFAULT NULL,
  `manager_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `actual_cost` decimal(15,2) DEFAULT '0.00',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `estimated_hours` int(11) DEFAULT '0',
  `actual_hours` int(11) DEFAULT '0',
  `progress` int(11) DEFAULT '0',
  `allow_join` tinyint(1) DEFAULT '0',
  `is_template` tinyint(1) DEFAULT '0',
  `template_source_id` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `project_type_id` (`project_type_id`),
  KEY `template_source_id` (`template_source_id`),
  KEY `idx_project_manager` (`manager_id`),
  KEY `idx_project_department` (`department_id`),
  KEY `idx_project_status` (`status`),
  KEY `idx_project_dates` (`start_date`,`end_date`),
  CONSTRAINT `t_project_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_project_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `hots`.`m_department` (`department_id`),
  CONSTRAINT `t_project_ibfk_3` FOREIGN KEY (`project_type_id`) REFERENCES `m_project_types` (`project_type_id`),
  CONSTRAINT `t_project_ibfk_4` FOREIGN KEY (`template_source_id`) REFERENCES `t_project` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_project`
--

LOCK TABLES `t_project` WRITE;
/*!40000 ALTER TABLE `t_project` DISABLE KEYS */;
INSERT INTO `t_project` VALUES (1,'Project name','Project Description','planning','medium',NULL,10098,10,100.00,0.00,'2025-07-08','2025-07-09',10,0,0,0,0,NULL,'2025-07-08 13:54:25','2025-07-08 13:54:25');
/*!40000 ALTER TABLE `t_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_project_approvals`
--

DROP TABLE IF EXISTS `t_project_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_project_approvals` (
  `approval_id` int(11) NOT NULL AUTO_INCREMENT,
  `workflow_id` int(11) DEFAULT NULL,
  `project_id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `approver_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `approved_date` datetime DEFAULT NULL,
  `comments` text,
  `budget_approved` decimal(15,2) DEFAULT NULL,
  `delegated_to` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`approval_id`),
  KEY `workflow_id` (`workflow_id`),
  KEY `project_id` (`project_id`),
  KEY `approver_id` (`approver_id`),
  KEY `delegated_to` (`delegated_to`),
  CONSTRAINT `t_project_approvals_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `t_approval_workflows` (`workflow_id`),
  CONSTRAINT `t_project_approvals_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `t_project` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `t_project_approvals_ibfk_3` FOREIGN KEY (`approver_id`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_project_approvals_ibfk_4` FOREIGN KEY (`delegated_to`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_project_approvals`
--

LOCK TABLES `t_project_approvals` WRITE;
/*!40000 ALTER TABLE `t_project_approvals` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_project_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_project_join_requests`
--

DROP TABLE IF EXISTS `t_project_join_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_project_join_requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `requested_role` varchar(50) DEFAULT 'member',
  `message` text,
  `status` varchar(20) DEFAULT 'pending',
  `processed_by` int(11) DEFAULT NULL,
  `processed_date` datetime DEFAULT NULL,
  `comments` text,
  `requested_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  UNIQUE KEY `unique_pending_request` (`project_id`,`user_id`,`status`),
  KEY `user_id` (`user_id`),
  KEY `processed_by` (`processed_by`),
  CONSTRAINT `t_project_join_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `t_project` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `t_project_join_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_project_join_requests_ibfk_3` FOREIGN KEY (`processed_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_project_join_requests`
--

LOCK TABLES `t_project_join_requests` WRITE;
/*!40000 ALTER TABLE `t_project_join_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_project_join_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_project_members`
--

DROP TABLE IF EXISTS `t_project_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_project_members` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` varchar(50) DEFAULT 'member',
  `permissions` json DEFAULT NULL,
  `joined_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `left_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `added_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `unique_active_member` (`project_id`,`user_id`,`is_active`),
  KEY `user_id` (`user_id`),
  KEY `added_by` (`added_by`),
  CONSTRAINT `t_project_members_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `t_project` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `t_project_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_project_members_ibfk_3` FOREIGN KEY (`added_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_project_members`
--

LOCK TABLES `t_project_members` WRITE;
/*!40000 ALTER TABLE `t_project_members` DISABLE KEYS */;
INSERT INTO `t_project_members` VALUES (1,1,10098,'manager',NULL,'2025-07-08 13:54:25',NULL,1,10098);
/*!40000 ALTER TABLE `t_project_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_task_approvals`
--

DROP TABLE IF EXISTS `t_task_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_task_approvals` (
  `approval_id` int(11) NOT NULL AUTO_INCREMENT,
  `workflow_id` int(11) DEFAULT NULL,
  `task_id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `approver_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `approved_date` datetime DEFAULT NULL,
  `comments` text,
  `delegated_to` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`approval_id`),
  KEY `workflow_id` (`workflow_id`),
  KEY `task_id` (`task_id`),
  KEY `approver_id` (`approver_id`),
  KEY `delegated_to` (`delegated_to`),
  CONSTRAINT `t_task_approvals_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `t_approval_workflows` (`workflow_id`),
  CONSTRAINT `t_task_approvals_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `t_tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `t_task_approvals_ibfk_3` FOREIGN KEY (`approver_id`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_task_approvals_ibfk_4` FOREIGN KEY (`delegated_to`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_task_approvals`
--

LOCK TABLES `t_task_approvals` WRITE;
/*!40000 ALTER TABLE `t_task_approvals` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_task_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_task_dependencies`
--

DROP TABLE IF EXISTS `t_task_dependencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_task_dependencies` (
  `dependency_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `depends_on_task_id` int(11) NOT NULL,
  `dependency_type` varchar(20) DEFAULT 'finish_to_start',
  `lag_days` int(11) DEFAULT '0',
  `is_critical` tinyint(1) DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dependency_id`),
  UNIQUE KEY `unique_dependency` (`task_id`,`depends_on_task_id`),
  KEY `depends_on_task_id` (`depends_on_task_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `t_task_dependencies_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `t_tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `t_task_dependencies_ibfk_2` FOREIGN KEY (`depends_on_task_id`) REFERENCES `t_tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `t_task_dependencies_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_task_dependencies`
--

LOCK TABLES `t_task_dependencies` WRITE;
/*!40000 ALTER TABLE `t_task_dependencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_task_dependencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_task_groups`
--

DROP TABLE IF EXISTS `t_task_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_task_groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `status_mapping` varchar(50) DEFAULT NULL,
  `sort_order` int(11) DEFAULT '0',
  `color` varchar(7) DEFAULT '#3B82F6',
  `is_active` tinyint(1) DEFAULT '1',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `t_task_groups_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `t_project` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_task_groups`
--

LOCK TABLES `t_task_groups` WRITE;
/*!40000 ALTER TABLE `t_task_groups` DISABLE KEYS */;
INSERT INTO `t_task_groups` VALUES (1,1,'To Do',NULL,'todo',1,'#3B82F6',1,'2025-07-08 13:54:25','2025-07-08 13:54:25'),(2,1,'In Progress',NULL,'in-progress',2,'#3B82F6',1,'2025-07-08 13:54:25','2025-07-08 13:54:25'),(3,1,'Review',NULL,'review',3,'#3B82F6',1,'2025-07-08 13:54:25','2025-07-08 13:54:25'),(4,1,'Done',NULL,'completed',4,'#3B82F6',1,'2025-07-08 13:54:26','2025-07-08 13:54:26');
/*!40000 ALTER TABLE `t_task_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_tasks`
--

DROP TABLE IF EXISTS `t_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_tasks` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `status` varchar(50) DEFAULT 'todo',
  `priority` varchar(50) DEFAULT 'medium',
  `task_type_id` int(11) DEFAULT NULL,
  `project_id` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `due_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `estimated_hours` int(11) DEFAULT '0',
  `actual_hours` int(11) DEFAULT '0',
  `progress` int(11) DEFAULT '0',
  `group_id` int(11) DEFAULT NULL,
  `parent_task_id` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT '0',
  `is_milestone` tinyint(1) DEFAULT '0',
  `billable_hours` decimal(5,2) DEFAULT '0.00',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  KEY `created_by` (`created_by`),
  KEY `task_type_id` (`task_type_id`),
  KEY `parent_task_id` (`parent_task_id`),
  KEY `idx_task_project` (`project_id`),
  KEY `idx_task_assigned` (`assigned_to`),
  KEY `idx_task_status` (`status`),
  KEY `idx_task_due_date` (`due_date`),
  KEY `idx_task_group` (`group_id`),
  CONSTRAINT `t_tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `t_project` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `t_tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_tasks_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_tasks_ibfk_4` FOREIGN KEY (`task_type_id`) REFERENCES `m_task_types` (`task_type_id`),
  CONSTRAINT `t_tasks_ibfk_5` FOREIGN KEY (`group_id`) REFERENCES `t_task_groups` (`group_id`),
  CONSTRAINT `t_tasks_ibfk_6` FOREIGN KEY (`parent_task_id`) REFERENCES `t_tasks` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_tasks`
--

LOCK TABLES `t_tasks` WRITE;
/*!40000 ALTER TABLE `t_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_time_tracking`
--

DROP TABLE IF EXISTS `t_time_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_time_tracking` (
  `entry_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `description` text,
  `is_billable` tinyint(1) DEFAULT '0',
  `hourly_rate` decimal(8,2) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`entry_id`),
  KEY `task_id` (`task_id`),
  KEY `user_id` (`user_id`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `t_time_tracking_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `t_tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `t_time_tracking_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `hots`.`user` (`user_id`),
  CONSTRAINT `t_time_tracking_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `hots`.`user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_time_tracking`
--

LOCK TABLES `t_time_tracking` WRITE;
/*!40000 ALTER TABLE `t_time_tracking` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_time_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_project_summary`
--

DROP TABLE IF EXISTS `v_project_summary`;
/*!50001 DROP VIEW IF EXISTS `v_project_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_project_summary` AS SELECT 
 1 AS `project_id`,
 1 AS `name`,
 1 AS `description`,
 1 AS `status`,
 1 AS `priority`,
 1 AS `budget`,
 1 AS `actual_cost`,
 1 AS `start_date`,
 1 AS `end_date`,
 1 AS `progress`,
 1 AS `manager_name`,
 1 AS `department_name`,
 1 AS `created_date`,
 1 AS `updated_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_task_summary`
--

DROP TABLE IF EXISTS `v_task_summary`;
/*!50001 DROP VIEW IF EXISTS `v_task_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_task_summary` AS SELECT 
 1 AS `task_id`,
 1 AS `name`,
 1 AS `description`,
 1 AS `status`,
 1 AS `priority`,
 1 AS `due_date`,
 1 AS `progress`,
 1 AS `estimated_hours`,
 1 AS `actual_hours`,
 1 AS `project_name`,
 1 AS `assigned_to_name`,
 1 AS `created_by_name`,
 1 AS `created_date`,
 1 AS `updated_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'pm'
--

--
-- Final view structure for view `v_project_summary`
--

/*!50001 DROP VIEW IF EXISTS `v_project_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_project_summary` AS select `p`.`project_id` AS `project_id`,`p`.`name` AS `name`,`p`.`description` AS `description`,`p`.`status` AS `status`,`p`.`priority` AS `priority`,`p`.`budget` AS `budget`,`p`.`actual_cost` AS `actual_cost`,`p`.`start_date` AS `start_date`,`p`.`end_date` AS `end_date`,`p`.`progress` AS `progress`,concat(`u`.`firstname`,' ',`u`.`lastname`) AS `manager_name`,`d`.`department_name` AS `department_name`,`p`.`created_date` AS `created_date`,`p`.`updated_date` AS `updated_date` from ((`pm`.`t_project` `p` left join `hots`.`user` `u` on((`p`.`manager_id` = `u`.`user_id`))) left join `hots`.`m_department` `d` on((`p`.`department_id` = `d`.`department_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_task_summary`
--

/*!50001 DROP VIEW IF EXISTS `v_task_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_task_summary` AS select `t`.`task_id` AS `task_id`,`t`.`name` AS `name`,`t`.`description` AS `description`,`t`.`status` AS `status`,`t`.`priority` AS `priority`,`t`.`due_date` AS `due_date`,`t`.`progress` AS `progress`,`t`.`estimated_hours` AS `estimated_hours`,`t`.`actual_hours` AS `actual_hours`,`p`.`name` AS `project_name`,concat(`u_assigned`.`firstname`,' ',`u_assigned`.`lastname`) AS `assigned_to_name`,concat(`u_created`.`firstname`,' ',`u_created`.`lastname`) AS `created_by_name`,`t`.`created_date` AS `created_date`,`t`.`updated_date` AS `updated_date` from (((`pm`.`t_tasks` `t` left join `pm`.`t_project` `p` on((`t`.`project_id` = `p`.`project_id`))) left join `hots`.`user` `u_assigned` on((`t`.`assigned_to` = `u_assigned`.`user_id`))) left join `hots`.`user` `u_created` on((`t`.`created_by` = `u_created`.`user_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-08 17:35:07

CREATE TABLE `agent_configs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`agentType` enum('researcher','writer','analyst','summarizer','coder','translator','custom') NOT NULL,
	`systemPrompt` text NOT NULL,
	`temperature` int NOT NULL DEFAULT 100,
	`maxTokens` int NOT NULL DEFAULT 8192,
	`isPublic` boolean NOT NULL DEFAULT false,
	`isDefault` boolean NOT NULL DEFAULT false,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_configs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nlp_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`taskType` enum('summarization','analysis','research','content_generation','code_generation','translation','custom') NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`inputData` text NOT NULL,
	`outputData` text,
	`agentConfig` text,
	`errorMessage` text,
	`processingTime` int,
	`tokensUsed` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `nlp_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taskId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`format` enum('json','markdown','text','pdf') NOT NULL,
	`fileUrl` text,
	`isPublic` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `task_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`agentName` varchar(255) NOT NULL,
	`logLevel` enum('info','warning','error','debug') NOT NULL,
	`message` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `task_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`defaultAgentConfig` int,
	`theme` enum('light','dark','system') NOT NULL DEFAULT 'system',
	`defaultTaskType` varchar(64),
	`notificationsEnabled` boolean NOT NULL DEFAULT true,
	`autoSaveResults` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_preferences_userId_unique` UNIQUE(`userId`)
);

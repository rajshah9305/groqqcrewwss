CREATE TYPE "public"."agentType" AS ENUM('researcher', 'writer', 'analyst', 'summarizer', 'coder', 'translator', 'custom');--> statement-breakpoint
CREATE TYPE "public"."format" AS ENUM('json', 'markdown', 'text', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."logLevel" AS ENUM('info', 'warning', 'error', 'debug');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."taskType" AS ENUM('summarization', 'analysis', 'research', 'content_generation', 'code_generation', 'translation', 'custom');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('light', 'dark', 'system');--> statement-breakpoint
CREATE TABLE "agent_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"agentType" "agentType" NOT NULL,
	"systemPrompt" text NOT NULL,
	"temperature" integer DEFAULT 100 NOT NULL,
	"maxTokens" integer DEFAULT 8192 NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nlp_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"taskType" "taskType" NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"inputData" text NOT NULL,
	"outputData" text,
	"agentConfig" text,
	"errorMessage" text,
	"processingTime" integer,
	"tokensUsed" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "saved_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"taskId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"format" "format" NOT NULL,
	"fileUrl" text,
	"isPublic" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"taskId" integer NOT NULL,
	"agentName" varchar(255) NOT NULL,
	"logLevel" "logLevel" NOT NULL,
	"message" text NOT NULL,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"defaultAgentConfig" integer,
	"theme" "theme" DEFAULT 'system' NOT NULL,
	"defaultTaskType" varchar(64),
	"notificationsEnabled" boolean DEFAULT true NOT NULL,
	"autoSaveResults" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);

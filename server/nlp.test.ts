import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("NLP Task Management", () => {
  it("should create a new NLP task", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const task = await caller.nlp.createTask({
      title: "Test Summarization Task",
      description: "Test task for summarization",
      taskType: "summarization",
      inputData: "This is a test input for summarization. It contains multiple sentences to test the summarization functionality.",
      priority: "medium",
    });

    expect(task).toBeDefined();
    expect(task.title).toBe("Test Summarization Task");
    expect(task.taskType).toBe("summarization");
    expect(task.status).toBe("pending");
    expect(task.userId).toBe(1); // Default user ID
  });

  it("should retrieve user tasks", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Create a task first
    await caller.nlp.createTask({
      title: "Test Task for Retrieval",
      description: "Test task",
      taskType: "analysis",
      inputData: "Test input data",
      priority: "low",
    });

    const tasks = await caller.nlp.getTasks({ limit: 10 });

    expect(tasks).toBeDefined();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("should get a specific task by ID", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const createdTask = await caller.nlp.createTask({
      title: "Specific Task Test",
      description: "Test getting specific task",
      taskType: "research",
      inputData: "Research topic",
      priority: "high",
    });

    const retrievedTask = await caller.nlp.getTask({ id: createdTask.id });

    expect(retrievedTask).toBeDefined();
    expect(retrievedTask.id).toBe(createdTask.id);
    expect(retrievedTask.title).toBe("Specific Task Test");
  });

  it("should delete a task", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const task = await caller.nlp.createTask({
      title: "Task to Delete",
      description: "This task will be deleted",
      taskType: "custom",
      inputData: "Delete me",
      priority: "low",
    });

    const result = await caller.nlp.deleteTask({ id: task.id });

    expect(result.success).toBe(true);
  });

  it("should allow task access without authorization", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const task = await caller.nlp.createTask({
      title: "Test Task",
      description: "This is a test task",
      taskType: "summarization",
      inputData: "Test data",
      priority: "medium",
    });

    // Task should be accessible without auth
    const retrievedTask = await caller.nlp.getTask({ id: task.id });
    expect(retrievedTask).toBeDefined();
    expect(retrievedTask.id).toBe(task.id);
  });
});

describe("Agent Configuration", () => {
  it("should create an agent configuration", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const config = await caller.agents.createConfig({
      name: "Custom Researcher",
      description: "A specialized research agent",
      agentType: "researcher",
      systemPrompt: "You are a specialized research agent focusing on technical topics.",
      temperature: 50,
      maxTokens: 4096,
      isPublic: false,
    });

    expect(config).toBeDefined();
    expect(config.name).toBe("Custom Researcher");
    expect(config.agentType).toBe("researcher");
    expect(config.temperature).toBe(50);
  });

  it("should retrieve user agent configurations", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    await caller.agents.createConfig({
      name: "Test Agent Config",
      agentType: "writer",
      systemPrompt: "Test prompt",
    });

    const configs = await caller.agents.getUserConfigs();

    expect(configs).toBeDefined();
    expect(Array.isArray(configs)).toBe(true);
  });

  it("should retrieve public agent configurations", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    await caller.agents.createConfig({
      name: "Public Agent",
      agentType: "analyst",
      systemPrompt: "Public agent prompt",
      isPublic: true,
    });

    const publicConfigs = await caller.agents.getPublicConfigs();

    expect(publicConfigs).toBeDefined();
    expect(Array.isArray(publicConfigs)).toBe(true);
  });
});

describe("User Preferences", () => {
  it("should update user preferences", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.preferences.update({
      theme: "dark",
      notificationsEnabled: true,
      autoSaveResults: false,
    });

    expect(result.success).toBe(true);
  });

  it("should retrieve user preferences", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    await caller.preferences.update({
      theme: "light",
      defaultTaskType: "summarization",
    });

    const prefs = await caller.preferences.get();

    expect(prefs).toBeDefined();
    if (prefs) {
      expect(prefs.userId).toBe(1); // Default user ID
    }
  });
});

describe("Saved Results", () => {
  it("should save a result", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const task = await caller.nlp.createTask({
      title: "Task for Result",
      description: "Task to generate result",
      taskType: "summarization",
      inputData: "Input for result",
      priority: "medium",
    });

    const savedResult = await caller.results.save({
      taskId: task.id,
      title: "Saved Summary",
      content: "This is the saved summary result",
      format: "markdown",
      isPublic: false,
    });

    expect(savedResult).toBeDefined();
    expect(savedResult.title).toBe("Saved Summary");
    expect(savedResult.format).toBe("markdown");
  });

  it("should retrieve user saved results", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.results.getUserResults();

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });
});

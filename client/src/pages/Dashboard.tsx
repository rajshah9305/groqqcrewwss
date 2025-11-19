import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Play, Trash2, Clock, CheckCircle2, XCircle, Sparkles, Bot } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import { Streamdown } from "streamdown";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState<"summarization" | "analysis" | "research" | "content_generation" | "code_generation" | "translation" | "custom">("summarization");
  const [inputData, setInputData] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [temperature, setTemperature] = useState(70);
  const [multiAgent, setMultiAgent] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: tasks, isLoading: tasksLoading } = trpc.nlp.getTasks.useQuery({ limit: 50 });
  const { data: selectedTaskData } = trpc.nlp.getTask.useQuery(
    { id: selectedTask! },
    { enabled: !!selectedTask }
  );

  const createTask = trpc.nlp.createTask.useMutation({
    onSuccess: (task) => {
      toast.success("Task created successfully!");
      utils.nlp.getTasks.invalidate();
      setTitle("");
      setDescription("");
      setInputData("");
      executeTask.mutate({ taskId: task.id, temperature, multiAgent });
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  const executeTask = trpc.nlp.executeTask.useMutation({
    onSuccess: (result) => {
      toast.success(`Task completed in ${(result.processingTime / 1000).toFixed(2)}s`);
      utils.nlp.getTasks.invalidate();
      if (selectedTask) {
        utils.nlp.getTask.invalidate({ id: selectedTask });
      }
    },
    onError: (error) => {
      toast.error(`Task execution failed: ${error.message}`);
      utils.nlp.getTasks.invalidate();
    },
  });

  const deleteTask = trpc.nlp.deleteTask.useMutation({
    onSuccess: () => {
      toast.success("Task deleted");
      utils.nlp.getTasks.invalidate();
      if (selectedTask) {
        setSelectedTask(null);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !inputData) {
      toast.error("Please fill in all required fields");
      return;
    }
    createTask.mutate({
      title,
      description,
      taskType,
      inputData,
      priority,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-100 text-green-700 border-green-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      <Badge className={variants[status] || variants.pending}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Navigation */}
      <nav className="border-b border-violet-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {APP_TITLE}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome</span>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            NLP Dashboard
          </h1>
          <p className="text-gray-600">Create and manage your AI-powered NLP tasks</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task Creation Form */}
          <div className="lg:col-span-1">
            <Card className="border-violet-200 bg-white/80 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  Create New Task
                </CardTitle>
                <CardDescription>Configure and submit your NLP task</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what you want to accomplish"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="taskType">Task Type</Label>
                    <Select value={taskType} onValueChange={(v: any) => setTaskType(v)}>
                      <SelectTrigger id="taskType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summarization">Summarization</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="content_generation">Content Generation</SelectItem>
                        <SelectItem value="code_generation">Code Generation</SelectItem>
                        <SelectItem value="translation">Translation</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="inputData">Input Text</Label>
                    <Textarea
                      id="inputData"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Paste your text here..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="temperature">Temperature: {temperature}</Label>
                    <input
                      id="temperature"
                      type="range"
                      min="0"
                      max="100"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="multiAgent"
                      type="checkbox"
                      checked={multiAgent}
                      onChange={(e) => setMultiAgent(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="multiAgent" className="cursor-pointer">
                      Use Multi-Agent Processing
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                    disabled={createTask.isPending || executeTask.isPending}
                  >
                    {createTask.isPending || executeTask.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Create & Execute
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Task List and Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tasks" className="space-y-4">
              <TabsList className="bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="tasks">All Tasks</TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedTask}>
                  Task Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-4">
                {tasksLoading ? (
                  <Card className="border-violet-200 bg-white/80 backdrop-blur-sm">
                    <CardContent className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600" />
                    </CardContent>
                  </Card>
                ) : tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border-violet-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedTask(task.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(task.status)}
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                            </div>
                            <CardDescription>{task.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(task.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask.mutate({ id: task.id });
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="capitalize">{task.taskType.replace("_", " ")}</span>
                          <span>•</span>
                          <span className="capitalize">{task.priority} priority</span>
                          {task.processingTime && (
                            <>
                              <span>•</span>
                              <span>{(task.processingTime / 1000).toFixed(2)}s</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-violet-200 bg-white/80 backdrop-blur-sm">
                    <CardContent className="py-12 text-center text-gray-600">
                      No tasks yet. Create your first task to get started!
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="details">
                {selectedTaskData && (
                  <Card className="border-violet-200 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl mb-2">{selectedTaskData.title}</CardTitle>
                          <CardDescription>{selectedTaskData.description}</CardDescription>
                        </div>
                        {getStatusBadge(selectedTaskData.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Input</Label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <pre className="whitespace-pre-wrap text-sm">{selectedTaskData.inputData}</pre>
                        </div>
                      </div>

                      {selectedTaskData.outputData && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Output</Label>
                          <div className="mt-2 p-4 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg border border-violet-200">
                            <Streamdown>{selectedTaskData.outputData}</Streamdown>
                          </div>
                        </div>
                      )}

                      {selectedTaskData.errorMessage && (
                        <div>
                          <Label className="text-sm font-semibold text-red-700">Error</Label>
                          <div className="mt-2 p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
                            {selectedTaskData.errorMessage}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <Label className="text-xs text-gray-500">Task Type</Label>
                          <p className="capitalize">{selectedTaskData.taskType.replace("_", " ")}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Priority</Label>
                          <p className="capitalize">{selectedTaskData.priority}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Created</Label>
                          <p>{new Date(selectedTaskData.createdAt).toLocaleString()}</p>
                        </div>
                        {selectedTaskData.completedAt && (
                          <div>
                            <Label className="text-xs text-gray-500">Completed</Label>
                            <p>{new Date(selectedTaskData.completedAt).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

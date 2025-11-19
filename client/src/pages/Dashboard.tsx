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
        return <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-100 text-green-700 border-green-200",
      processing: "bg-orange-100 text-orange-700 border-orange-200",
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-bold text-black truncate">
                {APP_TITLE}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Welcome</span>
          </div>
        </div>
      </nav>

      <div className="container py-4 sm:py-6 lg:py-8 px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-black">
            NLP Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Create and manage your AI-powered NLP tasks</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Task Creation Form */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 bg-white lg:sticky lg:top-24">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                  Create New Task
                </CardTitle>
                <CardDescription className="text-sm">Configure and submit your NLP task</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                    <Label htmlFor="inputData" className="text-sm">Input Text</Label>
                    <Textarea
                      id="inputData"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Paste your text here..."
                      rows={6}
                      required
                      className="text-sm resize-y min-h-[120px]"
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
                    <Label htmlFor="temperature" className="text-sm">Temperature: {temperature}</Label>
                    <input
                      id="temperature"
                      type="range"
                      min="0"
                      max="100"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2"
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
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
              <TabsList className="bg-white">
                <TabsTrigger value="tasks">All Tasks</TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedTask}>
                  Task Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-4">
                {tasksLoading ? (
                  <Card className="border-gray-200 bg-white">
                    <CardContent className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                    </CardContent>
                  </Card>
                ) : tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border-gray-200 bg-white hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedTask(task.id)}
                    >
                      <CardHeader className="px-4 sm:px-6">
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(task.status)}
                              <CardTitle className="text-base sm:text-lg truncate">{task.title}</CardTitle>
                            </div>
                            <CardDescription className="text-sm line-clamp-2">{task.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="hidden sm:block">{getStatusBadge(task.status)}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask.mutate({ id: task.id });
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <div className="sm:hidden mt-2">{getStatusBadge(task.status)}</div>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="capitalize">{task.taskType.replace("_", " ")}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="capitalize">{task.priority} priority</span>
                          {task.processingTime && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{(task.processingTime / 1000).toFixed(2)}s</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-gray-200 bg-white">
                    <CardContent className="py-12 text-center text-gray-600">
                      No tasks yet. Create your first task to get started!
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="details">
                {selectedTaskData && (
                  <Card className="border-gray-200 bg-white">
                    <CardHeader className="px-4 sm:px-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl sm:text-2xl mb-2 break-words">{selectedTaskData.title}</CardTitle>
                          <CardDescription className="text-sm break-words">{selectedTaskData.description}</CardDescription>
                        </div>
                        <div className="shrink-0">{getStatusBadge(selectedTaskData.status)}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Input</Label>
                        <div className="mt-2 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
                          <pre className="whitespace-pre-wrap text-xs sm:text-sm break-words">{selectedTaskData.inputData}</pre>
                        </div>
                      </div>

                      {selectedTaskData.outputData && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Output</Label>
                          <div className="mt-2 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200 overflow-x-auto">
                            <Streamdown>{selectedTaskData.outputData}</Streamdown>
                          </div>
                        </div>
                      )}

                      {selectedTaskData.errorMessage && (
                        <div>
                          <Label className="text-sm font-semibold text-red-700">Error</Label>
                          <div className="mt-2 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-xs sm:text-sm break-words">
                            {selectedTaskData.errorMessage}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
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

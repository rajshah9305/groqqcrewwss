#!/usr/bin/env node

const { createNlpTask, ensureDefaultUser } = require('./server/db.ts');

async function testDatabase() {
  console.log('🔍 Testing database connection and task creation...');
  
  try {
    // Ensure default user exists
    await ensureDefaultUser();
    console.log('✅ Default user ensured');
    
    // Test task creation with valid data
    const testTask = {
      userId: 1,
      title: 'Test Task',
      description: 'This is a test task to verify database functionality',
      taskType: 'summarization',
      inputData: 'This is test input data for the task',
      priority: 'medium',
      status: 'pending'
    };
    
    console.log('📝 Creating test task with data:', {
      ...testTask,
      inputData: testTask.inputData.substring(0, 50) + '...'
    });
    
    const createdTask = await createNlpTask(testTask);
    console.log('✅ Task created successfully:', {
      id: createdTask.id,
      title: createdTask.title,
      taskType: createdTask.taskType,
      status: createdTask.status,
      priority: createdTask.priority
    });
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase();
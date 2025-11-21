import express, { Request, Response } from 'express';
import { createServer } from 'http';

const app = express();
import { OpenAI } from 'openai';
const server = createServer(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY',
});
});

app.post('/api/generate', async (req, res) => {
  const question = req.body.question;
  const response = await openai.complete({
    model: 'text-davinci-003',
    prompt: question,
    max_tokens: 2048,
  });
  res.json(response.data);
});
server.listen(3000, () => {
app.post('/api/ask', async (req, res) => {
  const question = req.body.question;
  const response = await openai.complete({
    model: 'text-davinci-003',
    prompt: question,
    max_tokens: 2048,
  });
  res.json(response.data);
});
  console.log('Server listening on port 3000');
});
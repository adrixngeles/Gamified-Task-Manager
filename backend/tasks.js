import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import User from './users.js';  // User model

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // OpenAI API Key
});

const router = express.Router();

// Task Generator Route
router.post('/generate-task', async (req, res) => {
  const { taskDescription, detailLevel, userId } = req.body;

  try {
    let prompt = '';

    if (detailLevel === 1) {
      prompt = `Generate simple steps to complete the task: ${taskDescription}`;
    } else if (detailLevel === 2) {
      prompt = `Generate detailed steps with clear instructions for completing the task: ${taskDescription}`;
    } else if (detailLevel === 3) {
      prompt = `Generate highly detailed steps with mindful reminders for completing the task: ${taskDescription}`;
    }

    // Use the chat completion endpoint to generate steps
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Updated model name
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const steps = response.choices[0].message.content.trim();

    // Now, we prompt the AI to decide how difficult the task is on a scale from 1 to 5
    const difficultyPrompt = `
      Based on the task description and the steps required, how difficult do you think this task is on a scale of 1 to 5, with 1 being very easy and 5 being very hard?
      Task: ${taskDescription}
      Steps: ${steps}
    `;

    // Request for difficulty score (same chat completion endpoint)
    const difficultyResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Updated model name
      messages: [{ role: 'user', content: difficultyPrompt }],
      max_tokens: 50,
    });

    const difficultyScoreText = difficultyResponse.choices[0].message.content.trim();

    // Log the raw response for difficulty
    console.log('Difficulty Response:', difficultyScoreText);

    // Regular expression to extract a number between 1 and 5
    const difficultyScoreMatch = difficultyScoreText.match(/(\d)\s*out of 5/);
    let difficultyScore = NaN;

    if (difficultyScoreMatch && difficultyScoreMatch[1]) {
      difficultyScore = parseInt(difficultyScoreMatch[1]);
    }

    // Log the parsed difficulty score
    console.log('Parsed Difficulty Score:', difficultyScore);

    // Validate difficulty score to be between 1 and 5
    if (isNaN(difficultyScore) || difficultyScore < 1 || difficultyScore > 5) {
      return res.status(500).json({ msg: 'Error determining difficulty score', response: difficultyScoreText });
    }

    // Reward user for generating a task (using AI-generated difficulty score)
    await User.findByIdAndUpdate(userId, { $inc: { score: difficultyScore } });

    res.status(200).json({
      msg: 'Task steps generated successfully',
      steps,
      score: difficultyScore,  // Example reward based on AI's assessment
    });
  } catch (error) {
    console.error('Error details:', error);  // Log error details
    res.status(500).json({ msg: 'Error generating task steps' });
  }
});

export default router;
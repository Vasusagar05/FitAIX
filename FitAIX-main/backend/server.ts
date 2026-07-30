import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
  dbInit,
  getProfile,
  updateProfile,
  logWeight,
  getWeightHistory,
  getStreak,
  getWorkoutHistory,
  getNotifications,
  markNotificationsRead
} from './db/db';

import { authRouter, authenticateToken } from './routes/auth';
import { workoutsRouter } from './routes/workouts';
import { mealsRouter } from './routes/meals';
import { progressRouter } from './routes/progress';
import { getGroqChatCompletion } from './services/groqService';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

setInterval(() => {
  const mockSocketEvents = [
    {
      event: 'workout_updated',
      payload: { message: 'AI auto-decreased volume based on elevated morning RHR.', timestamp: new Date().toLocaleTimeString() }
    },
    {
      event: 'recovery_score_updated',
      payload: { overallScore: 88, hrvMs: 68, message: 'HRV baseline recovered to 68ms (+4% shift).', timestamp: new Date().toLocaleTimeString() }
    },
    {
      event: 'notification_received',
      payload: { title: 'Hydration Target Alert', message: 'Hydration status optimal for upcoming session.', timestamp: new Date().toLocaleTimeString() }
    }
  ];

  const randomEvent = mockSocketEvents[Math.floor(Math.random() * mockSocketEvents.length)];
  io.emit(randomEvent.event, randomEvent.payload);
  io.emit('live_feed', randomEvent.payload);
}, 8000);

const apiRouter = express.Router();

// Register modular routers
apiRouter.use('/auth', authRouter);
apiRouter.use('/workouts', workoutsRouter);
apiRouter.use('/meals', mealsRouter);
apiRouter.use('/progress', progressRouter);

// ---------------- PROFILE & SETTINGS ROUTES ----------------
apiRouter.get('/user/profile', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: {
          full_name: req.user.name,
          age: 26,
          gender: 'Male',
          height: 182,
          weight: 81.5,
          fitness_goal: 'Muscle Gain',
          bmi: 24.6,
          experience_level: 'Intermediate',
          workout_duration: 45,
          equipment: 'Gym'
        }
      });
    }

    const profile = await getProfile(userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const heightInM = profile.height / 100;
    const bmi = Number((profile.weight / (heightInM * heightInM)).toFixed(1));

    res.json({
      success: true,
      data: {
        ...profile,
        bmi
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/user/profile', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { fullName, age, gender, height, weight, fitnessGoal, experienceLevel, workoutDuration, equipment } = req.body;

  try {
    if (userId === 901 || userId === 999) {
      return res.json({ success: true, message: 'Mock Profile updated (In-Memory only)' });
    }

    const currentProfile = await getProfile(userId);
    const weightChanged = currentProfile && Number(currentProfile.weight) !== Number(weight);

    const updated = await updateProfile(
      userId,
      fullName,
      Number(age),
      gender,
      Number(height),
      Number(weight),
      fitnessGoal,
      experienceLevel,
      Number(workoutDuration),
      equipment
    );

    if (weightChanged) {
      await logWeight(userId, Number(weight));
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- WEIGHT TRACKING ROUTES ----------------
apiRouter.get('/weight/history', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: [
          { weight: 83.5, logged_date: '2026-07-01' },
          { weight: 82.8, logged_date: '2026-07-08' },
          { weight: 82.0, logged_date: '2026-07-15' },
          { weight: 81.5, logged_date: '2026-07-22' }
        ]
      });
    }

    const history = await getWeightHistory(userId);
    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/weight/history', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { weight } = req.body;

  if (!weight) return res.status(400).json({ success: false, error: 'Weight is required' });

  try {
    if (userId === 901 || userId === 999) {
      return res.json({ success: true, message: 'Mock weight logged' });
    }

    const entry = await logWeight(userId, Number(weight));
    res.json({ success: true, data: entry });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- STREAKS ENDPOINT ----------------
apiRouter.get('/streaks', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: {
          current_streak: 14,
          longest_streak: 20,
          freeze_used_date: null,
          achievements: [{ badge_name: '3 Day Streak' }, { badge_name: '7 Day Streak' }],
          completions: [new Date().toISOString().split('T')[0]]
        }
      });
    }

    const streak = await getStreak(userId);
    const history = await getWorkoutHistory(userId);
    const completions = Array.from(new Set(history.map((h: any) => new Date(h.completed_at).toISOString().split('T')[0])));

    res.json({
      success: true,
      data: {
        ...streak,
        achievements: [],
        completions
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- RECOMMENDATIONS ENGINE ----------------
apiRouter.get('/dashboard/recommendations', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: {
          recommendation: 'Push Day (Chest focus)',
          reason: 'Your shoulders and chest are fully recovered (Readiness: 92%). Suggest maximizing hypertrophic load.'
        }
      });
    }

    const history = await getWorkoutHistory(userId);
    let recommendation = 'Full Body Workout';
    let reason = 'Keep your baseline physical conditioning active today.';

    if (history.length > 0) {
      const last = history[0];
      const lastMuscles = (last.muscles_trained || '').toLowerCase();

      if (lastMuscles.includes('chest') || lastMuscles.includes('shoulders')) {
        recommendation = 'Back Day (Pull Focus)';
        reason = 'Avoid taxing the anterior deltoids and chest in consecutive sessions. Let them recover.';
      } else if (lastMuscles.includes('back')) {
        recommendation = 'Leg Day (Lower Body)';
        reason = 'Back musculature demands adequate recovery. Pivot focus to posterior chain and legs.';
      } else if (lastMuscles.includes('legs')) {
        recommendation = 'Core & Mobility session';
        reason = 'Lower body recovery is high-energy. Focus on active flexibility and core strength.';
      }
    }

    res.json({
      success: true,
      data: { recommendation, reason }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- NOTIFICATIONS ENDPOINTS ----------------
apiRouter.get('/notifications', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: [
          { id: 1, title: 'Daily Hydro Target', message: 'Hydration verified optimal.', read: false, created_at: new Date() }
        ]
      });
    }

    const list = await getNotifications(userId);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/notifications/read', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId !== 901 && userId !== 999) {
      await markNotificationsRead(userId);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- MISC/COACH CHAT ENDPOINTS ----------------
apiRouter.post('/chat', async (req, res) => {
  const userMessage = req.body?.message || '';
  let responseText = '';

  try {
    const systemPrompt = "You are Coach Rachel, an elite AI Fitness & Performance Coach at FitAIX. You adapt plans based on biometric telemetry (HRV, CNS fatigue, streaks). Keep your response encouraging, highly actionable, concise (under 3 sentences), and professional.";
    const response = await getGroqChatCompletion(systemPrompt, userMessage);
    if (response) {
      responseText = response;
    }
  } catch (err) {
    console.error('Groq /chat failed:', err);
  }



  res.json({
    success: true,
    data: {
      id: `msg-${Date.now()}`,
      text: responseText,
      sender: 'rachel',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aiConfidence: 99,
      actionCards: [

        { id: 'act-2', title: 'Launch 7-Min Micro Workout', description: 'Protect streak with short session', actionType: 'trigger_micro_workout' }
      ]
    },
  });
});

apiRouter.get('/dashboard', authenticateToken, async (req: any, res: any) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: {
          user: req.user,
          recoveryScore: {
            overall: 88,
            hrvMs: 68,
            sleepHours: 8.2,
            readiness: { chest: 85, back: 95, legs: 72, shoulders: 80, arms: 90, core: 98 },
          },
          streak: { currentDays: 14, shieldActive: true, shieldsLeft: 2 },
          calories: { target: 2600, burned: 640, consumed: 1850 },
          hydration: { targetMl: 3500, consumedMl: 2250 },
          steps: 8425,
          distanceKm: 6.2,
        },
      });
    }

    const profile = await getProfile(userId);
    const streak = await getStreak(userId);

    res.json({
      success: true,
      data: {
        user: { ...req.user, name: profile?.full_name || req.user.username },
        recoveryScore: {
          overall: 85,
          hrvMs: 65,
          sleepHours: 7.8,
          readiness: { chest: 80, back: 85, legs: 90, shoulders: 80, arms: 90, core: 95 },
        },
        streak: { currentDays: streak.current_streak, shieldActive: !streak.freeze_used_date, shieldsLeft: streak.freeze_used_date ? 0 : 1 },
        calories: { target: profile?.fitness_goal === 'Weight Loss' ? 2000 : 2800, burned: 450, consumed: 1600 },
        hydration: { targetMl: 3000, consumedMl: 2000 },
        steps: 7250,
        distanceKm: 5.4,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed data schedules
apiRouter.get('/schedule', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: [
          { day: 'Mon', title: 'Hypertrophy Push A', muscle: 'Chest & Shoulders', stressLevel: 'amber', isCompleted: true },
          { day: 'Tue', title: 'Power Pull & Biceps', muscle: 'Back & Biceps', stressLevel: 'emerald', isCompleted: true },
          { day: 'Wed', title: 'Legs & Core Overload', muscle: 'Quads & Calves', stressLevel: 'rose', isCompleted: false, warning: 'High Hamstring Overuse Risk' },
          { day: 'Thu', title: 'Active Recovery & Mobility', muscle: 'Full Body Flexibility', stressLevel: 'emerald', isCompleted: false },
          { day: 'Fri', title: 'Upper Body Pump B', muscle: 'Chest, Arms & Back', stressLevel: 'amber', isCompleted: false },
          { day: 'Sat', title: 'Posterior Chain Explosive', muscle: 'Hamstrings & Glutes', stressLevel: 'amber', isCompleted: false },
          { day: 'Sun', title: 'Rest & Neural Reset', muscle: 'Recovery', stressLevel: 'emerald', isCompleted: false },
        ]
      });
    }
    const history = await getWorkoutHistory(userId);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const completedDays = new Set(history.map((h: any) => days[new Date(h.completed_at).getDay()]));
    const schedule = [
      { day: 'Mon', title: 'Push Day', muscle: 'Chest & Shoulders', stressLevel: 'amber', isCompleted: completedDays.has('Mon') },
      { day: 'Tue', title: 'Pull Day', muscle: 'Back & Biceps', stressLevel: 'emerald', isCompleted: completedDays.has('Tue') },
      { day: 'Wed', title: 'Leg Day', muscle: 'Quads & Hamstrings', stressLevel: 'rose', isCompleted: completedDays.has('Wed') },
      { day: 'Thu', title: 'Active Recovery', muscle: 'Mobility & Core', stressLevel: 'emerald', isCompleted: completedDays.has('Thu') },
      { day: 'Fri', title: 'Upper Body', muscle: 'Chest, Arms & Back', stressLevel: 'amber', isCompleted: completedDays.has('Fri') },
      { day: 'Sat', title: 'Posterior Chain', muscle: 'Hamstrings & Glutes', stressLevel: 'amber', isCompleted: completedDays.has('Sat') },
      { day: 'Sun', title: 'Rest & Reset', muscle: 'Recovery', stressLevel: 'emerald', isCompleted: false },
    ];
    res.json({ success: true, data: schedule });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/api/v1', apiRouter);

dbInit().then(() => {
  httpServer.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
});

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

// Socket.IO Mock Events
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
      payload: { message: 'AI auto-decreased Bench Press volume by 5% based on elevated morning RHR.', timestamp: new Date().toLocaleTimeString() }
    },
    {
      event: 'recovery_score_updated',
      payload: { overallScore: 88, hrvMs: 68, message: 'HRV baseline recovered to 68ms (+4% shift).', timestamp: new Date().toLocaleTimeString() }
    },
    {
      event: 'notification_received',
      payload: { title: 'Hydration Target Alert', message: 'Hydration status optimal for upcoming Push A session.', timestamp: new Date().toLocaleTimeString() }
    }
  ];

  const randomEvent = mockSocketEvents[Math.floor(Math.random() * mockSocketEvents.length)];
  io.emit(randomEvent.event, randomEvent.payload);
  io.emit('live_feed', randomEvent.payload);
}, 8000);


// REST API Routes
const apiRouter = express.Router();

const USERS: Record<string, any> = {
  'user': {
    id: 'usr-901',
    name: 'Alex Vance',
    username: 'user',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    goal: 'hypertrophy',
    scenarioMode: 'normal',
    viewMode: 'advanced',
  },
  'admin': {
    id: 'usr-999',
    name: 'Admin Moderator',
    username: 'admin',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    goal: 'management',
    scenarioMode: 'normal',
    viewMode: 'advanced',
  }
};

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  
  if (token === 'mock-user-token-123') {
    req.user = USERS['user'];
    next();
  } else if (token === 'mock-admin-token-456') {
    req.user = USERS['admin'];
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

apiRouter.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin') {
    res.json({
      success: true,
      data: {
        token: 'mock-admin-token-456',
        user: USERS['admin']
      }
    });
  } else if (username === 'user' && password === 'password') {
    res.json({
      success: true,
      data: {
        token: 'mock-user-token-123',
        user: USERS['user']
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid username or password'
    });
  }
});

apiRouter.get('/auth/me', authenticateToken, (req: any, res: any) => {
  res.json({
    success: true,
    data: req.user
  });
});

apiRouter.get('/admin/stats', authenticateToken, (req: any, res: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  
  res.json({
    success: true,
    data: {
      totalUsers: 148,
      activeSubscriptions: 124,
      neuralEngineLoad: '32%',
      databaseStatus: 'healthy',
      latencyMs: 14,
      systemAlerts: [
        { id: '1', level: 'warning', message: 'High CPU load on Socket processor: 76%', time: '10 mins ago' },
        { id: '2', level: 'info', message: 'Neural weights database successfully backed up.', time: '1 hour ago' }
      ],
      userList: [
        { id: 'usr-901', name: 'Alex Vance', email: 'alex@fitaix.com', role: 'user', lastActive: 'Just now' },
        { id: 'usr-902', name: 'Sarah Connor', email: 'sarah@fitaix.com', role: 'user', lastActive: '5 mins ago' },
        { id: 'usr-903', name: 'Bruce Wayne', email: 'bruce@fitaix.com', role: 'user', lastActive: '12 mins ago' },
        { id: 'usr-999', name: 'Admin Moderator', email: 'admin@fitaix.com', role: 'admin', lastActive: 'Just now' }
      ]
    }
  });
});

apiRouter.post('/admin/simulate-event', authenticateToken, (req: any, res: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  
  const { eventType } = req.body;
  let payload = {};
  let event = '';

  if (eventType === 'workout') {
    event = 'workout_updated';
    payload = { message: 'AI dynamically adjusted chest volume by +10% based on high recovery score.', timestamp: new Date().toLocaleTimeString() };
  } else if (eventType === 'recovery') {
    event = 'recovery_score_updated';
    payload = { overallScore: 94, hrvMs: 74, message: 'Neural HRV spikes to 74ms (+9%). Recommendation: Push load limits.', timestamp: new Date().toLocaleTimeString() };
  } else {
    event = 'notification_received';
    payload = { title: 'Admin Manual Override', message: 'Admin triggered a global optimization reset.', timestamp: new Date().toLocaleTimeString() };
  }

  io.emit(event, payload);
  io.emit('live_feed', payload);

  res.json({ success: true, message: `Simulated event: ${event}` });
});

apiRouter.get('/dashboard', authenticateToken, (req: any, res: any) => {
  res.json({
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
    },
  });
});


apiRouter.get('/workouts/today', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'session-001',
      title: 'Hypertrophy Push & Core A',
      subtitle: 'AI Adapted: Load -5% due to 68ms HRV recovery score',
      estimatedDurationMins: 45,
      targetMuscles: ['chest', 'shoulders', 'arms', 'core'],
      scenario: 'normal',
      version: 'v2.4-AI-Optimized',
      isCompleted: false,
      exercises: [
        {
          id: 'ex-1',
          name: 'Incline Dumbbell Bench Press',
          category: 'chest',
          targetMuscles: ['Upper Chest', 'Anterior Delts'],
          equipmentNeeded: 'Dumbbells, Bench',
          tempo: '3-1-1-0',
          restTimerSeconds: 90,
          aiAdjustmentReason: 'RPE 8 -> 7. Volume auto-decreased by 5% based on HRV pulse.',
          aiConfidencePercent: 96,
          sets: [
            { setNumber: 1, targetReps: 10, weightLbs: 70, completed: true, completedReps: 10 },
            { setNumber: 2, targetReps: 10, weightLbs: 70, completed: false, completedReps: 0 },
            { setNumber: 3, targetReps: 8, weightLbs: 70, completed: false, completedReps: 0 },
          ],
        },
        {
          id: 'ex-2',
          name: 'Seated Overhead Dumbbell Press',
          category: 'shoulders',
          targetMuscles: ['Front Delts', 'Triceps'],
          equipmentNeeded: 'Dumbbells',
          tempo: '2-0-1-0',
          restTimerSeconds: 75,
          aiAdjustmentReason: 'Substituted Barbell for Dumbbell to reduce axial spine compression.',
          aiConfidencePercent: 92,
          sets: [
            { setNumber: 1, targetReps: 12, weightLbs: 50, completed: false, completedReps: 0 },
            { setNumber: 2, targetReps: 10, weightLbs: 50, completed: false, completedReps: 0 },
          ],
        },
      ],
    },
  });
});

apiRouter.patch('/exercises/:id', (req, res) => {
  res.json({
    success: true,
    data: { exerciseId: req.params.id, updatedFields: req.body },
    message: 'Exercise updated successfully.',
  });
});

apiRouter.post('/chat', (req, res) => {
  const userMessage = req.body?.message || '';
  let responseText = "I've recalibrated your training load based on your latest recovery telemetry. How else can I optimize your routine?";
  
  if (userMessage.toLowerCase().includes('travel')) {
    responseText = "Travel Mode activated! I've swapped heavy iron exercises for high-tension bodyweight and resistance band protocols.";
  } else if (userMessage.toLowerCase().includes('20 min') || userMessage.toLowerCase().includes('time')) {
    responseText = "Express Mode triggered! I've compressed your Push A session into a 20-minute mechanical tension superset.";
  }

  res.json({
    success: true,
    data: {
      id: `msg-${Date.now()}`,
      text: responseText,
      sender: 'rachel',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aiConfidence: 97,
      actionCards: [
        { id: 'act-1', title: 'Enable Travel Mode', description: 'Switch to bodyweight / resistance bands', actionType: 'switch_scenario' },
        { id: 'act-2', title: 'Launch 7-Min Micro Workout', description: 'Protect streak with short session', actionType: 'trigger_micro_workout' }
      ]
    },
  });
});

apiRouter.get('/progress', (req, res) => {
  res.json({
    success: true,
    data: {
      points: [
        { date: 'May 1', bench1RM: 215, squat1RM: 285, bodyWeightLbs: 178.5, adherenceRatePercent: 90 },
        { date: 'Jun 1', bench1RM: 225, squat1RM: 300, bodyWeightLbs: 179.8, adherenceRatePercent: 96 },
        { date: 'Jul 1', bench1RM: 235, squat1RM: 315, bodyWeightLbs: 180.8, adherenceRatePercent: 98 },
        { date: 'Jul 15', bench1RM: 242, squat1RM: 325, bodyWeightLbs: 181.5, adherenceRatePercent: 100 },
      ],
      aiEvents: [
        { id: 'e1', date: 'Yesterday', title: 'Fatigue Auto-Compensation', category: 'volume_adjustment', description: 'Adjusted volume by -1 set based on 42ms HRV pulse.', impactBadge: '-15% Nervous Fatigue' },
        { id: 'e2', date: '3 Days Ago', title: 'Streak Shield Auto-Deployed', category: 'streak_shield', description: 'Preserved 14-day streak during flight delay.', impactBadge: 'Streak Protected' }
      ]
    }
  });
});

apiRouter.get('/schedule', (req, res) => {
  res.json({
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
});

apiRouter.get('/meals', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'm1', title: 'Anabolic Berry Protein Oats', mealType: 'Breakfast', calories: 520, proteinGrams: 45, carbsGrams: 62, fatGrams: 10, prepTimeMins: 8, budgetTier: '$' },
      { id: 'm2', title: 'Flame-Grilled Chicken Bowl & Quinoa', mealType: 'Lunch', calories: 680, proteinGrams: 58, carbsGrams: 65, fatGrams: 16, prepTimeMins: 15, budgetTier: '$$' },
      { id: 'm3', title: 'Seared Wild Salmon & Sweet Potato Mash', mealType: 'Dinner', calories: 740, proteinGrams: 52, carbsGrams: 55, fatGrams: 28, prepTimeMins: 20, budgetTier: '$$$' },
      { id: 'm4', title: 'Greek Yogurt & Honey Nut Crunch', mealType: 'Snack', calories: 310, proteinGrams: 30, carbsGrams: 28, fatGrams: 8, prepTimeMins: 3, budgetTier: '$' }
    ]
  });
});

app.use('/api/v1', apiRouter);

httpServer.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

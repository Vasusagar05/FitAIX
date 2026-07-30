import express from 'express';
import { authenticateToken } from './auth';
import { getGroqChatCompletion } from '../services/groqService';
import {
  createWorkoutPlan,
  createWorkoutExercise,
  getLatestWorkoutPlan,
  completeWorkoutLog,
  updateStreakOnWorkout,
  addAchievement,
  createNotification,
  getWorkoutHistory,
  getStreak,
  getAchievements
} from '../db/db';

export const workoutsRouter = express.Router();

const EXERCISE_LIBRARY: Record<string, any[]> = {
  chest: [
    { name: 'Incline Dumbbell Bench Press', category: 'chest', rest: 90, sets: 4, reps: '10-12 reps', alt: 'Push-Ups (Chest Focus)' },
    { name: 'Barbell Flat Bench Press', category: 'chest', rest: 120, sets: 4, reps: '8-10 reps', alt: 'Dumbbell Floor Press' },
    { name: 'Cable Chest Flyes', category: 'chest', rest: 75, sets: 3, reps: '12-15 reps', alt: 'Resistance Band Flyes' },
    { name: 'Decline Chest Press Machine', category: 'chest', rest: 90, sets: 3, reps: '10 reps', alt: 'Decline Push-Ups' },
    { name: 'Push-Ups', category: 'chest', rest: 60, sets: 4, reps: 'Max Reps', alt: 'Knee Push-Ups' },
    { name: 'Dumbbell Floor Press', category: 'chest', rest: 90, sets: 3, reps: '12 reps', alt: 'Push-Ups' }
  ],
  back: [
    { name: 'Deadlift', category: 'back', rest: 150, sets: 3, reps: '5-8 reps', alt: 'Barbell Row' },
    { name: 'Lat Pulldown', category: 'back', rest: 90, sets: 4, reps: '10-12 reps', alt: 'Pull-Ups' },
    { name: 'Bent Over Barbell Row', category: 'back', rest: 90, sets: 4, reps: '8-10 reps', alt: 'Single-Arm Dumbbell Row' },
    { name: 'Pull-Ups', category: 'back', rest: 90, sets: 4, reps: 'Max Reps', alt: 'Inverted Rows' },
    { name: 'Single-Arm Dumbbell Row', category: 'back', rest: 90, sets: 3, reps: '12 reps', alt: 'Resistance Band Row' }
  ],
  legs: [
    { name: 'Barbell Back Squat', category: 'legs', rest: 120, sets: 4, reps: '8-10 reps', alt: 'Goblet Squat' },
    { name: 'Romanian Deadlift', category: 'legs', rest: 90, sets: 4, reps: '10 reps', alt: 'Dumbbell RDL' },
    { name: 'Leg Press', category: 'legs', rest: 90, sets: 3, reps: '12 reps', alt: 'Bulgarian Split Squat' },
    { name: 'Bodyweight Squats', category: 'legs', rest: 60, sets: 4, reps: '20 reps', alt: 'Lunges' },
    { name: 'Bulgarian Split Squats', category: 'legs', rest: 90, sets: 3, reps: '10 reps each', alt: 'Dumbbell Squats' },
    { name: 'Walking Lunges', category: 'legs', rest: 60, sets: 3, reps: '12 reps per leg', alt: 'Step-Ups' }
  ],
  shoulders: [
    { name: 'Overhead Barbell Press', category: 'shoulders', rest: 120, sets: 4, reps: '8 reps', alt: 'Dumbbell Shoulder Press' },
    { name: 'Dumbbell Lateral Raise', category: 'shoulders', rest: 75, sets: 3, reps: '12-15 reps', alt: 'Resistance Band Lateral Raise' },
    { name: 'Face Pulls', category: 'shoulders', rest: 75, sets: 3, reps: '15 reps', alt: 'Band Pull-Apart' },
    { name: 'Pike Push-Ups', category: 'shoulders', rest: 90, sets: 3, reps: '8-10 reps', alt: 'Decline Push-Ups' }
  ],
  arms: [
    { name: 'Barbell Bicep Curl', category: 'arms', rest: 75, sets: 3, reps: '10-12 reps', alt: 'Dumbbell Curl' },
    { name: 'Tricep Rope Overhead Extension', category: 'arms', rest: 75, sets: 3, reps: '12 reps', alt: 'Dumbbell Kickbacks' },
    { name: 'Dumbbell Hammer Curl', category: 'arms', rest: 60, sets: 3, reps: '12 reps', alt: 'Resistance Band Curls' },
    { name: 'Bench Dips', category: 'arms', rest: 60, sets: 3, reps: '15 reps', alt: 'Diamond Push-Ups' }
  ],
  core: [
    { name: 'Hanging Leg Raise', category: 'core', rest: 60, sets: 3, reps: '12 reps', alt: 'Lying Leg Raises' },
    { name: 'Plank', category: 'core', rest: 45, sets: 3, reps: '60 seconds', alt: 'Knee Plank' },
    { name: 'Russian Twist', category: 'core', rest: 45, sets: 3, reps: '20 reps each side', alt: 'Bicycle Crunches' },
    { name: 'Ab Wheel Rollout', category: 'core', rest: 60, sets: 3, reps: '10 reps', alt: 'Plank' }
  ],
  cardio: [
    { name: 'Treadmill HIIT Sprints', category: 'cardio', rest: 60, sets: 5, reps: '30s sprint / 60s jog', alt: 'Jumping Jacks' },
    { name: 'Burpees', category: 'cardio', rest: 45, sets: 4, reps: '45 seconds', alt: 'Jumping Jacks' },
    { name: 'Mountain Climbers', category: 'cardio', rest: 30, sets: 3, reps: '45 seconds', alt: 'High Knees' },
    { name: 'Jump Rope', category: 'cardio', rest: 45, sets: 4, reps: '60 seconds', alt: 'Jumping Jacks' }
  ]
};

workoutsRouter.post('/generate', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { muscles, duration, level, equipment } = req.body;

  if (!muscles || muscles.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one muscle group must be selected.' });
  }

  try {
    const exerciseLimit = duration === 20 ? 4 : duration === 30 ? 5 : duration === 45 ? 6 : 8;
    const title = `${level} ${muscles.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1)).join(' + ')} Protocol`;
    let exercises: any[] = [];
    let warmup = '5-10 minutes dynamic stretching, shoulder dislocates, and light cardiovascular activation.';
    let cooldown = '5 minutes static stretching focusing on target muscle groups and diaphragmatic breathing.';

    try {
      const systemPrompt = `You are an elite exercise physiology coach. 
Generate a customized workout plan. 
Output ONLY in valid JSON format without markdown code blocks, do not include \`\`\`json:
{
  "warmup": "description of warmup",
  "cooldown": "description of cooldown",
  "exercises": [
    {
      "name": "Exercise name",
      "category": "target muscle",
      "sets": number,
      "reps": "reps string (e.g. '10-12 reps')",
      "rest_time": "rest string (e.g. '60s')",
      "alternatives": "alternative exercise"
    }
  ]
}`;
      const userPrompt = `Protocol: ${title}. Target Muscles: ${muscles.join(', ')}. Duration: ${duration} minutes. Level: ${level}. Equipment: ${equipment}. Generate exactly ${exerciseLimit} exercises.`;
      
      const response = await getGroqChatCompletion(systemPrompt, userPrompt);
      if (response) {
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        if (parsed.warmup) warmup = parsed.warmup;
        if (parsed.cooldown) cooldown = parsed.cooldown;
        if (parsed.exercises && Array.isArray(parsed.exercises)) {
          exercises = parsed.exercises;
        }
      }
    } catch (e) {
      console.warn("Groq workout generation failed, using local presets.");
    }

    if (exercises.length === 0) {
      const getCompatibleExercises = (muscleGroup: string) => {
        const all = EXERCISE_LIBRARY[muscleGroup.toLowerCase()] || [];
        if (equipment === 'No Equipment') {
          return all.filter((e) => e.name.toLowerCase().includes('push-up') || e.name.toLowerCase().includes('bodyweight') || e.name.toLowerCase().includes('plank') || e.name.toLowerCase().includes('burpee') || e.name.toLowerCase().includes('mountain') || e.name.toLowerCase().includes('lunge') || e.name.toLowerCase().includes('dip'));
        }
        return all;
      };

      let iterations = 0;
      while (exercises.length < exerciseLimit && iterations < 20) {
        iterations++;
        for (const m of muscles) {
          if (exercises.length >= exerciseLimit) break;
          const pool = getCompatibleExercises(m);
          if (pool.length > 0) {
            const unselected = pool.filter((e) => !exercises.some((se) => se.name === e.name));
            if (unselected.length > 0) {
              const picked = unselected[Math.floor(Math.random() * unselected.length)];
              exercises.push({
                name: picked.name,
                category: picked.category,
                sets: level === 'Beginner' ? 3 : level === 'Intermediate' ? 4 : 5,
                reps: picked.reps,
                rest_time: `${picked.rest}s`,
                alternatives: picked.alt
              });
            }
          }
        }
      }
    }

    const caloriesEstimated = (duration || 45) * (level === 'Beginner' ? 6 : level === 'Intermediate' ? 8 : 10);

    let plan;
    if (userId !== 901 && userId !== 999) {
      plan = await createWorkoutPlan(
        userId,
        title,
        warmup,
        level,
        Number(duration),
        caloriesEstimated,
        cooldown
      );

      for (const ex of exercises) {
        await createWorkoutExercise(
          plan.id,
          ex.name,
          ex.sets,
          ex.reps,
          ex.rest_time,
          ex.alternatives,
          ex.category
        );
      }
      plan = await getLatestWorkoutPlan(userId);
    } else {
      plan = {
        id: Math.floor(Math.random() * 1000),
        title,
        warmup,
        difficulty: level,
        duration_mins: Number(duration),
        calories_estimated: caloriesEstimated,
        cooldown,
        exercises
      };
    }

    res.json({ success: true, data: plan });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

workoutsRouter.get('/today', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: {
          id: 'mock-plan-1',
          title: 'Push Hypertrophy',
          estimatedDurationMins: 45,
          targetMuscles: ['Chest', 'Shoulders', 'Arms'],
          version: 'v4.2',
          exercises: [
            { id: '1', name: 'Incline Dumbbell Bench Press', category: 'chest', targetMuscles: ['Chest'], equipmentNeeded: 'Dumbbells', restTimerSeconds: 90, sets: [{ setNumber: 1, targetReps: 12, completedReps: 0, weightLbs: 50, completed: false }] }
          ]
        }
      });
    }

    const plan = await getLatestWorkoutPlan(userId);
    if (!plan) {
      return res.json({ success: true, data: null });
    }

    const mapped = {
      id: plan.id,
      title: plan.title,
      subtitle: `${plan.difficulty} • ${plan.duration_mins} mins • ${plan.calories_estimated} kcal`,
      estimatedDurationMins: plan.duration_mins,
      targetMuscles: plan.exercises.map((e: any) => e.category),
      version: 'Adaptive AI v1.0',
      exercises: plan.exercises.map((e: any) => ({
        id: String(e.id),
        name: e.name,
        category: e.category,
        targetMuscles: [e.category],
        equipmentNeeded: 'Available Equipment',
        restTimerSeconds: parseInt(e.rest_time, 10) || 60,
        sets: Array.from({ length: e.sets }).map((_, sIdx) => ({
          setNumber: sIdx + 1,
          targetReps: parseInt(e.reps, 10) || 10,
          completedReps: 0,
          weightLbs: 45,
          completed: false
        }))
      }))
    };

    res.json({ success: true, data: mapped });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

workoutsRouter.post('/complete', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { planId, title, durationMins, caloriesBurned, musclesTrained } = req.body;

  try {
    let streak;
    if (userId !== 901 && userId !== 999) {
      await completeWorkoutLog(
        userId,
        planId ? Number(planId) : null,
        title || 'AI Generated Workout',
        Number(durationMins) || 45,
        Number(caloriesBurned) || 350,
        musclesTrained || 'Full Body',
        'Completed'
      );

      streak = await updateStreakOnWorkout(userId);

      const currentVal = streak.current_streak;
      const milestones = [3, 7, 15, 30, 50, 100];
      for (const m of milestones) {
        if (currentVal >= m) {
          const unlocked = await addAchievement(userId, `${m} Day Streak`);
          if (unlocked) {
            await createNotification(
              userId,
              `New Badge Unlocked! 🏆`,
              `Incredible! You unlocked the ${m} Day Streak badge. Keep pushing your physical limits.`
            );
          }
        }
      }
    } else {
      streak = { current_streak: 15, longest_streak: 20 };
    }

    res.json({ success: true, data: { streak } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

workoutsRouter.get('/history', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { filter } = req.query;

  try {
    if (userId === 901 || userId === 999) {
      return res.json({
        success: true,
        data: [
          { id: 1, title: 'Beginner Chest + Shoulders', duration_mins: 45, calories_burned: 360, muscles_trained: 'chest, shoulders', completion_status: 'Completed', completed_at: new Date().toISOString() }
        ]
      });
    }

    let history = await getWorkoutHistory(userId);

    if (filter) {
      const now = new Date();
      history = history.filter((h: any) => {
        const itemDate = new Date(h.completed_at);
        const diffMs = now.getTime() - itemDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (filter === 'week') return diffDays <= 7;
        if (filter === 'month') return diffDays <= 30;
        if (filter === 'year') return diffDays <= 365;
        return true;
      });
    }

    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

workoutsRouter.post('/manual', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { title, exercises, duration } = req.body;

  if (!title || !exercises || exercises.length === 0) {
    return res.status(400).json({ success: false, error: 'title and exercises are required' });
  }

  try {
    let plan;
    if (userId !== 901 && userId !== 999) {
      plan = await createWorkoutPlan(
        userId, title,
        '5-10 minutes dynamic stretching',
        'Intermediate', Number(duration) || 45,
        (Number(duration) || 45) * 8, '5 minutes static stretching'
      );
      for (const ex of exercises) {
        await createWorkoutExercise(plan.id, ex.name, ex.sets, ex.reps, `${ex.rest}s`, ex.alternatives || '', ex.category || 'custom');
      }
      plan = await getLatestWorkoutPlan(userId);
    } else {
      plan = {
        id: `manual-${Date.now()}`,
        title,
        difficulty: 'Intermediate',
        duration_mins: Number(duration) || 45,
        calories_estimated: (Number(duration) || 45) * 8,
        exercises: exercises.map((ex: any, i: number) => ({
          id: String(i + 1), name: ex.name, category: ex.category || 'custom',
          targetMuscles: [ex.category || 'custom'], equipmentNeeded: 'As needed',
          restTimerSeconds: Number(ex.rest) || 60,
          sets: Array.from({ length: Number(ex.sets) || 3 }).map((_, si) => ({
            setNumber: si + 1, targetReps: Number(ex.reps) || 10, completedReps: 0, weightLbs: 45, completed: false
          }))
        }))
      };
    }
    res.json({ success: true, data: plan });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

workoutsRouter.get('/streak-saver', authenticateToken, async (req: any, res) => {
  const quickPlan = {
    id: `streak-${Date.now()}`,
    title: '15-Min Streak Saver',
    subtitle: 'Quick • 15 mins • ~120 kcal',
    estimatedDurationMins: 15,
    targetMuscles: ['Full Body'],
    version: 'Streak AI v1.0',
    exercises: [
      { id: 's1', name: 'Burpees', category: 'cardio', targetMuscles: ['Full Body'], equipmentNeeded: 'None', restTimerSeconds: 30, sets: [{ setNumber: 1, targetReps: 10, completedReps: 0, weightLbs: 0, completed: false }, { setNumber: 2, targetReps: 10, completedReps: 0, weightLbs: 0, completed: false }] },
      { id: 's2', name: 'Push-Ups', category: 'chest', targetMuscles: ['Chest'], equipmentNeeded: 'None', restTimerSeconds: 30, sets: [{ setNumber: 1, targetReps: 15, completedReps: 0, weightLbs: 0, completed: false }, { setNumber: 2, targetReps: 15, completedReps: 0, weightLbs: 0, completed: false }] },
      { id: 's3', name: 'Bodyweight Squats', category: 'legs', targetMuscles: ['Legs'], equipmentNeeded: 'None', restTimerSeconds: 30, sets: [{ setNumber: 1, targetReps: 20, completedReps: 0, weightLbs: 0, completed: false }, { setNumber: 2, targetReps: 20, completedReps: 0, weightLbs: 0, completed: false }] },
      { id: 's4', name: 'Plank', category: 'core', targetMuscles: ['Core'], equipmentNeeded: 'None', restTimerSeconds: 30, sets: [{ setNumber: 1, targetReps: 45, completedReps: 0, weightLbs: 0, completed: false }] },
    ]
  };
  res.json({ success: true, data: quickPlan });
});

// ── GET /analytics ── Build weekly stats from real workout history ────────────
workoutsRouter.get('/analytics', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    const history = await getWorkoutHistory(userId);
    const streak = await getStreak(userId);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    // Build last 7 days array
    const weeklyWorkouts = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const dayLabel = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];

      // Find all workouts on this day
      const dayWorkouts = history.filter((h: any) => {
        const hDate = new Date(h.completed_at).toISOString().split('T')[0];
        return hDate === dateStr;
      });

      const completed = dayWorkouts.length > 0;
      const duration = dayWorkouts.reduce((sum: number, h: any) => sum + (h.duration_mins || 0), 0);
      const calories = dayWorkouts.reduce((sum: number, h: any) => sum + (h.calories_burned || 0), 0);
      const muscles = [...new Set(dayWorkouts.flatMap((h: any) =>
        (h.muscles_trained || '').split(',').map((m: string) => m.trim()).filter(Boolean)
      ))].join(', ');

      return { day: dayLabel, date: dateStr, completed, duration, calories, muscles };
    });

    const completedDays = weeklyWorkouts.filter(d => d.completed);
    const totalWeeklyCalories = weeklyWorkouts.reduce((s, d) => s + d.calories, 0);
    const avgDuration = completedDays.length > 0
      ? Math.round(completedDays.reduce((s, d) => s + d.duration, 0) / completedDays.length)
      : 0;

    // Strength progress from history (last 7 sessions)
    const strengthProgress = history.slice(0, 7).reverse().map((h: any, i: number) => ({
      date: new Date(h.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: h.calories_burned || 0,
      duration: h.duration_mins || 0,
      muscles: h.muscles_trained || 'N/A',
    }));

    res.json({
      success: true,
      data: {
        weeklyWorkouts,
        totalWeeklyCalories,
        avgDuration,
        streakDays: streak?.current_streak || 0,
        strengthProgress,
        totalWorkouts: history.length,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /ai-recommendations ── Derive muscle balance from history ─────────────
workoutsRouter.get('/ai-recommendations', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  try {
    const history = await getWorkoutHistory(userId);

    // Count muscle group sessions in last 7 days
    const now = new Date();
    const weekHistory = history.filter((h: any) => {
      const diff = (now.getTime() - new Date(h.completed_at).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    const muscleCount: Record<string, number> = {};
    const allMuscles = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'];

    weekHistory.forEach((h: any) => {
      const muscles = (h.muscles_trained || '').split(',').map((m: string) => m.trim().toLowerCase());
      muscles.forEach((m: string) => {
        if (m) muscleCount[m] = (muscleCount[m] || 0) + 1;
      });
    });

    const overtrained: any[] = [];
    const undertrained: any[] = [];
    const wellBalanced: any[] = [];

    allMuscles.forEach(muscle => {
      const sessions = muscleCount[muscle] || 0;
      const recoveryPercent = Math.max(0, Math.min(100, 100 - sessions * 25));
      const entry = { muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1), sessionsThisWeek: sessions, recoveryPercent };

      if (sessions >= 4) overtrained.push({ ...entry, advice: 'Rest this group — high fatigue risk.' });
      else if (sessions === 0) undertrained.push({ ...entry, advice: 'Not trained this week. Consider a session.' });
      else wellBalanced.push(entry);
    });

    let recommendation = 'Keep balanced training across all muscle groups.';
    let reason = 'Your weekly split looks consistent. Maintain progressive overload.';

    if (overtrained.length > 0) {
      recommendation = `Rest ${overtrained[0].muscle} — prioritize recovery`;
      reason = `${overtrained[0].muscle} has been trained ${overtrained[0].sessionsThisWeek} times this week, which may cause overtraining.`;
    } else if (undertrained.length > 0) {
      recommendation = `Train ${undertrained[0].muscle} — it needs attention`;
      reason = `${undertrained[0].muscle} hasn't been trained this week. Include it in your next session.`;
    }

    res.json({
      success: true,
      data: { overtrained, undertrained, wellBalanced, recommendation, reason }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


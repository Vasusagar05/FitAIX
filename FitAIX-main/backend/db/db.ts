import pool from './pool';
import fs from 'fs';
import path from 'path';

const LOCAL_STORE_PATH = path.join(__dirname, 'local_store.json');

export let useFallback = false;

// Initialize local store file if not exists
export function getLocalStore() {
  if (!fs.existsSync(LOCAL_STORE_PATH)) {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify({
      users: [],
      user_profiles: [],
      weight_history: [],
      workout_plans: [],
      workout_exercises: [],
      workout_history: [],
      streaks: [],
      achievements: [],
      notifications: []
    }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
  } catch (e) {
    return {
      users: [],
      user_profiles: [],
      weight_history: [],
      workout_plans: [],
      workout_exercises: [],
      workout_history: [],
      streaks: [],
      achievements: [],
      notifications: []
    };
  }
}

export function saveLocalStore(data: any) {
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(data, null, 2));
}

// Database tables initialization
export async function dbInit() {
  try {
    // Try simple query
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL database connected. Initializing tables...');

    // Create tables in correct dependency order
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(20) NOT NULL,
        height DECIMAL NOT NULL,
        weight DECIMAL NOT NULL,
        fitness_goal VARCHAR(50) NOT NULL,
        experience_level VARCHAR(20) DEFAULT 'Intermediate',
        workout_duration INTEGER DEFAULT 45,
        equipment VARCHAR(20) DEFAULT 'Gym'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS weight_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        weight DECIMAL NOT NULL,
        logged_date TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS workout_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        warmup TEXT,
        difficulty VARCHAR(20),
        duration_mins INTEGER,
        calories_estimated INTEGER,
        cooldown TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id SERIAL PRIMARY KEY,
        plan_id INTEGER REFERENCES workout_plans(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        sets INTEGER,
        reps VARCHAR(50),
        rest_time VARCHAR(50),
        alternatives TEXT,
        category VARCHAR(50)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS workout_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id INTEGER REFERENCES workout_plans(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        duration_mins INTEGER,
        calories_burned INTEGER,
        muscles_trained VARCHAR(255),
        completion_status VARCHAR(50),
        completed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS streaks (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_completed_date DATE,
        freeze_used_date DATE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        badge_name VARCHAR(50) NOT NULL,
        unlocked_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, badge_name)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('PostgreSQL database initialization complete.');
  } catch (err: any) {
    console.warn(`PostgreSQL database initialization failed (${err.message || 'ECONNREFUSED'}). Falling back to local JSON store.`);
    useFallback = true;
    getLocalStore(); // ensures local_store.json exists
  }
}

// ---------------- USER OPERATIONS ----------------
export async function createUser(username: string, email: string, passwordHash: string) {
  if (useFallback) {
    const store = getLocalStore();
    const newUser = {
      id: store.users.length + 1,
      username,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    };
    store.users.push(newUser);
    saveLocalStore(store);
    return newUser;
  } else {
    const res = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, passwordHash]
    );
    return res.rows[0];
  }
}

export async function getUserByUsername(username: string) {
  if (useFallback) {
    const store = getLocalStore();
    return store.users.find((u: any) => u.username === username) || null;
  } else {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0] || null;
  }
}

export async function getUserByEmail(email: string) {
  if (useFallback) {
    const store = getLocalStore();
    return store.users.find((u: any) => u.email === email) || null;
  } else {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  }
}

export async function getUserById(id: number) {
  if (useFallback) {
    const store = getLocalStore();
    return store.users.find((u: any) => u.id === id) || null;
  } else {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
}

// ---------------- PROFILE OPERATIONS ----------------
export async function createProfile(
  userId: number,
  fullName: string,
  age: number,
  gender: string,
  height: number,
  weight: number,
  fitnessGoal: string
) {
  if (useFallback) {
    const store = getLocalStore();
    const newProfile = {
      user_id: userId,
      full_name: fullName,
      age,
      gender,
      height,
      weight,
      fitness_goal: fitnessGoal,
      experience_level: 'Intermediate',
      workout_duration: 45,
      equipment: 'Gym'
    };
    store.user_profiles.push(newProfile);
    saveLocalStore(store);
    return newProfile;
  } else {
    const res = await pool.query(
      'INSERT INTO user_profiles (user_id, full_name, age, gender, height, weight, fitness_goal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, fullName, age, gender, height, weight, fitnessGoal]
    );
    return res.rows[0];
  }
}

export async function getProfile(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    return store.user_profiles.find((p: any) => p.user_id === userId) || null;
  } else {
    const res = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    return res.rows[0] || null;
  }
}

export async function updateProfile(
  userId: number,
  fullName: string,
  age: number,
  gender: string,
  height: number,
  weight: number,
  fitnessGoal: string,
  experienceLevel: string,
  workoutDuration: number,
  equipment: string
) {
  if (useFallback) {
    const store = getLocalStore();
    const idx = store.user_profiles.findIndex((p: any) => p.user_id === userId);
    const updated = {
      user_id: userId,
      full_name: fullName,
      age,
      gender,
      height,
      weight,
      fitness_goal: fitnessGoal,
      experience_level: experienceLevel,
      workout_duration: workoutDuration,
      equipment
    };
    if (idx !== -1) {
      store.user_profiles[idx] = updated;
    } else {
      store.user_profiles.push(updated);
    }
    saveLocalStore(store);
    return updated;
  } else {
    const res = await pool.query(
      `INSERT INTO user_profiles (user_id, full_name, age, gender, height, weight, fitness_goal, experience_level, workout_duration, equipment)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (user_id) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         age = EXCLUDED.age,
         gender = EXCLUDED.gender,
         height = EXCLUDED.height,
         weight = EXCLUDED.weight,
         fitness_goal = EXCLUDED.fitness_goal,
         experience_level = EXCLUDED.experience_level,
         workout_duration = EXCLUDED.workout_duration,
         equipment = EXCLUDED.equipment
       RETURNING *`,
      [userId, fullName, age, gender, height, weight, fitnessGoal, experienceLevel, workoutDuration, equipment]
    );
    return res.rows[0];
  }
}

// ---------------- WEIGHT OPERATIONS ----------------
export async function logWeight(userId: number, weight: number) {
  if (useFallback) {
    const store = getLocalStore();
    const entry = {
      id: store.weight_history.length + 1,
      user_id: userId,
      weight,
      logged_date: new Date().toISOString()
    };
    store.weight_history.push(entry);
    
    // Also update weight in main profile
    const pIdx = store.user_profiles.findIndex((p: any) => p.user_id === userId);
    if (pIdx !== -1) {
      store.user_profiles[pIdx].weight = weight;
    }
    saveLocalStore(store);
    return entry;
  } else {
    await pool.query('UPDATE user_profiles SET weight = $1 WHERE user_id = $2', [weight, userId]);
    const res = await pool.query(
      'INSERT INTO weight_history (user_id, weight) VALUES ($1, $2) RETURNING *',
      [userId, weight]
    );
    return res.rows[0];
  }
}

export async function getWeightHistory(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    return store.weight_history
      .filter((w: any) => w.user_id === userId)
      .sort((a: any, b: any) => new Date(a.logged_date).getTime() - new Date(b.logged_date).getTime());
  } else {
    const res = await pool.query(
      'SELECT * FROM weight_history WHERE user_id = $1 ORDER BY logged_date ASC',
      [userId]
    );
    return res.rows;
  }
}

// ---------------- WORKOUT PLANS ----------------
export async function createWorkoutPlan(
  userId: number,
  title: string,
  warmup: string,
  difficulty: string,
  durationMins: number,
  caloriesEstimated: number,
  cooldown: string
) {
  if (useFallback) {
    const store = getLocalStore();
    const plan = {
      id: store.workout_plans.length + 1,
      user_id: userId,
      title,
      warmup,
      difficulty,
      duration_mins: durationMins,
      calories_estimated: caloriesEstimated,
      cooldown,
      created_at: new Date().toISOString()
    };
    store.workout_plans.push(plan);
    saveLocalStore(store);
    return plan;
  } else {
    const res = await pool.query(
      `INSERT INTO workout_plans (user_id, title, warmup, difficulty, duration_mins, calories_estimated, cooldown)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, title, warmup, difficulty, durationMins, caloriesEstimated, cooldown]
    );
    return res.rows[0];
  }
}

export async function createWorkoutExercise(
  planId: number,
  name: string,
  sets: number,
  reps: string,
  restTime: string,
  alternatives: string,
  category: string
) {
  if (useFallback) {
    const store = getLocalStore();
    const ex = {
      id: store.workout_exercises.length + 1,
      plan_id: planId,
      name,
      sets,
      reps,
      rest_time: restTime,
      alternatives,
      category
    };
    store.workout_exercises.push(ex);
    saveLocalStore(store);
    return ex;
  } else {
    const res = await pool.query(
      `INSERT INTO workout_exercises (plan_id, name, sets, reps, rest_time, alternatives, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [planId, name, sets, reps, restTime, alternatives, category]
    );
    return res.rows[0];
  }
}

export async function getLatestWorkoutPlan(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    const userPlans = store.workout_plans.filter((p: any) => p.user_id === userId);
    if (userPlans.length === 0) return null;
    
    // Get latest by id
    const latestPlan = userPlans[userPlans.length - 1];
    const exercises = store.workout_exercises.filter((e: any) => e.plan_id === latestPlan.id);
    return { ...latestPlan, exercises };
  } else {
    const planRes = await pool.query(
      'SELECT * FROM workout_plans WHERE user_id = $1 ORDER BY id DESC LIMIT 1',
      [userId]
    );
    if (planRes.rows.length === 0) return null;
    
    const plan = planRes.rows[0];
    const exRes = await pool.query(
      'SELECT * FROM workout_exercises WHERE plan_id = $1 ORDER BY id ASC',
      [plan.id]
    );
    return { ...plan, exercises: exRes.rows };
  }
}

// ---------------- WORKOUT COMPLETION HISTORY ----------------
export async function completeWorkoutLog(
  userId: number,
  planId: number | null,
  title: string,
  durationMins: number,
  caloriesBurned: number,
  musclesTrained: string,
  completionStatus: string
) {
  if (useFallback) {
    const store = getLocalStore();
    const entry = {
      id: store.workout_history.length + 1,
      user_id: userId,
      plan_id: planId,
      title,
      duration_mins: durationMins,
      calories_burned: caloriesBurned,
      muscles_trained: musclesTrained,
      completion_status: completionStatus,
      completed_at: new Date().toISOString()
    };
    store.workout_history.push(entry);
    saveLocalStore(store);
    return entry;
  } else {
    const res = await pool.query(
      `INSERT INTO workout_history (user_id, plan_id, title, duration_mins, calories_burned, muscles_trained, completion_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, planId, title, durationMins, caloriesBurned, musclesTrained, completionStatus]
    );
    return res.rows[0];
  }
}

export async function getWorkoutHistory(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    return store.workout_history
      .filter((h: any) => h.user_id === userId)
      .sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  } else {
    const res = await pool.query(
      'SELECT * FROM workout_history WHERE user_id = $1 ORDER BY completed_at DESC',
      [userId]
    );
    return res.rows;
  }
}

// ---------------- STREAKS AND BADGES ----------------
export async function getStreak(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    let streak = store.streaks.find((s: any) => s.user_id === userId);
    if (!streak) {
      streak = {
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: null,
        freeze_used_date: null
      };
      store.streaks.push(streak);
      saveLocalStore(store);
    }
    return streak;
  } else {
    const res = await pool.query('SELECT * FROM streaks WHERE user_id = $1', [userId]);
    if (res.rows.length === 0) {
      const ins = await pool.query(
        'INSERT INTO streaks (user_id, current_streak, longest_streak) VALUES ($1, 0, 0) RETURNING *',
        [userId]
      );
      return ins.rows[0];
    }
    return res.rows[0];
  }
}

export async function updateStreakOnWorkout(userId: number) {
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (useFallback) {
    const store = getLocalStore();
    let streak = store.streaks.find((s: any) => s.user_id === userId);
    if (!streak) {
      streak = { user_id: userId, current_streak: 0, longest_streak: 0, last_completed_date: null, freeze_used_date: null };
      store.streaks.push(streak);
    }

    const lastDate = streak.last_completed_date ? streak.last_completed_date.split('T')[0] : null;

    if (lastDate === todayStr) {
      // Already completed today, do nothing to streak count
    } else if (lastDate === yesterdayStr || lastDate === null) {
      // Streak continues or first one
      streak.current_streak += 1;
      streak.last_completed_date = new Date().toISOString();
      if (streak.current_streak > streak.longest_streak) {
        streak.longest_streak = streak.current_streak;
      }
    } else {
      // Checked if freeze was used
      const lastDateTime = new Date(lastDate).getTime();
      const yesterdayTime = new Date(yesterdayStr).getTime();
      const diffDays = Math.ceil((yesterdayTime - lastDateTime) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 2 && !streak.freeze_used_date) {
        // Freeze active! Save freeze date and keep streak
        streak.freeze_used_date = new Date().toISOString();
        streak.current_streak += 1;
        streak.last_completed_date = new Date().toISOString();
      } else {
        // Reset streak
        streak.current_streak = 1;
        streak.last_completed_date = new Date().toISOString();
      }
    }
    saveLocalStore(store);
    return streak;
  } else {
    // Read current streak
    const streak = await getStreak(userId);
    const lastCompleted = streak.last_completed_date ? new Date(streak.last_completed_date).toISOString().split('T')[0] : null;
    
    let current = streak.current_streak;
    let longest = streak.longest_streak;
    let freezeUsed = streak.freeze_used_date;

    if (lastCompleted === todayStr) {
      // Done today
    } else if (lastCompleted === yesterdayStr || lastCompleted === null) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      // Check if we can freeze
      const diffDays = Math.ceil((new Date(yesterdayStr).getTime() - new Date(lastCompleted).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 2 && !freezeUsed) {
        freezeUsed = new Date();
        current += 1;
      } else {
        current = 1;
      }
    }

    const res = await pool.query(
      `UPDATE streaks SET
         current_streak = $1,
         longest_streak = $2,
         last_completed_date = NOW(),
         freeze_used_date = $3
       WHERE user_id = $4 RETURNING *`,
      [current, longest, freezeUsed, userId]
    );
    return res.rows[0];
  }
}

export async function getAchievements(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    return store.achievements.filter((a: any) => a.user_id === userId);
  } else {
    const res = await pool.query('SELECT * FROM achievements WHERE user_id = $1', [userId]);
    return res.rows;
  }
}

export async function addAchievement(userId: number, badgeName: string) {
  if (useFallback) {
    const store = getLocalStore();
    const exists = store.achievements.some((a: any) => a.user_id === userId && a.badge_name === badgeName);
    if (!exists) {
      const entry = {
        id: store.achievements.length + 1,
        user_id: userId,
        badge_name: badgeName,
        unlocked_at: new Date().toISOString()
      };
      store.achievements.push(entry);
      saveLocalStore(store);
      return entry;
    }
    return null;
  } else {
    try {
      const res = await pool.query(
        'INSERT INTO achievements (user_id, badge_name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        [userId, badgeName]
      );
      return res.rows[0] || null;
    } catch {
      return null;
    }
  }
}

// ---------------- NOTIFICATIONS ----------------
export async function getNotifications(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    return store.notifications
      .filter((n: any) => n.user_id === userId)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else {
    const res = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return res.rows;
  }
}

export async function createNotification(userId: number, title: string, message: string) {
  if (useFallback) {
    const store = getLocalStore();
    const entry = {
      id: store.notifications.length + 1,
      user_id: userId,
      title,
      message,
      read: false,
      created_at: new Date().toISOString()
    };
    store.notifications.push(entry);
    saveLocalStore(store);
    return entry;
  } else {
    const res = await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, message]
    );
    return res.rows[0];
  }
}

export async function markNotificationsRead(userId: number) {
  if (useFallback) {
    const store = getLocalStore();
    store.notifications.forEach((n: any) => {
      if (n.user_id === userId) n.read = true;
    });
    saveLocalStore(store);
    return true;
  } else {
    await pool.query('UPDATE notifications SET read = TRUE WHERE user_id = $1', [userId]);
    return true;
  }
}

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Standard REST response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Auth tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('fitaix_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error & Toast handling
// Response Interceptor: Global Error & Toast handling with 503 retry
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error) => {
    const status = error.response?.status;
    const errorMsg = error.response?.data?.error || '';
    // Retry only for generic 503, not quota exhaustion
    if (status === 503 && !errorMsg.toLowerCase().includes('quota')) {
      console.warn('⚠️ AI Service temporarily unavailable (503). Retrying...');
      const config = error.config as any;
      if (!config._retry) {
        config._retry = true;
        await new Promise((res) => setTimeout(res, 1000));
        return apiClient(config);
      }
    }

    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'An unexpected API error occurred.';

    console.error(`[API Error ${status || 500}]:`, errorMessage);

    // Handle auth errors
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('fitaix_token');
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// Retry utility
export async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error.message?.includes('503')) {
      await new Promise((res) => setTimeout(res, 1000));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}


// Mock REST Interceptor fallback for demonstration environment
apiClient.interceptors.request.use(async (config) => {
  // If request URL matches mockable API patterns and is not the real /chat endpoint, simulate mock REST responses
  if ((config.url?.startsWith('/api/v1') || !config.url?.startsWith('http')) && !(config.url?.startsWith('/chat') || config.url?.startsWith('/api/chat'))) {
    const mockData = getMockDataForEndpoint(config.method?.toUpperCase() || 'GET', config.url || '', config.data);
    if (mockData) {
      // Simulate network latency (150ms)
      await new Promise((resolve) => setTimeout(resolve, 150));
      config.adapter = async () => ({
        data: mockData,
        status: mockData.success ? (config.method === 'post' ? 201 : 200) : 400,
        statusText: 'OK',
        headers: {},
        config,
      });
    }
  }
  return config;
});

function getMockDataForEndpoint(method: string, url: string, body?: any): ApiResponse | null {
  const cleanUrl = url.replace('/api/v1', '');

  // 1. Dashboard
  if (cleanUrl.startsWith('/dashboard') && method === 'GET') {
    return {
      success: true,
      data: {
        user: {
          id: 'usr-901',
          name: 'Alex Vance',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          goal: 'hypertrophy',
          scenarioMode: 'normal',
          viewMode: 'advanced',
        },
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
    };
  }

  // 2. Workouts
  if (cleanUrl === '/workouts/today' && method === 'GET') {
    return {
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
    };
  }

  if (cleanUrl.startsWith('/exercises/') && method === 'PATCH') {
    return {
      success: true,
      data: { exerciseId: cleanUrl.split('/')[2], updatedFields: body },
      message: 'Exercise updated successfully.',
    };
  }

  // 3. AI Coach
  if (cleanUrl === '/chat' && method === 'POST') {
    const userMessage = body?.message || '';
    let responseText = "I've recalibrated your training load based on your latest recovery telemetry. How else can I optimize your routine?";
    
    if (userMessage.toLowerCase().includes('travel')) {
      responseText = "Travel Mode activated! I've swapped heavy iron exercises for high-tension bodyweight and resistance band protocols.";
    } else if (userMessage.toLowerCase().includes('20 min') || userMessage.toLowerCase().includes('time')) {
      responseText = "Express Mode triggered! I've compressed your Push A session into a 20-minute mechanical tension superset.";
    }

    return {
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
    };
  }

  // 4. Progress
  if (cleanUrl === '/progress' && method === 'GET') {
    return {
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
    };
  }

  // 5. Calendar
  if (cleanUrl === '/schedule' && method === 'GET') {
    return {
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
    };
  }

  // 6. Meals
  if (cleanUrl.startsWith('/meals') && method === 'GET') {
    return {
      success: true,
      data: [
        { id: 'm1', title: 'Anabolic Berry Protein Oats', mealType: 'Breakfast', calories: 520, proteinGrams: 45, carbsGrams: 62, fatGrams: 10, prepTimeMins: 8, budgetTier: '$' },
        { id: 'm2', title: 'Flame-Grilled Chicken Bowl & Quinoa', mealType: 'Lunch', calories: 680, proteinGrams: 58, carbsGrams: 65, fatGrams: 16, prepTimeMins: 15, budgetTier: '$$' },
        { id: 'm3', title: 'Seared Wild Salmon & Sweet Potato Mash', mealType: 'Dinner', calories: 740, proteinGrams: 52, carbsGrams: 55, fatGrams: 28, prepTimeMins: 20, budgetTier: '$$$' },
        { id: 'm4', title: 'Greek Yogurt & Honey Nut Crunch', mealType: 'Snack', calories: 310, proteinGrams: 30, carbsGrams: 28, fatGrams: 8, prepTimeMins: 3, budgetTier: '$' }
      ]
    };
  }

  return { success: true, data: {}, message: 'Mock response executed.' };
}

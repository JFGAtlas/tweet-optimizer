export type Language = "zh" | "en" | "both";

export type Goal = 
  | "exposure" 
  | "interaction" 
  | "comment" 
  | "retweet" 
  | "follower" 
  | "promote" 
  | "opinion" 
  | "trend";

export interface Score {
  hook: number;
  interaction: number;
  clarity: number;
  emotion: number;
  topic: number;
  negativeRisk: number; // Note: lower is better usually, but here maybe we score 0-100 where 100 means high risk. Or 100 means low risk? Let's use 0-100 where 100 is best (lowest risk). Wait, the prompt says "负反馈风险评分". Let's make it 0-100, where higher means higher risk. We will display it accordingly.
  total: number;
}

export interface TweetVersion {
  type: "robust" | "viral" | "professional";
  title: string;
  contentZh?: string;
  contentEn?: string;
  reason: string;
  scene: string;
  expectedSignals: string[];
  risks: string;
}

export interface OptimizationResult {
  originalTweet: string;
  language: Language;
  goal: Goal;
  timestamp: number;
  problemAnalysis: string;
  score: Score;
  versions: TweetVersion[];
  suggestions: {
    hook: string;
    addQuestion: boolean;
    addInterest: boolean;
    reduceAd: boolean;
    addDetails: boolean;
    addKeywords: boolean;
    useEmojis: boolean;
    addHashtags: boolean;
    addMedia: boolean;
    isLongTweet: boolean;
    isThread: boolean;
  };
}

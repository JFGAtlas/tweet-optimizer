import { Goal, Language, OptimizationResult } from "@/types";

// This is the placeholder function for the real AI API call
export async function optimizeTweetWithAI(
  input: string,
  language: Language,
  goal: Goal
): Promise<OptimizationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Placeholder logic based on input length and goal
  const score = {
    hook: Math.min(100, 50 + input.length / 5 + Math.random() * 20),
    interaction: Math.min(100, 40 + Math.random() * 30),
    clarity: Math.min(100, 60 + Math.random() * 20),
    emotion: Math.min(100, 30 + Math.random() * 40),
    topic: Math.min(100, 50 + Math.random() * 30),
    negativeRisk: Math.max(0, 30 - input.length / 10 + Math.random() * 20), // lower is better usually, let's keep it as risk score
    total: 0
  };
  
  score.total = Math.round((score.hook + score.interaction + score.clarity + score.emotion + score.topic + (100 - score.negativeRisk)) / 6);

  const getZhContent = (type: string) => {
    switch(type) {
      case 'robust': return `💡 观点分享：\n\n${input}\n\n大家怎么看？欢迎在评论区讨论。 #科技 #讨论`;
      case 'viral': return `🔥 震惊！你绝对想不到的真相：\n\n${input}\n\n同意的转，不服来辩！👇`;
      case 'professional': return `🧵 深度解析 [话题] 🧵\n\n关于 ${input}，这里有3个你必须知道的维度：\n1️⃣ [维度一]\n2️⃣ [维度二]\n3️⃣ [维度三]\n\n关注我，获取更多专业分析。`;
      default: return input;
    }
  };

  const getEnContent = (type: string) => {
    switch(type) {
      case 'robust': return `💡 Quick thought:\n\n[The translated American English version of your idea will appear here natively. It will sound natural, professional, and straight to the point.]\n\nWhat do you guys think? Let me know below! 👇 #Tech #Thoughts`;
      case 'viral': return `🤯 This will change how you think about everything:\n\n[Your idea will be translated into highly engaging, hook-driven American English here, optimized for the X algorithm to trigger retweets and replies.]\n\nRT if you agree! 🚀`;
      case 'professional': return `🧵 Deep Dive on this Topic 🧵\n\nRegarding the topic you mentioned, here are 3 key takeaways:\n1️⃣ [Translated Key Point 1]\n2️⃣ [Translated Key Point 2]\n3️⃣ [Translated Key Point 3]\n\nFollow for more insights.`;
      default: return `[American English translation placeholder]`;
    }
  };

  return {
    originalTweet: input,
    language,
    goal,
    timestamp: Date.now(),
    problemAnalysis: "原文过于平淡，缺乏吸引用户停留的 Hook。同时话题标签不明确，推荐模型难以快速定位目标兴趣群体。缺乏引导互动的指令（Call to Action）。",
    score: {
      hook: Math.round(score.hook),
      interaction: Math.round(score.interaction),
      clarity: Math.round(score.clarity),
      emotion: Math.round(score.emotion),
      topic: Math.round(score.topic),
      negativeRisk: Math.round(score.negativeRisk),
      total: score.total
    },
    versions: [
      {
        type: "robust",
        title: "稳健版 (Robust)",
        contentZh: language !== 'en' ? getZhContent('robust') : undefined,
        contentEn: language !== 'zh' ? getEnContent('robust') : undefined,
        reason: "用最自然的口吻表达，不夸大其词，适合长期维护人设，建立真实可信的专家形象。",
        scene: "日常观点输出，日常交流",
        expectedSignals: ["点赞", "停留时间", "回复"],
        risks: "爆发力一般，可能只在核心粉丝圈内传播"
      },
      {
        type: "viral",
        title: "爆款版 (Viral)",
        contentZh: language !== 'en' ? getZhContent('viral') : undefined,
        contentEn: language !== 'zh' ? getEnContent('viral') : undefined,
        reason: "强化了开头 Hook 和情绪冲突，激发读者的认同感或反驳欲，非常容易触发系统排序推荐。",
        scene: "希望打破流量圈层，吸引大量泛圈层关注",
        expectedSignals: ["转发", "引用", "大量回复"],
        risks: "负反馈风险（被静音或不感兴趣）微升，不宜频繁使用"
      },
      {
        type: "professional",
        title: "专业版 (Professional)",
        contentZh: language !== 'en' ? getZhContent('professional') : undefined,
        contentEn: language !== 'zh' ? getEnContent('professional') : undefined,
        reason: "结构化表达，信息密度高。推荐算法倾向于对长推文/Thread 给予更多曝光权重，因为能显著增加用户停留时长。",
        scene: "长篇干货，项目介绍，投研分析",
        expectedSignals: ["收藏", "资料页点击", "关注作者"],
        risks: "如果开头不够吸引人，跳出率会很高"
      }
    ],
    suggestions: {
      hook: "在第一句话抛出一个有违直觉的观点或引发共鸣的痛点。",
      addQuestion: true,
      addInterest: false,
      reduceAd: true,
      addDetails: true,
      addKeywords: true,
      useEmojis: true,
      addHashtags: true,
      addMedia: true,
      isLongTweet: input.length > 50,
      isThread: input.length > 150
    }
  };
}

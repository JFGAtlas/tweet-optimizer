"use client";

import { useState, useEffect } from "react";
import { Loader2, Send, Copy, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, History, Info, BarChart2 } from "lucide-react";
import { optimizeTweetWithAI } from "@/lib/ai";
import { Language, Goal, OptimizationResult } from "@/types";

const GOALS: { value: Goal; label: string }[] = [
  { value: "exposure", label: "获取更多曝光" },
  { value: "interaction", label: "获取更多互动" },
  { value: "comment", label: "获取更多评论" },
  { value: "retweet", label: "获取更多转发" },
  { value: "follower", label: "获取更多关注" },
  { value: "promote", label: "宣传项目/代币" },
  { value: "opinion", label: "个人观点输出" },
  { value: "trend", label: "热点蹭流量" },
];

export function TweetOptimizer() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("zh");
  const [goal, setGoal] = useState<Goal>("exposure");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [history, setHistory] = useState<OptimizationResult[]>([]);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("tweet-optimizer-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveHistory = (newResult: OptimizationResult) => {
    const updated = [newResult, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("tweet-optimizer-history", JSON.stringify(updated));
  };

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const res = await optimizeTweetWithAI(input, language, goal);
      setResult(res);
      saveHistory(res);
    } catch (err) {
      console.error(err);
      alert("优化失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [id]: true });
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Input & Algorithm Explanation */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Send size={20} className="text-primary" /> 推文草稿箱
          </h2>
          
          <textarea
            className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
            placeholder="在这里输入你的原始推文想法..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={input.length > 280 ? "text-yellow-500" : "text-muted"}>
              字数: {input.length} {input.length > 280 && "(超长，建议开通 Premium 或分段)"}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">优化目标</label>
              <select
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary/50"
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
              >
                {GOALS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">输出语言</label>
              <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden">
                <button
                  className={`flex-1 py-2 text-sm transition-colors ${language === 'zh' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400'}`}
                  onClick={() => setLanguage('zh')}
                >中文版</button>
                <div className="w-[1px] bg-white/10"></div>
                <button
                  className={`flex-1 py-2 text-sm transition-colors ${language === 'en' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400'}`}
                  onClick={() => setLanguage('en')}
                >英文版</button>
                <div className="w-[1px] bg-white/10"></div>
                <button
                  className={`flex-1 py-2 text-sm transition-colors ${language === 'both' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400'}`}
                  onClick={() => setLanguage('both')}
                >中英双语</button>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleOptimize}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {isLoading ? "算法深度优化中..." : "一键优化推文"}
          </button>
        </div>

        {/* Algorithm Explanation */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Info size={18} className="text-blue-400" /> 推荐机制揭秘
          </h3>
          <div className="text-sm text-gray-300 space-y-3 leading-relaxed">
            <p>基于开源的 X-Algorithm：</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li><strong className="text-white">召回 (Retrieval)：</strong>模型会寻找与推文相关的兴趣圈层。内容越清晰，越容易找到目标受众。</li>
              <li><strong className="text-white">排序 (Ranking)：</strong>核心是预测互动概率。</li>
              <li><strong className="text-green-400">正向信号：</strong>点赞、回复、转发、收藏、停留时间。</li>
              <li><strong className="text-red-400">负向信号：</strong>不感兴趣、屏蔽、举报。硬广和诱导互动容易触发。</li>
            </ul>
            <p className="pt-2 border-t border-white/10">
              优化目标：让模型和用户立刻知道这篇推文的<strong>价值</strong>与<strong>受众</strong>。
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Results & History */}
      <div className="lg:col-span-2 space-y-6">
        {!result ? (
          <div className="h-full min-h-[400px] glass-panel rounded-2xl flex flex-col items-center justify-center text-center p-8 border-dashed border-white/20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Sparkles size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">等待优化输入</h3>
            <p className="text-muted max-w-md">
              输入您的推文并点击优化，我们将利用基于 X For You 算法的分析模型，为您生成高曝光潜力的推文变体。
            </p>
            
            {history.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10 w-full text-left">
                <h4 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                  <History size={16} /> 最近历史记录
                </h4>
                <div className="space-y-3">
                  {history.slice(0,3).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/5 hover:bg-white/10 p-3 rounded-lg cursor-pointer transition-colors text-sm line-clamp-1"
                      onClick={() => {
                        setInput(item.originalTweet);
                        setLanguage(item.language);
                        setGoal(item.goal);
                        setResult(item);
                      }}
                    >
                      {item.originalTweet}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Score Panel */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BarChart2 size={20} className="text-accent" /> 原文算法诊断
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">推荐潜力总分</span>
                  <div className="w-12 h-12 rounded-full border-4 border-accent flex items-center justify-center text-lg font-bold text-accent shadow-[0_0_10px_rgba(0,186,124,0.3)]">
                    {result.score.total}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <ScoreItem label="Hook 吸引力" score={result.score.hook} color="blue" />
                <ScoreItem label="互动触发率" score={result.score.interaction} color="purple" />
                <ScoreItem label="语义清晰度" score={result.score.clarity} color="green" />
                <ScoreItem label="情绪强度" score={result.score.emotion} color="yellow" />
                <ScoreItem label="话题相关性" score={result.score.topic} color="indigo" />
                <ScoreItem label="风险合规 (越高越好)" score={100 - result.score.negativeRisk} color="red" />
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-red-200">
                  <strong className="block text-red-400 mb-1">问题诊断：</strong>
                  {result.problemAnalysis}
                </div>
              </div>
            </div>

            {/* Suggestions Panel */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-yellow-400" /> 算法友好度建议
              </h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge active={result.suggestions.addQuestion}>❓ 加入互动提问</Badge>
                <Badge active={result.suggestions.addInterest}>💰 增加利益点</Badge>
                <Badge active={result.suggestions.reduceAd}>🚫 降低营销感</Badge>
                <Badge active={result.suggestions.addDetails}>📝 补充具体细节</Badge>
                <Badge active={result.suggestions.addKeywords}>🔑 使用圈层关键词</Badge>
                <Badge active={result.suggestions.useEmojis}>😀 增加 Emoji</Badge>
                <Badge active={result.suggestions.addHashtags}>#️⃣ 添加热门话题</Badge>
                <Badge active={result.suggestions.addMedia}>🖼️ 建议配图/视频</Badge>
                <Badge active={result.suggestions.isThread}>🧵 建议改为 Thread</Badge>
              </div>
              <p className="mt-4 text-sm text-gray-300">
                <span className="text-yellow-400 font-semibold">Hook 优化方向：</span> {result.suggestions.hook}
              </p>
            </div>

            {/* Versions */}
            <h3 className="text-2xl font-bold mt-8 mb-4">优化方案</h3>
            <div className="space-y-6">
              {result.versions.map((ver, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl card-hover relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{ver.title}</h4>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="bg-white/10 px-2 py-0.5 rounded text-blue-300">{ver.scene}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {ver.contentZh && (
                      <div className="relative group/copy">
                        <div className="bg-[#15181c] p-4 rounded-xl border border-white/5 text-gray-100 whitespace-pre-wrap">
                          {ver.contentZh}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(ver.contentZh!, ver.type + '-zh')}
                          className="absolute top-2 right-2 p-2 bg-black/60 rounded-lg hover:bg-primary/20 text-gray-400 hover:text-primary opacity-0 group-hover/copy:opacity-100 transition-all"
                          title="复制中文版"
                        >
                          {copiedStates[ver.type + '-zh'] ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    )}
                    
                    {ver.contentEn && (
                      <div className="relative group/copy">
                        <div className="bg-[#15181c] p-4 rounded-xl border border-white/5 text-gray-100 whitespace-pre-wrap font-sans">
                          {ver.contentEn}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(ver.contentEn!, ver.type + '-en')}
                          className="absolute top-2 right-2 p-2 bg-black/60 rounded-lg hover:bg-primary/20 text-gray-400 hover:text-primary opacity-0 group-hover/copy:opacity-100 transition-all"
                          title="复制英文版"
                        >
                          {copiedStates[ver.type + '-en'] ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-black/30 p-4 rounded-xl">
                    <div>
                      <div className="text-gray-400 font-semibold mb-1">设计思路</div>
                      <div className="text-gray-300">{ver.reason}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 font-semibold mb-1">预期提升信号 & 风险</div>
                      <div className="text-green-400 mb-1">↑ {ver.expectedSignals.join(" / ")}</div>
                      <div className="text-orange-400/80">⚠️ {ver.risks}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function ScoreItem({ label, score, color }: { label: string; score: number; color: string }) {
  // Determine color class based on string
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    indigo: "bg-indigo-500",
    red: "bg-red-500",
  };
  const bgClass = colorMap[color] || "bg-blue-500";
  
  return (
    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
      <div className="text-xs text-gray-400 mb-2">{label}</div>
      <div className="flex items-center justify-between">
        <div className="font-bold text-lg">{score}</div>
        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${bgClass}`} style={{ width: `${score}%` }}></div>
        </div>
      </div>
    </div>
  );
}

function Badge({ active, children }: { active: boolean; children: React.ReactNode }) {
  if (!active) return null;
  return (
    <span className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-full text-gray-300">
      {children}
    </span>
  );
}

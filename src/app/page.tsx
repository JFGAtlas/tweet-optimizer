import { TweetOptimizer } from "@/components/TweetOptimizer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            让你的推文更容易被 <span className="text-gradient">X 推荐算法</span>捕捉
          </h1>
          <p className="text-muted text-lg max-w-3xl mx-auto">
            基于 X For You Feed 推荐机制，优化 Hook、互动信号、语义清晰度与负反馈风险。
            提升被召回与排序的概率，进入更大的流量池。
          </p>
        </div>
        
        <TweetOptimizer />
      </main>
      <Footer />
    </div>
  );
}

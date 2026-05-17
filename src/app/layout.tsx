import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "推文流量优化器 | 基于 X Algorithm",
  description: "基于 X For You Feed 推荐机制，优化 Hook、互动信号、语义清晰度与负反馈风险，让你的推文更容易被 X 推荐算法捕捉。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased min-h-screen bg-black text-white selection:bg-blue-500/30">
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
        {children}
      </body>
    </html>
  );
}

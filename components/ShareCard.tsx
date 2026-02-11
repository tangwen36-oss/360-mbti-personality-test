import React from 'react';
import { RadarData, ReportContent } from '../types';

interface ShareCardProps {
    report: ReportContent;
    radarData: RadarData[]; // Kept for prop compatibility
    mode: 'self' | 'blended';
}

const ShareCard: React.FC<ShareCardProps> = ({ report }) => {
    const displayTitle = report.type;
    const displaySubtitle = report.title;

    return (
        <div
            id="share-card-node"
            /**
             * ✅ 稳定性修复（关键）
             * - 不用 fixed（部分导出库会偏移/裁切）
             * - 不用 transform 隐藏（最容易截空/截歪）
             * - 用 absolute + left:-100000px 离屏隐藏（仍参与布局，导出稳定）
             * - min-h + h-auto：内容变长也不会截半截
             */
            className="absolute top-0 w-[375px] min-h-[667px] h-auto bg-[#FDFBF7] text-brand-text p-7 flex flex-col font-sans box-border"
            style={{ left: '-100000px' }}
        >
            {/* 1) Header */}
            <div className="flex flex-col items-center mt-6 w-full shrink-0">
                <p className="text-[12px] font-bold text-gray-400 mb-1 tracking-[0.2em] uppercase">
                    我的 MBTI 是
                </p>

                <h1 className="text-[78px] font-black tracking-tighter text-brand-text leading-none mb-4 text-center drop-shadow-sm font-sans">
                    {displayTitle}
                </h1>

                <h2 className="text-xl font-serif font-bold text-gray-800 tracking-wider mb-6 text-center">
                    {displaySubtitle}
                </h2>

                {/* 标签：✅ 外层居中固定高度 + 只把“文字”往上挪（最稳） */}
                <div className="flex flex-wrap justify-center gap-3 w-full px-1">
                    {report.keywords.map((keyword, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-bold text-gray-500 bg-white border border-gray-100 px-4 rounded-full uppercase tracking-wider shadow-sm inline-flex items-center justify-center h-7 leading-none"
                        >
                            <span className="relative top-[-6px]">#{keyword}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* 2) Middle：✅ 不垂直居中，紧跟标签往下排 */}
            <div className="flex-1 flex flex-col space-y-5 mt-6">
                {/* 人格底色 */}
                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        {/* 圆点不动 */}
                        <div className="w-1.5 h-1.5 bg-brand-pink rounded-full shrink-0" />
                        {/* ✅ 标题文字上移，和圆点对齐 */}
                        <h3 className="text-xs font-bold text-gray-900 tracking-wide relative top-[-6px]">
                            人格底色
                        </h3>
                    </div>

                    {/* 正文：统一样式，✅ 左对齐更像期望图 */}
                    <p className="text-xs font-serif leading-relaxed text-gray-600 text-left">
                        {report.shareContent.baseColor}
                    </p>
                </div>

                {/* 注意事项 */}
                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 bg-brand-orange rounded-full shrink-0" />
                        <h3 className="text-xs font-bold text-gray-900 tracking-wide relative top-[-6px]">
                            和我相处的注意事项
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {/* 期望图：默认 3 条 */}
                        {report.shareContent.interactionGuide.slice(0, 3).map((rule, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <span className="text-[11px] font-mono font-bold text-brand-secondary/50 mt-[3px] shrink-0">
                                    0{i + 1}
                                </span>
                                <p className="text-xs font-serif leading-relaxed text-gray-600 text-left">
                                    {rule}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3) Footer：✅ 永远贴底 */}
            <div className="w-full flex items-center gap-3 pt-5 border-t border-dashed border-gray-200 shrink-0 mt-auto">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF5D8D] to-[#FF8F70] rounded-xl flex items-center justify-center text-white shadow-md shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10" />
                    <span className="font-black text-xs tracking-tighter font-sans relative z-10">Lab</span>
                </div>

                <div className="flex flex-col justify-center">
                    <p className="text-[9px] text-gray-400 font-bold tracking-[0.05em] uppercase mb-0.5">
                        GET YOUR OWN REPORT
                    </p>
                    <p className="text-[11px] text-gray-900 font-bold tracking-tight">
                        小红书搜索「<span className="text-brand-pink">人生算法 Lab</span>」获取同款
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareCard;

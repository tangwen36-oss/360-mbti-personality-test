import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
    Share2, ScanFace, Brain, ShieldAlert, Zap, Users, Sparkles, MessageCircle, Briefcase, Heart, Target, GitCompare, CheckCircle2, Scale, BarChart3, Fingerprint, UserPlus, Lightbulb, X, Copy, Check, Link2
} from 'lucide-react';
import { RADAR_DATA_SELF, RADAR_DATA_BLENDED } from '../../constants';
import { ReportMode, ReportContent } from '../../types';
import RadarChart from '../../components/RadarChart';
import ShareCard from '../../components/ShareCard';
import api from '../services/api';

declare global {
    interface Window {
        html2canvas: any;
    }
}

const Result: React.FC = () => {
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Initialize report from location state (fallback/preview) OR null
    const [report, setReport] = useState<ReportContent | null>(location.state?.report || null);
    const [reportMode, setReportMode] = useState<ReportMode>('self');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Report if ID is present and we don't have report (or we want to re-fetch)
    // Currently logic: If ID exists, we fetch. If state exists, we use state initially but might overwrite if ID differs.
    // Simpler: If ID exists, ALWAYS fetch to ensure deep link works. 
    React.useEffect(() => {
        const fetchReport = async () => {
            if (!id) return;
            try {
                // Determine if we already have the right data? 
                // For simplicity, if ID exists, we fetch.
                setIsLoading(true);
                const data = await api.getReportById(id);
                if (data) {
                    setReport(data);
                } else {
                    // Handle 404
                    console.error('Report not found');
                    alert('未找到报告');
                    navigate('/'); // Go home
                }
            } catch (err) {
                console.error('Failed to fetch report', err);
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if we don't have a report, OR if we strictly want to rely on URL
        // If we just navigated from Quiz, we might have passed state. But User wants /result/:id based flow.
        // So we should fetch if id is present.
        if (id) {
            fetchReport();
        }
    }, [id, navigate]);

    // Share Modal State
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Image Generation State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleShareLink = () => {
        setShowShareModal(true);
        setCopySuccess(false);
    };

    const handleCopyLink = () => {
        // 动态生成邀请链接：基于当前报告 ID
        const inviteLink = `${window.location.origin}/peer/${id}`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleGenerateImage = async () => {
        const element = document.getElementById('share-card-node');
        if (!element) return;

        // 检查 window.html2canvas 是否存在
        if (typeof window.html2canvas === 'undefined') {
            alert("Generating engine loading...");
            return;
        }

        setIsGenerating(true);

        try {
            const canvas = await window.html2canvas(element, {
                useCORS: true,
                scale: 3, // 保持 3 倍清晰度
                backgroundColor: '#FDFBF7', // 确保背景色正确
                width: 375, // 强制指定宽度，模拟手机
                windowWidth: 375,
                // 🟢 关键：在克隆的 DOM 中修正样式，让它变得可见
                onclone: (clonedDoc: Document) => {
                    const clonedNode = clonedDoc.getElementById('share-card-node');
                    if (clonedNode) {
                        // 移除隐藏属性，强制复位
                        clonedNode.style.transform = 'none';
                        clonedNode.style.left = '0';
                        clonedNode.style.top = '0';
                        clonedNode.style.display = 'flex'; // 确保是 flex 布局
                    }
                    // ✅ 锁定字体大小，防止系统字体缩放影响截图
                    const html = clonedDoc.documentElement;
                    html.style.fontSize = '16px';
                    html.style.setProperty('-webkit-text-size-adjust', '100%', 'important');
                    html.style.setProperty('text-size-adjust', '100%', 'important');
                }
            });

            const image = canvas.toDataURL('image/png');
            setPreviewUrl(image);
        } catch (error) {
            console.error('生成图片失败:', error);
            alert('生成失败，请重试');
        } finally {
            setIsGenerating(false);
        }
    };

    const renderShareModal = () => {
        if (!showShareModal) return null;
        const inviteLink = `${window.location.origin}/peer/${id}`;

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={() => setShowShareModal(false)}
                ></div>

                {/* Modal Card */}
                <div className="relative w-full max-w-sm bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl scale-100 transition-transform border border-white/50">
                    <button
                        onClick={() => setShowShareModal(false)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-black/5"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center mt-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-brand-pink rounded-2xl flex items-center justify-center text-white shadow-glow mb-5 transform rotate-3">
                            <UserPlus size={28} />
                        </div>

                        <h3 className="text-xl font-serif font-bold text-brand-text mb-2">邀请好友为您校准</h3>
                        <p className="text-xs text-gray-500 mb-8 leading-relaxed px-4">
                            发送专属链接给好友，完成"他评视角"测试，解锁您的 360° 校准报告。
                        </p>

                        {/* Link Box */}
                        <div className="w-full bg-white border border-gray-200 rounded-xl p-1.5 flex items-center shadow-inner mb-6 pl-4">
                            <Link2 size={16} className="text-gray-400 shrink-0 mr-3" />
                            <input
                                readOnly
                                value={inviteLink}
                                className="flex-1 bg-transparent text-xs text-gray-600 outline-none w-full font-mono truncate"
                            />
                        </div>

                        {/* Copy Button */}
                        <button
                            onClick={handleCopyLink}
                            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${copySuccess
                                ? 'bg-green-500 text-white shadow-green-500/30'
                                : 'bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-brand-pink/30 hover:shadow-brand-pink/40'
                                }`}
                        >
                            {copySuccess ? (
                                <>
                                    <Check size={18} />
                                    已复制链接
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    一键复制链接
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Reusable Modules Component (Only for Self Report)
    const ReportModules = () => {
        if (!report) return null;
        return (
            <>
                {/* Module 1: Personality Base (人格底色) */}
                <section className="bg-white p-6 rounded-2xl shadow-soft">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain size={16} className="text-brand-pink" />
                        <h3 className="text-sm font-bold uppercase tracking-wide">人格底色</h3>
                    </div>
                    <p className="text-sm leading-7 text-gray-600 font-serif text-justify">
                        {report.baseColor}
                    </p>
                </section>

                {/* Module 2: Talent Map (天赋图谱) */}
                <section className="bg-white p-6 rounded-2xl shadow-soft">
                    <div className="flex items-center gap-2 mb-5">
                        <Sparkles size={16} className="text-brand-pink" />
                        <h3 className="text-sm font-bold uppercase tracking-wide">天赋图谱</h3>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span> 优势
                            </p>
                            <ul className="space-y-3">
                                {report.talent.strengths.map((s, i) => (
                                    <li key={i} className="text-sm text-brand-text font-medium leading-normal bg-orange-50/50 p-2 rounded-lg border border-orange-100">
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> 劣势
                            </p>
                            <ul className="space-y-3">
                                {report.talent.weaknesses.map((w, i) => (
                                    <li key={i} className="text-sm text-gray-500 font-medium leading-normal bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Module 3: Deep Dimensions (四大维度解析) */}
                <section className="space-y-4">

                    {/* Decision */}
                    <div className="bg-white p-5 rounded-2xl shadow-soft">
                        <div className="flex items-center gap-2 mb-3 text-brand-text">
                            <Scale size={16} className="text-brand-pink" />
                            <h3 className="text-sm font-bold">决策：{report.dimensions.decision.title}</h3>
                        </div>
                        <p className="text-sm leading-6 text-gray-600 mb-3 text-justify">
                            {report.dimensions.decision.content}
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-2">
                            <ShieldAlert size={14} className="text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {report.dimensions.decision.limit}
                            </p>
                        </div>
                    </div>

                    {/* Communication */}
                    <div className="bg-white p-5 rounded-2xl shadow-soft">
                        <div className="flex items-center gap-2 mb-3 text-brand-text">
                            <MessageCircle size={16} className="text-brand-pink" />
                            <h3 className="text-sm font-bold">沟通：{report.dimensions.communication.title}</h3>
                        </div>
                        <p className="text-sm leading-6 text-gray-600 mb-3 text-justify">
                            {report.dimensions.communication.content}
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-2">
                            <Zap size={14} className="text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {report.dimensions.communication.caution}
                            </p>
                        </div>
                    </div>

                    {/* Work */}
                    <div className="bg-white p-5 rounded-2xl shadow-soft">
                        <div className="flex items-center gap-2 mb-3 text-brand-text">
                            <Briefcase size={16} className="text-brand-pink" />
                            <h3 className="text-sm font-bold">工作：{report.dimensions.work.title}</h3>
                        </div>
                        <p className="text-sm leading-6 text-gray-600 mb-3 text-justify">
                            {report.dimensions.work.content}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {report.dimensions.work.careers.map(c => (
                                <span key={c} className="text-[10px] px-2 py-0.5 bg-brand-highlight text-brand-pink rounded border border-brand-pink/20">{c}</span>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-2">
                            <Target size={14} className="text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {report.dimensions.work.caution}
                            </p>
                        </div>
                    </div>

                    {/* Love */}
                    <div className="bg-white p-5 rounded-2xl shadow-soft">
                        <div className="flex items-center gap-2 mb-3 text-brand-text">
                            <Heart size={16} className="text-brand-pink" />
                            <h3 className="text-sm font-bold">恋爱：{report.dimensions.love.title}</h3>
                        </div>
                        <p className="text-sm leading-6 text-gray-600 mb-3 text-justify">
                            {report.dimensions.love.content}
                        </p>
                        <div className="bg-gradient-to-r from-brand-highlight to-white p-3 rounded-lg border border-brand-pink/10 flex gap-2">
                            <Heart size={14} className="text-brand-pink shrink-0 mt-0.5" />
                            <p className="text-xs text-brand-text leading-relaxed">
                                <span className="font-bold">适合伴侣：</span>{report.dimensions.love.partner}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Module 4: Social Navigation */}
                <section className="bg-white p-6 rounded-2xl shadow-soft">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={16} className="text-brand-pink" />
                        <h3 className="text-sm font-bold uppercase tracking-wide">人际导航</h3>
                    </div>
                    <div className="space-y-4">
                        {/* 互补成长 */}
                        <div className="flex items-start gap-3 pb-3 border-b border-gray-50">
                            <div className="w-[120px] px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded border border-purple-100 text-center shrink-0 whitespace-nowrap">
                                {report.social.soulmate.type}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">互补成长</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{report.social.soulmate.desc}</p>
                            </div>
                        </div>

                        {/* 默契同频 */}
                        <div className="flex items-start gap-3 pb-3 border-b border-gray-50">
                            <div className="w-[120px] px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100 text-center shrink-0 whitespace-nowrap">
                                {report.social.partner.type}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">默契同频</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{report.social.partner.desc}</p>
                            </div>
                        </div>

                        {/* 摩擦内耗 */}
                        <div className="flex items-start gap-3">
                            <div className="w-[120px] px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded border border-red-100 text-center shrink-0 whitespace-nowrap">
                                {report.social.conflict.type}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">摩擦内耗</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{report.social.conflict.desc}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    };

    // Loading 或报告未加载保护
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center animate-fade-in">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-brand-secondary text-sm">加载报告中...</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center animate-fade-in">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-brand-secondary text-sm">生成报告中...</p>
                </div>
            </div>
        );
    }

    const isCalibration = reportMode === 'calibration';
    const hasPeerData = !!report.deviation?.othersPerception; // 是否有他评数据

    // ✅ 动态雷达图：优先使用报告中的数据，fallback 到常量
    const radarData = report.radarData || (isCalibration ? RADAR_DATA_BLENDED : RADAR_DATA_SELF);
    const conclusion = report.deviation?.conclusion;

    // 锁定状态：校准模式 + 无他评数据
    const isCalibrationLocked = isCalibration && !hasPeerData;

    return (
        <div className="min-h-screen pb-32 animate-fade-in relative z-10">
            {/* Header Section */}
            <div className="pt-12 px-6 pb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-xs text-brand-secondary tracking-widest uppercase mb-1">
                            {isCalibration ? '360° Calibration Report' : 'Self Assessment'}
                        </p>
                        <h1 className="text-3xl font-serif font-bold text-brand-text">
                            {isCalibration ? '360° 校准报告' : report.type}
                        </h1>
                        {!isCalibration && (
                            <p className="text-lg font-medium mt-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-pink">
                                {report.title}
                            </p>
                        )}
                    </div>

                    {/* Header Mini Logo */}
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF5D8D] to-[#FF8F70] rounded-xl flex items-center justify-center shadow-sm text-white overflow-hidden relative border border-white/20">
                        <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-[1px]"></div>
                        <span className="relative font-black tracking-tighter text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Lab</span>
                    </div>
                </div>

                {/* Radar Chart Container */}
                <div className="w-full aspect-square max-w-[320px] mx-auto my-8 relative">
                    <RadarChart data={radarData} isBlended={isCalibration && hasPeerData} />
                    {isCalibration && (
                        <div className="absolute -bottom-4 left-0 w-full flex justify-center gap-6 text-[10px] uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-brand-pink/20 border border-brand-pink rounded-full"></div>
                                <span>自我认知</span>
                            </div>
                            {hasPeerData && (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 border border-dashed border-black rounded-full opacity-60"></div>
                                    <span>他人视角</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Modules */}
            <div className="px-5 space-y-6">

                {!isCalibration ? (
                    /* SELF REPORT CONTENT ONLY */
                    <ReportModules />
                ) : (
                    /* CALIBRATION (FKA BLENDED) REPORT CONTENT ONLY */
                    <>
                        {/* 检测是否已解锁：peer_view 存在且非空 */}
                        {(!report.deviation?.othersPerception) ? (
                            /* 🔒 锁定状态：显示弹窗（与分享Modal样式一致） */
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in">
                                {/* Backdrop - 半透明灰色背景 */}
                                <div
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                                    onClick={() => setReportMode('self')} // 点击背景切回自测报告
                                ></div>

                                {/* Modal Card - 与分享弹窗完全一致 */}
                                <div className="relative w-full max-w-sm bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl scale-100 transition-transform border border-white/50">
                                    <button
                                        onClick={() => setReportMode('self')}
                                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-black/5"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="flex flex-col items-center text-center mt-2">
                                        <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-brand-pink rounded-2xl flex items-center justify-center text-white shadow-glow mb-5 transform rotate-3">
                                            <UserPlus size={28} />
                                        </div>

                                        <h3 className="text-xl font-serif font-bold text-brand-text mb-2">邀请好友为您校准</h3>
                                        <p className="text-xs text-gray-500 mb-8 leading-relaxed px-4">
                                            发送专属链接给好友，完成"他评视角"测试，解锁您的 360° 校准报告。
                                        </p>

                                        {/* Link Box */}
                                        <div className="w-full bg-white border border-gray-200 rounded-xl p-1.5 flex items-center shadow-inner mb-6 pl-4">
                                            <Link2 size={16} className="text-gray-400 shrink-0 mr-3" />
                                            <input
                                                readOnly
                                                value={`${window.location.origin}/peer/${id}`}
                                                className="flex-1 bg-transparent text-xs text-gray-600 outline-none w-full font-mono truncate"
                                            />
                                        </div>

                                        {/* Copy Button */}
                                        <button
                                            onClick={handleCopyLink}
                                            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${copySuccess
                                                ? 'bg-green-500 text-white shadow-green-500/30'
                                                : 'bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-brand-pink/30 hover:shadow-brand-pink/40'
                                                }`}
                                        >
                                            {copySuccess ? (
                                                <>
                                                    <Check size={18} />
                                                    已复制链接
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={18} />
                                                    一键复制链接
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ✅ 已解锁：显示完整校准内容 */
                            <>
                                {/* 1. Cognitive Difference Analysis (Modified: Text Only, No MBTI Badges) */}
                                <section className="bg-brand-highlight p-6 rounded-2xl shadow-inner border border-brand-pink/10 mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <GitCompare size={16} className="text-brand-pink" />
                                        <h3 className="text-sm font-bold uppercase tracking-wide">认知差异分析</h3>
                                    </div>

                                    {/* Comparison Columns - Text Only */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm h-full flex flex-col relative overflow-hidden">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">你眼中的自己</p>
                                            <p className="text-sm text-gray-600 leading-relaxed flex-1">{report.deviation?.selfPerception}</p>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 h-full relative overflow-hidden flex flex-col">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">别人眼中的你</p>
                                            <p className="text-sm text-gray-600 leading-relaxed flex-1">{report.deviation?.othersPerception}</p>
                                        </div>
                                    </div>

                                    {/* Similarities & Differences */}
                                    <div className="space-y-3">
                                        <div className="bg-white/60 p-3 rounded-lg border border-white">
                                            <p className="text-[10px] font-bold text-brand-secondary mb-1 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> 核心共性
                                            </p>
                                            <p className="text-sm text-brand-text leading-relaxed">{report.deviation?.similarities}</p>
                                        </div>
                                        <div className="bg-white/60 p-3 rounded-lg border border-white">
                                            <p className="text-[10px] font-bold text-brand-pink mb-1 flex items-center gap-1">
                                                <Scale size={10} /> 关键分歧
                                            </p>
                                            <p className="text-sm text-brand-text leading-relaxed">{report.deviation?.differences}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* 2. 4 Dimensions Comparison (System Contrast) */}
                                <section className="bg-white p-6 rounded-2xl shadow-soft mb-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <BarChart3 size={16} className="text-brand-pink" />
                                        <h3 className="text-sm font-bold uppercase tracking-wide">全维校准数据 (Self vs Peer)</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {(report.deviation?.dimensionAnalysis || []).map((dim, idx) => (
                                            <div key={idx}>
                                                {/* Header */}
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-800 w-8">{dim.label}</span>
                                                        <span className="text-[10px] text-gray-400">{dim.left}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400">{dim.right}</span>
                                                </div>

                                                {/* Bar Chart Visual */}
                                                <div className="relative h-2 bg-gray-100 rounded-full w-full mb-3">
                                                    {/* Self Dot */}
                                                    <div
                                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-pink rounded-full border-2 border-white shadow-sm z-20 transition-all duration-500"
                                                        style={{ left: `${dim.selfValue}%` }}
                                                    ></div>
                                                    {/* Peer Dot */}
                                                    <div
                                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-black rounded-full z-10 opacity-70 transition-all duration-500"
                                                        style={{ left: `${dim.peerValue}%` }}
                                                    ></div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-xs text-gray-500 leading-snug bg-gray-50 p-2 rounded-lg">
                                                    {dim.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex justify-center gap-6 mt-6 text-[10px] uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-brand-pink rounded-full"></div>
                                            <span>自评</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 border border-black rounded-full opacity-60"></div>
                                            <span>他评</span>
                                        </div>
                                    </div>
                                </section>

                                {/* 3. Final Conclusion (Redesigned & Aesthetic - No Contrast Tag) */}
                                <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 rounded-2xl shadow-soft relative overflow-hidden">
                                    {/* Abstract Background Element */}
                                    <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-gradient-to-b from-brand-pink/20 to-transparent rounded-full blur-3xl"></div>

                                    {/* Header Label */}
                                    <div className="flex items-center gap-2 mb-6 relative z-10 opacity-80">
                                        <Fingerprint size={16} className="text-brand-pink" />
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">校准结论</h3>
                                    </div>

                                    <div className="relative z-10">
                                        {/* Archetype Title - Centered & Prominent */}
                                        <h2 className="text-2xl font-serif font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 mb-6 leading-tight">
                                            {conclusion?.archetype}
                                        </h2>

                                        {/* Description Body */}
                                        <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs leading-relaxed text-gray-300 text-justify">
                                                {conclusion?.desc}
                                            </p>
                                        </div>

                                        {/* Suggestion Box - "Prescription" Style */}
                                        <div className="bg-gradient-to-r from-brand-orange/10 to-transparent p-4 rounded-xl border-l-2 border-brand-orange">
                                            <div className="flex items-center gap-2 mb-2 text-brand-orange">
                                                <Lightbulb size={14} />
                                                <p className="text-[10px] font-bold uppercase tracking-wider">建议 Suggestion</p>
                                            </div>
                                            <p className="text-xs leading-relaxed text-gray-200">
                                                {conclusion?.suggestion}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Floating Action Buttons - Grid Layout - Flattened for Mobile */}
            <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 z-50">
                <div className="grid grid-cols-2 gap-2">
                    {/* 1. View Self Report */}
                    <button
                        onClick={() => setReportMode('self')}
                        className={`py-2 text-[10px] font-bold rounded-lg transition-all border flex flex-row items-center justify-center gap-1.5 active:scale-[0.98] ${reportMode === 'self' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <ScanFace size={12} className={reportMode === 'self' ? 'text-white' : 'text-gray-400'} />
                        自测报告
                    </button>

                    {/* 2. View Calibration Report */}
                    <button
                        onClick={() => setReportMode('calibration')}
                        className={`py-2 text-[10px] font-bold rounded-lg transition-all border flex flex-row items-center justify-center gap-1.5 active:scale-[0.98] ${reportMode === 'calibration' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <GitCompare size={12} className={reportMode === 'calibration' ? 'text-white' : 'text-gray-400'} />
                        校准报告
                    </button>

                    {/* 3. Share for Peer Review */}
                    <button
                        onClick={handleShareLink}
                        className="py-2 text-[10px] font-bold rounded-lg transition-all border border-brand-text/20 bg-white text-brand-text hover:bg-gray-50 flex flex-row items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                        <UserPlus size={12} />
                        分享他测
                    </button>

                    {/* 4. Export */}
                    <button
                        onClick={handleGenerateImage}
                        disabled={isGenerating}
                        className={`py-2 bg-gradient-to-r from-brand-orange to-brand-pink text-white rounded-lg font-bold text-[10px] shadow-sm active:scale-[0.98] transition-transform flex flex-row items-center justify-center gap-1.5 ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {isGenerating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Share2 size={12} />}
                        {isGenerating ? '生成中...' : '生成说明书'}
                    </button>
                </div>
            </div>

            {/* Share Modal */}
            {renderShareModal()}

            {/* Hidden Share Card - 只有 report 存在时才渲染 */}
            {report && <ShareCard report={report} radarData={radarData} mode={reportMode === 'calibration' ? 'blended' : 'self'} />}

            {/* ⚫️ 预览弹窗 Modal */}
            {previewUrl && (
                <div
                    className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewUrl(null)} // 点击背景关闭
                >
                    {/* 提示文案 */}
                    <div className="text-white/80 text-sm mb-4 font-bold tracking-widest flex items-center gap-2">
                        <span className="animate-bounce">⬇️</span> 长按图片保存到相册
                    </div>

                    {/* 图片容器 - 限制最大高度，防止超出一屏 */}
                    <div
                        className="relative w-full max-w-[375px] max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // 点击图片不关闭
                    >
                        <img
                            src={previewUrl}
                            alt="分享卡片"
                            className="w-full h-auto block"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Result;

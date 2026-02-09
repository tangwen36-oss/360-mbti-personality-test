export interface Question {
  id: number;
  text: string;
  options: string[];
  values?: string[]; // E, I, S, N, T, F, J, P corresponding to options
}

export type AppView = 'home' | 'quiz' | 'report';
export type ReportMode = 'self' | 'calibration';

export interface RadarData {
  axis: string;
  value: number;
  secondaryValue?: number; // For external observation
}

export interface DimensionContrast {
  label: string;
  left: string;
  right: string;
  selfValue: number; // 0-100, where 0 is left, 100 is right
  peerValue: number;
  desc: string;
}

export interface CalibrationConclusion {
  archetype: string; // e.g., "社交伪装者"
  desc: string;      // Detailed explanation
  suggestion: string; // Actionable advice
}

export interface ReportContent {
  type: string;
  title: string;
  keywords: string[];
  baseColor: string; // "人格底色" (2nd person)
  social: {
    soulmate: { type: string; desc: string };
    partner: { type: string; desc: string };
    conflict: { type: string; desc: string };
  };
  talent: {
    strengths: string[];
    weaknesses: string[];
  };
  dimensions: {
    decision: { title: string; content: string; limit: string };
    communication: { title: string; content: string; caution: string };
    work: { title: string; content: string; caution: string; careers: string[] };
    love: { title: string; content: string; partner: string };
  };
  deviation?: {
    // Cognitive Difference Analysis (Text only)
    selfPerception: string;
    othersPerception: string;
    similarities: string;
    differences: string;
    // New Detailed Comparison
    dimensionAnalysis: DimensionContrast[];
    conclusion: CalibrationConclusion;
  };
  shareContent: {
    baseColor: string; // 1st person
    interactionGuide: string[]; // List of rules for interaction
  };
  // 校准脚本 (可选，为后续报告逻辑做准备)
  calibration_scripts?: {
    [key: string]: {
      title: string;
      desc: string;
      [key: string]: any;
    };
  };
  // ✅ 动态雷达图数据
  radarData?: { axis: string; value: number; secondaryValue?: number }[];
}
-- 为 access_codes 表添加 report_id 列，关联已生成的报告
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS report_id UUID REFERENCES personality_reports(id);

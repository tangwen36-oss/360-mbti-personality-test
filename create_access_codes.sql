-- 创建 access_codes 表
CREATE TABLE IF NOT EXISTS access_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 预生成 10 个测试邀请码
INSERT INTO access_codes (code) VALUES
    ('LAB-2025-ALPHA'),
    ('LAB-2025-BRAVO'),
    ('LAB-2025-CHARLIE'),
    ('LAB-2025-DELTA'),
    ('LAB-2025-ECHO'),
    ('LAB-2025-FOXTROT'),
    ('LAB-2025-GOLF'),
    ('LAB-2025-HOTEL'),
    ('LAB-2025-INDIA'),
    ('LAB-2025-JULIET')
ON CONFLICT (code) DO NOTHING;

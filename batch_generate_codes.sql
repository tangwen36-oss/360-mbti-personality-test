-- =====================================================
-- 批量生成邀请码（纯字母数字，无符号）
-- =====================================================
-- 使用方法：在 Supabase SQL Editor 中执行
-- 修改下面两个参数即可：
--   1. 生成数量：修改 generate_series(1, 10) 中的 10
--   2. 部署域名：修改 base_url 的值
-- =====================================================

DO $$
DECLARE
    base_url TEXT := 'https://life-algo.xyz';  -- 你的实际部署域名
    num_codes INT := 10;                       -- ← 改成你想生成的数量
    new_code TEXT;
    i INT;
BEGIN
    FOR i IN 1..num_codes LOOP
        -- 生成12位纯字母数字码（a-z + 0-9）
        new_code := lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));

        INSERT INTO access_codes (code, is_used, link)
        VALUES (
            new_code,
            FALSE,
            base_url || '/?token=' || new_code
        );
    END LOOP;
END $$;

-- 查看刚生成的结果
SELECT id, code, is_used, link, created_at
FROM access_codes
WHERE is_used = FALSE
ORDER BY created_at DESC;

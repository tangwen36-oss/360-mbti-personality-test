-- 创建 keepalive 表，用于 GitHub Actions 定时 ping 保活
-- 请在 Supabase SQL Editor 中执行此脚本

CREATE TABLE IF NOT EXISTS keepalive (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pinged_at timestamptz NOT NULL DEFAULT now()
);

-- 添加注释
COMMENT ON TABLE keepalive IS 'GitHub Actions 定时写入，防止 Free Plan 7 天不活跃自动 pause';

-- ====================================================
-- 360° MBTI 人格测试 - 题目更新脚本
-- 共 56 题: 自测 36 题 (9题/维度) + 他测 20 题 (5题/维度)
-- ====================================================

-- Step 1: 添加 values 列（如果不存在）
ALTER TABLE questions ADD COLUMN IF NOT EXISTS "values" text[];

-- Step 2: 清空现有题目
TRUNCATE TABLE questions;

-- ====================================================
-- 自测题目 (category = 'self') ID: 1-36
-- ====================================================

-- EI 维度 (1-9) - dimension = 'energy'
INSERT INTO questions (id, text, category, dimension, direction, options, "values") VALUES
(1, '刷到特别好玩的内容时，你一般会？', 'self', 'energy', 1, '["马上发给朋友一起分享", "自己笑笑就好"]', ARRAY['E', 'I']),
(2, '突然空下来没事干时，你更常？', 'self', 'energy', 1, '["给朋友发消息找人闲聊", "刷手机刷剧打发时间"]', ARRAY['E', 'I']),
(3, '聚会结束回到家后，你更容易？', 'self', 'energy', 1, '["可以继续和家人或朋友聊天", "不想多说话想休息一下"]', ARRAY['E', 'I']),
(4, '想到一个新点子时，你通常会？', 'self', 'energy', 1, '["先跟别人说说看反应", "自己先琢磨成熟"]', ARRAY['E', 'I']),
(5, '心里有点烦的时候，你更可能？', 'self', 'energy', 1, '["找人吐槽几句能消化", "自己慢慢就消化了"]', ARRAY['E', 'I']),
(6, '你和朋友的聚会更多是：', 'self', 'energy', 1, '["主动发起者", "被邀请"]', ARRAY['E', 'I']),
(7, '哪种情况让你觉得更别扭？', 'self', 'energy', 1, '["你说了一句好笑的话但无人笑", "你很认真发言但大家觉得很好笑"]', ARRAY['E', 'I']),
(8, '在社交场合时，你更容易关注：', 'self', 'energy', 1, '["这个场合该说什么话", "自己的感受"]', ARRAY['E', 'I']),
(9, '哪种状态更让你难受？', 'self', 'energy', 1, '["好几天没人可以说话", "好几天被各种社交占满"]', ARRAY['E', 'I']);

-- SN 维度 (10-18) - dimension = 'perception'
INSERT INTO questions (id, text, category, dimension, direction, options, "values") VALUES
(10, '买东西前，你更常先看？', 'self', 'perception', 1, '["成分/参数/评价", "颜值/风格/理念"]', ARRAY['S', 'N']),
(11, '听一段演讲或发言时，你更容易关注？', 'self', 'perception', 1, '["他说了哪些点", "他想表达什么"]', ARRAY['S', 'N']),
(12, '工作接到新任务时，你会先关注？', 'self', 'perception', 1, '["具体步骤要做哪些事", "最终的目的是什么"]', ARRAY['S', 'N']),
(13, '学一个新东西时，你更注重？', 'self', 'perception', 1, '["掌握/学会", "规律/原理"]', ARRAY['S', 'N']),
(14, '平时刷手机，你更爱看？', 'self', 'perception', 1, '["干货、攻略、实用贴", "观点、分析、趋势贴"]', ARRAY['S', 'N']),
(15, '聊天时，你更常聊？', 'self', 'perception', 1, '["最近发生的具体事", "想法、脑洞、未来规划"]', ARRAY['S', 'N']),
(16, '平时做事时，你更相信：', 'self', 'perception', 1, '["经验和事实", "直觉和灵感"]', ARRAY['S', 'N']),
(17, '吵架后你更在意：', 'self', 'perception', 1, '["他说了什么", "他为什么说"]', ARRAY['S', 'N']),
(18, '工作学习中，更让你烦的是？', 'self', 'perception', 1, '["信息不完整、不具体", "不给空间发挥想法"]', ARRAY['S', 'N']);

-- TF 维度 (19-27) - dimension = 'judgment'
INSERT INTO questions (id, text, category, dimension, direction, options, "values") VALUES
(19, '朋友跟你吐露烦心事时，你更常先？', 'self', 'judgment', 1, '["帮他分析哪里出问题了", "先安慰他的情绪"]', ARRAY['T', 'F']),
(20, '工作上和同事有争议时，你更在意：', 'self', 'judgment', 1, '["看谁有道理", "看关系好不好"]', ARRAY['T', 'F']),
(21, '同事或朋友犯错时，你更可能？', 'self', 'judgment', 1, '["直接指出问题", "委婉提醒，怕伤人"]', ARRAY['T', 'F']),
(22, '面对批评时，你更先想？', 'self', 'judgment', 1, '["自己是不是有问题", "对方是不是太苛刻"]', ARRAY['T', 'F']),
(23, '吵架上头的时候你通常：', 'self', 'judgment', 1, '["摆事实讲逻辑不近人情", "委屈愤怒情绪失控"]', ARRAY['T', 'F']),
(24, '如果必须在诚实与圆滑之间选择：', 'self', 'judgment', 1, '["选择诚实", "选择圆滑"]', ARRAY['T', 'F']),
(25, '跟人聊天时，你更容易聊到？', 'self', 'judgment', 1, '["事实、分析、判断", "情绪、感受、经历"]', ARRAY['T', 'F']),
(26, '看新闻或故事时，你更关注？', 'self', 'judgment', 1, '["事情本身对不对", "当事人惨不惨"]', ARRAY['T', 'F']),
(27, '哪种状态更折磨你？', 'self', 'judgment', 1, '["为了照顾感受放弃原则", "为了讲原则伤了感情"]', ARRAY['T', 'F']);

-- JP 维度 (28-36) - dimension = 'lifestyle'
INSERT INTO questions (id, text, category, dimension, direction, options, "values") VALUES
(28, '当你把复杂的计划终于都完成时：', 'self', 'lifestyle', 1, '["有强烈的满足感", "有解脱的松弛感"]', ARRAY['J', 'P']),
(29, '接到一个新任务时，你更常？', 'self', 'lifestyle', 1, '["先列个计划再开始", "先开始再慢慢调整"]', ARRAY['J', 'P']),
(30, '一个说走就走完全没有计划的旅行对你来说：', 'self', 'lifestyle', 1, '["有点焦虑，不知道会发生什么", "有点期待，感觉很有意思"]', ARRAY['J', 'P']),
(31, '你制定的计划被打乱时，你通常会？', 'self', 'lifestyle', 1, '["有点不爽，想拉回正轨", "无所谓，顺着变"]', ARRAY['J', 'P']),
(32, '和朋友约局但是没有确定具体时间时，你会：', 'self', 'lifestyle', 1, '["提前主动确定时间", "到时候再说"]', ARRAY['J', 'P']),
(33, '收到很多待办事项时，你更会？', 'self', 'lifestyle', 1, '["按顺序一个个完成", "看心情先做想做的"]', ARRAY['J', 'P']),
(34, '当所需决定的信息足够多时，你更容易：', 'self', 'lifestyle', 1, '["很快做出决定", "还是想再看看"]', ARRAY['J', 'P']),
(35, '哪种情况更让你难受？', 'self', 'lifestyle', 1, '["事情没按你的计划走", "被要求完全按计划走"]', ARRAY['J', 'P']),
(36, '更喜欢哪种感受：', 'self', 'lifestyle', 1, '["确定性/控制感", "新鲜感/新挑战"]', ARRAY['J', 'P']);

-- ====================================================
-- 他测题目 (category = 'peer') ID: 37-56
-- 注意：options 列也需要填写！
-- ====================================================

-- EI 维度 (37-41) - dimension = 'energy'
INSERT INTO questions (id, text, category, dimension, direction, options, option_a, option_b, value_a, value_b) VALUES
(37, '以下哪种更像 TA ？', 'peer', 'energy', 1, '["会主动发起聚会", "更多是被动邀约"]', '会主动发起聚会', '更多是被动邀约', 'E', 'I'),
(38, '以下哪种更像 TA ？', 'peer', 'energy', 1, '["会和朋友主动吐槽烦心事", "更多自己消化烦心事"]', '会和朋友主动吐槽烦心事', '更多自己消化烦心事', 'E', 'I'),
(39, '以下哪种更像 TA ？', 'peer', 'energy', 1, '["聚会时会主动开启话题", "聚会时更多的倾听为主"]', '聚会时会主动开启话题', '聚会时更多的倾听为主', 'E', 'I'),
(40, 'TA一有空更常：', 'peer', 'energy', 1, '["主动找人约局/闲聊两句", "自己安排时间做自己的事"]', '主动找人约局/闲聊两句', '自己安排时间做自己的事', 'E', 'I'),
(41, '以下哪种更像 TA ？', 'peer', 'energy', 1, '["社交场合会看人说话", "社交场合更关注自己的感受"]', '社交场合会看人说话', '社交场合更关注自己的感受', 'E', 'I');

-- SN 维度 (42-46) - dimension = 'perception'
INSERT INTO questions (id, text, category, dimension, direction, options, option_a, option_b, value_a, value_b) VALUES
(42, '以下哪种更像 TA ？', 'peer', 'perception', 1, '["更喜欢活在当下", "更喜欢探究生命的意义"]', '更喜欢活在当下', '更喜欢探究生命的意义', 'S', 'N'),
(43, '以下哪种更像 TA ？', 'peer', 'perception', 1, '["因为别人一句冒犯的话生气", "因为别人行为背后的动机生气"]', '因为别人一句冒犯的话生气', '因为别人行为背后的动机生气', 'S', 'N'),
(44, 'TA聊天时更常：', 'peer', 'perception', 1, '["讲具体发生了什么", "讲这事背后说明什么"]', '讲具体发生了什么', '讲这事背后说明什么', 'S', 'N'),
(45, 'TA 解决问题的方式更接近？', 'peer', 'perception', 1, '["能解决就行实用派", "喜欢搞清楚原理"]', '能解决就行实用派', '喜欢搞清楚原理', 'S', 'N'),
(46, '平时做事时，TA更相信：', 'peer', 'perception', 1, '["经验和事实", "直觉和灵感"]', '经验和事实', '直觉和灵感', 'S', 'N');

-- TF 维度 (47-51) - dimension = 'judgment'
INSERT INTO questions (id, text, category, dimension, direction, options, option_a, option_b, value_a, value_b) VALUES
(47, '吵架上头的时候 TA通常：', 'peer', 'judgment', 1, '["摆事实讲逻辑不近人情", "委屈愤怒情绪失控"]', '摆事实讲逻辑不近人情', '委屈愤怒情绪失控', 'T', 'F'),
(48, '如果必须在诚实与圆滑之间选择，TA 会选择：', 'peer', 'judgment', 1, '["诚实", "圆滑"]', '诚实', '圆滑', 'T', 'F'),
(49, '朋友跟 TA吐露烦心事时，TA更常先？', 'peer', 'judgment', 1, '["帮你分析哪里出问题了", "先安慰你的情绪"]', '帮你分析哪里出问题了', '先安慰你的情绪', 'T', 'F'),
(50, '同事或朋友犯错时，TA更可能？', 'peer', 'judgment', 1, '["直接指出问题", "委婉提醒，怕伤人"]', '直接指出问题', '委婉提醒，怕伤人', 'T', 'F'),
(51, '跟人聊天时，TA更容易聊到？', 'peer', 'judgment', 1, '["事实、分析、判断", "情绪、感受、经历"]', '事实、分析、判断', '情绪、感受、经历', 'T', 'F');

-- JP 维度 (52-56) - dimension = 'lifestyle'
INSERT INTO questions (id, text, category, dimension, direction, options, option_a, option_b, value_a, value_b) VALUES
(52, '和朋友约局但是没有确定具体时间时，TA会：', 'peer', 'lifestyle', 1, '["提前主动确定时间", "到时候再说"]', '提前主动确定时间', '到时候再说', 'J', 'P'),
(53, 'TA制定的计划被打乱时，TA通常会？', 'peer', 'lifestyle', 1, '["有点不爽，想拉回正轨", "无所谓，顺着变"]', '有点不爽，想拉回正轨', '无所谓，顺着变', 'J', 'P'),
(54, 'TA更喜欢哪种感受：', 'peer', 'lifestyle', 1, '["确定性/控制感", "新鲜感/新挑战"]', '确定性/控制感', '新鲜感/新挑战', 'J', 'P'),
(55, '当所需决定的信息足够多时，TA更容易：', 'peer', 'lifestyle', 1, '["很快做出决定", "还是想再看看"]', '很快做出决定', '还是想再看看', 'J', 'P'),
(56, '哪种情况更让 TA难受？', 'peer', 'lifestyle', 1, '["事情没按 TA的计划走", "被要求完全按计划走"]', '事情没按 TA的计划走', '被要求完全按计划走', 'J', 'P');

-- ====================================================
-- 验证
-- ====================================================
SELECT category, COUNT(*) as count FROM questions GROUP BY category;
-- 预期结果: self=36, peer=20

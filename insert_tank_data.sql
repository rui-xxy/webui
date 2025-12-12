-- 更新储罐监控数据
-- 注意：假设 tank_monitoring_data 表的结构是 (tank_id, current_volume, level_percent, recorded_at)

-- 插入正确的储罐数据，使用 storage_tanks 表中已存在的 tank_id
INSERT INTO tank_monitoring_data (tank_id, current_volume, level_percent, recorded_at) VALUES
('98-1', 5777, 7.0, NOW()),
('98-2', 5777, 10.6, NOW()),
('98-3', 5777, 7.7, NOW()),
('98-4', 51, 30.9, NOW()),
('fy-1', 6150, 5.6, NOW()),
('fy-2', 6150, 10.9, NOW()),
('fy-3', 61, 41.3, NOW()),
('fy-4', 192, 69.5, NOW()),
('jp-1', 418, 0, NOW()),
('jp-2', 480, 0.2, NOW()),
('jp-3', 550, 42.7, NOW()),
('jp-4', 550, 10.0, NOW());

-- 验证插入的数据
SELECT
  t.tank_id,
  t.tank_name,
  t.acid_type,
  m.current_volume,
  m.level_percent,
  m.recorded_at
FROM tank_monitoring_data m
JOIN storage_tanks t ON m.tank_id = t.tank_id
ORDER BY m.recorded_at DESC;
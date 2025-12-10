-- 将储罐表字段名改为中文
-- 注意：执行前请备份数据库

-- 修改 storage_tanks 表
ALTER TABLE storage_tanks RENAME COLUMN tank_id TO "储罐ID";
ALTER TABLE storage_tanks RENAME COLUMN tank_name TO "储罐名称";
ALTER TABLE storage_tanks RENAME COLUMN acid_type TO "酸类型";
ALTER TABLE storage_tanks RENAME COLUMN capacity TO "容量";
ALTER TABLE storage_tanks RENAME COLUMN created_at TO "创建时间";
ALTER TABLE storage_tanks RENAME COLUMN updated_at TO "更新时间";

-- 修改 tank_monitoring_data 表
ALTER TABLE tank_monitoring_data RENAME COLUMN id TO "ID";
ALTER TABLE tank_monitoring_data RENAME COLUMN tank_id TO "储罐ID";
ALTER TABLE tank_monitoring_data RENAME COLUMN level_percent TO "液位百分比";
ALTER TABLE tank_monitoring_data RENAME COLUMN current_volume TO "当前体积";
ALTER TABLE tank_monitoring_data RENAME COLUMN recorded_at TO "记录时间";

-- 查看修改后的表结构
\d storage_tanks
\d tank_monitoring_data
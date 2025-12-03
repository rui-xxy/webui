-- 创建恒光化工数据库的SQL脚本
CREATE DATABASE "恒光化工"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- 连接到恒光化工数据库
\c 恒光化工

-- 创建部门表
CREATE TABLE 部门 (
    id SERIAL PRIMARY KEY,
    部门名称 VARCHAR(50) NOT NULL UNIQUE,
    创建时间 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    更新时间 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入部门数据
INSERT INTO 部门 (部门名称) VALUES
('2-EAQ生产部'),
('安环部'),
('氨基磺酸生产部'),
('财务部'),
('仓储物流部'),
('丰联生产部'),
('硫酸生产部'),
('品质部'),
('人资行政部'),
('新材料生产部'),
('营销部'),
('生产技术部'),
('集采中心'),
('拓展中心'),
('新材料事业中心'),
('审计部'),
('总经办');

-- 显示创建的部门
SELECT * FROM 部门;
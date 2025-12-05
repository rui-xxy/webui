-- Schema for the storage tank inventory module

CREATE TABLE IF NOT EXISTS storage_tank_categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS storage_tanks (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES storage_tank_categories(id) ON DELETE CASCADE,
    tank_name VARCHAR(50) NOT NULL,
    total_capacity NUMERIC(10,2) NOT NULL,
    current_volume NUMERIC(10,2) NOT NULL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample seed data matching the dashboard cards
INSERT INTO storage_tank_categories (title, sort_order) VALUES
    ('98酸', 1),
    ('发烟硫酸', 2),
    ('精品酸', 3)
ON CONFLICT DO NOTHING;

INSERT INTO storage_tanks (category_id, tank_name, total_capacity, current_volume, sort_order)
SELECT c.id, v.tank_name, v.total_capacity, v.current_volume, v.sort_order
FROM (
    VALUES
        ('98酸', '2#', 5777, 4332.8, 1),
        ('98酸', '3#', 5777, 3466.2, 2),
        ('98酸', '4#', 5777, 4910.5, 3),
        ('98酸', '攻酸槽', 51, 20.4, 4),
        ('发烟硫酸', '1#', 6150, 5535.0, 1),
        ('发烟硫酸', '5#', 6150, 4305.0, 2),
        ('发烟硫酸', '烟酸攻酸槽', 61, 33.6, 3),
        ('发烟硫酸', '氨基磺酸转运槽', 192, 153.6, 4),
        ('精品酸', '1#', 418, 271.7, 1),
        ('精品酸', '2#', 480, 240.0, 2),
        ('精品酸', '3#', 550, 192.5, 3),
        ('精品酸', '4#', 550, 484.0, 4)
) AS v(category_title, tank_name, total_capacity, current_volume, sort_order)
JOIN storage_tank_categories AS c ON c.title = v.category_title
ON CONFLICT DO NOTHING;

-- view for quick dashboard queries
CREATE OR REPLACE VIEW vw_storage_tank_inventory AS
SELECT
    c.id AS category_id,
    c.title AS category_title,
    c.sort_order AS category_sort_order,
    t.id AS tank_id,
    t.tank_name,
    t.total_capacity,
    t.current_volume,
    t.sort_order AS tank_sort_order,
    CASE
        WHEN t.total_capacity > 0
            THEN ROUND((t.current_volume / t.total_capacity) * 100, 2)
        ELSE 0
    END AS fill_percentage,
    t.updated_at
FROM storage_tank_categories AS c
JOIN storage_tanks AS t ON t.category_id = c.id;

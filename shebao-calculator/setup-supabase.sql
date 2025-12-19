-- 五险一金计算器数据库设置脚本
-- 请在 Supabase 的 SQL 编辑器中执行以下SQL语句

-- 1. 创建城市标准表
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建员工工资表
CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建计算结果表
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 插入示例城市数据（可选）
INSERT INTO cities (city_name, year, base_min, base_max, rate) VALUES
('佛山', '2023', 1900, 25786, 0.15),
('佛山', '2024', 1900, 26421, 0.15),
('广州', '2023', 2300, 28868, 0.15),
('广州', '2024', 2300, 28868, 0.15),
('深圳', '2023', 2360, 26421, 0.15),
('深圳', '2024', 2360, 27291, 0.15);

-- 5. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_cities_city_year ON cities(city_name, year);
CREATE INDEX IF NOT EXISTS idx_salaries_employee_city ON salaries(employee_name, city_name);
CREATE INDEX IF NOT EXISTS idx_results_city_year ON results(city_name, year);

-- 6. 启用行级安全策略（可选，但推荐）
-- 取消注释以下代码以启用RLS
-- ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 7. 创建RLS策略（如果启用了RLS）
-- 允许所有用户读取数据
-- CREATE POLICY "Allow read access" ON cities FOR SELECT USING (true);
-- CREATE POLICY "Allow read access" ON salaries FOR SELECT USING (true);
-- CREATE POLICY "Allow read access" ON results FOR SELECT USING (true);

-- 允许所有用户插入数据（根据需求调整）
-- CREATE POLICY "Allow insert" ON cities FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow insert" ON salaries FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow insert" ON results FOR INSERT WITH CHECK (true);

-- 8. 显示表信息
SELECT 'Cities table created' as status;
SELECT 'Salaries table created' as status;
SELECT 'Results table created' as status;
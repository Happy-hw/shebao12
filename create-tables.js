// 创建数据库表
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('正在创建数据库表...\n');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL 语句
const createCitiesTable = `
  CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    city_name TEXT NOT NULL,
    year TEXT NOT NULL,
    base_min INTEGER NOT NULL,
    base_max INTEGER NOT NULL,
    rate FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createSalariesTable = `
  CREATE TABLE IF NOT EXISTS salaries (
    id SERIAL PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    city_name TEXT NOT NULL,
    month TEXT NOT NULL,
    salary_amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createResultsTable = `
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
`;

// 使用 Supabase 的 SQL Editor 的 RPC
async function createTables() {
  try {
    console.log('1. 创建 cities 表...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: createCitiesTable });
    if (error && error.message !== 'Already exists') {
      console.log('   注意：请直接在 Supabase SQL Editor 中执行以下 SQL：');
      console.log('\n' + createCitiesTable);
    } else {
      console.log('   ✅ cities 表创建成功或已存在');
    }

    console.log('\n2. 创建 salaries 表...');
    const { data: data2, error: error2 } = await supabase.rpc('exec_sql', { sql: createSalariesTable });
    if (error2 && error2.message !== 'Already exists') {
      console.log('   注意：请直接在 Supabase SQL Editor 中执行以下 SQL：');
      console.log('\n' + createSalariesTable);
    } else {
      console.log('   ✅ salaries 表创建成功或已存在');
    }

    console.log('\n3. 创建 results 表...');
    const { data: data3, error: error3 } = await supabase.rpc('exec_sql', { sql: createResultsTable });
    if (error3 && error3.message !== 'Already exists') {
      console.log('   注意：请直接在 Supabase SQL Editor 中执行以下 SQL：');
      console.log('\n' + createResultsTable);
    } else {
      console.log('   ✅ results 表创建成功或已存在');
    }

    console.log('\n✅ 所有表创建完成！');

    // 插入示例数据
    console.log('\n正在插入示例数据...');

    const sampleCities = [
      { city_name: '佛山', year: '2023', base_min: 1900, base_max: 25786, rate: 0.15 },
      { city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
      { city_name: '广州', year: '2023', base_min: 2300, base_max: 28868, rate: 0.15 },
      { city_name: '广州', year: '2024', base_min: 2300, base_max: 28868, rate: 0.15 },
      { city_name: '深圳', year: '2023', base_min: 2360, base_max: 26421, rate: 0.15 },
      { city_name: '深圳', year: '2024', base_min: 2360, base_max: 27291, rate: 0.15 }
    ];

    const { error: insertError } = await supabase.from('cities').insert(sampleCities);
    if (insertError) {
      console.log('   插入示例数据失败（可能已存在）：', insertError.message);
    } else {
      console.log('   ✅ 示例城市数据插入成功');
    }

  } catch (err) {
    console.log('\n请手动在 Supabase SQL Editor 中执行以下 SQL：\n');
    console.log('--- 创建 cities 表 ---');
    console.log(createCitiesTable);
    console.log('\n--- 创建 salaries 表 ---');
    console.log(createSalariesTable);
    console.log('\n--- 创建 results 表 ---');
    console.log(createResultsTable);
  }
}

createTables();
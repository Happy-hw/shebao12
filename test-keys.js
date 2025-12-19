// 测试 API 密钥
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('测试 API 密钥...\n');

// 测试 anon key
console.log('1. 测试 Anon Key:');
const supabase = createClient(supabaseUrl, supabaseAnonKey);
supabase.from('cities').select('count')
  .then(({ data, error }) => {
    if (error) {
      console.log('   ❌ Anon Key 无效:', error.message);
    } else {
      console.log('   ✅ Anon Key 有效');
    }
  })
  .catch(err => {
    console.log('   ❌ Anon Key 连接失败:', err.message);
  });

// 测试 service key
console.log('\n2. 测试 Service Key:');
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
supabaseAdmin.from('cities').select('count')
  .then(({ data, error }) => {
    if (error) {
      console.log('   ❌ Service Key 无效:', error.message);
      console.log('\n请检查 Service Key 是否正确复制。');
      console.log('Service Key 应该以 eyJ 开头，长度约为 200+ 字符');
    } else {
      console.log('   ✅ Service Key 有效');

      // 如果有效，尝试创建表
      console.log('\n3. 尝试创建表（如果不存在）...');
      createTablesIfNotExists(supabaseAdmin);
    }
  })
  .catch(err => {
    console.log('   ❌ Service Key 连接失败:', err.message);
  });

async function createTablesIfNotExists(supabase) {
  try {
    // 简单测试表是否存在
    const { data, error } = await supabase.from('cities').select('count', { count: 'exact', head: true });

    if (error && error.code === 'PGRST116') {
      console.log('   ⚠️  表不存在，需要在 Supabase SQL Editor 中创建');
      console.log('\n请在 Supabase SQL Editor 中执行以下 SQL：');
      console.log('----------------------------------------');
      console.log(`CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
      console.log('\nCREATE TABLE IF NOT EXISTS salaries (');
      console.log('  id SERIAL PRIMARY KEY,');
      console.log('  employee_id TEXT NOT NULL,');
      console.log('  employee_name TEXT NOT NULL,');
      console.log('  city_name TEXT NOT NULL,');
      console.log('  month TEXT NOT NULL,');
      console.log('  salary_amount INTEGER NOT NULL,');
      console.log('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log(');');
      console.log('\nCREATE TABLE IF NOT EXISTS results (');
      console.log('  id SERIAL PRIMARY KEY,');
      console.log('  employee_name TEXT NOT NULL,');
      console.log('  city_name TEXT NOT NULL,');
      console.log('  year TEXT NOT NULL,');
      console.log('  avg_salary FLOAT NOT NULL,');
      console.log('  contribution_base FLOAT NOT NULL,');
      console.log('  company_fee FLOAT NOT NULL,');
      console.log('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log(');');
      console.log('----------------------------------------');
    } else if (error) {
      console.log('   ❌ 其他错误:', error.message);
    } else {
      console.log('   ✅ 表已存在');
    }
  } catch (err) {
    console.log('   ❌ 错误:', err.message);
  }
}
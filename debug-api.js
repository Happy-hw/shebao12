// 调试 API 连接
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('========================================');
console.log('Supabase 配置检查');
console.log('========================================');
console.log('URL:', supabaseUrl);
console.log('Anon Key 长度:', supabaseAnonKey?.length || 0);
console.log('Service Key 长度:', supabaseServiceKey?.length || 0);
console.log('Service Key 原值:', supabaseServiceKey);
console.log('========================================');

// 测试数据库连接
const { createClient } = require('@supabase/supabase-js');

async function testTables() {
  console.log('\n测试数据库连接...');

  try {
    // 使用 service key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 检查表是否存在
    const tables = ['cities', 'salaries', 'results'];

    for (const table of tables) {
      console.log(`\n检查表: ${table}`);
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`  ❌ 错误:`, error);
          console.error(`  详情:`, error.details);
          console.error(`  代码:`, error.code);
        } else {
          console.log(`  ✅ 表存在，记录数: ${count}`);
        }
      } catch (err) {
        console.error(`  ❌ 异常:`, err.message);
      }
    }
  } catch (err) {
    console.error('\n连接失败:', err.message);
  }
}

testTables();
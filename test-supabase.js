// 测试 Supabase 连接
const { createClient } = require('@supabase/supabase-js');

// 从 .env.local 读取配置
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? '已配置' : '未配置');
console.log('Service Key:', supabaseServiceKey && supabaseServiceKey !== 'your_supabase_service_role_key' ? '已配置' : '未配置（需要配置）');

// 测试连接
async function testConnection() {
  try {
    // 使用 anon key 测试
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.from('cities').select('count');

    if (error) {
      console.error('Anon Key 测试失败:', error.message);
    } else {
      console.log('Anon Key 连接成功');
    }

    // 如果有 service key，也测试一下
    if (supabaseServiceKey && supabaseServiceKey !== 'your_supabase_service_role_key') {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { data: data2, error: error2 } = await supabaseAdmin.from('cities').select('count');

      if (error2) {
        console.error('Service Key 测试失败:', error2.message);
      } else {
        console.log('Service Key 连接成功');
      }
    }
  } catch (err) {
    console.error('测试连接时出错:', err.message);
  }
}

testConnection();
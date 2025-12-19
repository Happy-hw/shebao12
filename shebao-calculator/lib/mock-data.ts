// 模拟数据用于测试
export const mockCities = [
  { city_name: '佛山', year: '2023', base_min: 1900, base_max: 25786, rate: 0.15 },
  { city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
  { city_name: '广州', year: '2023', base_min: 2300, base_max: 28868, rate: 0.15 },
  { city_name: '广州', year: '2024', base_min: 2300, base_max: 28868, rate: 0.15 },
  { city_name: '深圳', year: '2023', base_min: 2360, base_max: 26421, rate: 0.15 },
  { city_name: '深圳', year: '2024', base_min: 2360, base_max: 27291, rate: 0.15 },
  { city_name: '东莞', year: '2023', base_min: 1900, base_max: 25017, rate: 0.14 },
  { city_name: '东莞', year: '2024', base_min: 1900, base_max: 25874, rate: 0.14 }
];

export const mockSalaries = [
  { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202301', salary_amount: 8500 },
  { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202302', salary_amount: 8500 },
  { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202303', salary_amount: 8500 },
  { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202304', salary_amount: 9000 },
  { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202305', salary_amount: 9000 },
  { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202306', salary_amount: 9000 },
  { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202301', salary_amount: 7200 },
  { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202302', salary_amount: 7200 },
  { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202303', salary_amount: 7800 },
  { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202304', salary_amount: 7800 },
  { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202305', salary_amount: 7800 },
  { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202306', salary_amount: 7800 },
  { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202301', salary_amount: 6500 },
  { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202302', salary_amount: 6500 },
  { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202303', salary_amount: 7000 },
  { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202304', salary_amount: 7000 },
  { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202305', salary_amount: 7000 },
  { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202306', salary_amount: 7000 },
  { employee_id: 'E004', employee_name: '赵六', city_name: '东莞', month: '202301', salary_amount: 5800 },
  { employee_id: 'E004', employee_name: '赵六', city_name: '东莞', month: '202302', salary_amount: 5800 },
  { employee_id: 'E004', employee_name: '赵六', city_name: '东莞', month: '202303', salary_amount: 6200 },
  { employee_id: 'E004', employee_name: '赵六', city_name: '东莞', month: '202304', salary_amount: 6200 },
  { employee_id: 'E004', employee_name: '赵六', city_name: '东莞', month: '202305', salary_amount: 6200 },
  { employee_id: 'E004', employee_name: '赵六', city_name: '东莞', month: '202306', salary_amount: 6200 },
  { employee_id: 'E005', employee_name: '钱七', city_name: '深圳', month: '202301', salary_amount: 12000 },
  { employee_id: 'E005', employee_name: '钱七', city_name: '深圳', month: '202302', salary_amount: 12000 },
  { employee_id: 'E005', employee_name: '钱七', city_name: '深圳', month: '202303', salary_amount: 12500 },
  { employee_id: 'E005', employee_name: '钱七', city_name: '深圳', month: '202304', salary_amount: 13000 },
  { employee_id: 'E005', employee_name: '钱七', city_name: '深圳', month: '202305', salary_amount: 13000 },
  { employee_id: 'E005', employee_name: '钱七', city_name: '深圳', month: '202306', salary_amount: 13500 }
];

export const mockResults = [
  { id: 1, employee_name: '张三', city_name: '深圳', year: '2023', avg_salary: 8750, contribution_base: 8750, company_fee: 1312.5, created_at: new Date().toISOString() },
  { id: 2, employee_name: '李四', city_name: '广州', year: '2023', avg_salary: 7600, contribution_base: 7600, company_fee: 1140, created_at: new Date().toISOString() },
  { id: 3, employee_name: '王五', city_name: '佛山', year: '2023', avg_salary: 6750, contribution_base: 6750, company_fee: 1012.5, created_at: new Date().toISOString() },
  { id: 4, employee_name: '赵六', city_name: '东莞', year: '2023', avg_salary: 6000, contribution_base: 6000, company_fee: 840, created_at: new Date().toISOString() },
  { id: 5, employee_name: '钱七', city_name: '深圳', year: '2023', avg_salary: 12666.67, contribution_base: 12666.67, company_fee: 1900, created_at: new Date().toISOString() }
];
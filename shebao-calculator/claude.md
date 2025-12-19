# 五险一金计算器项目 - 上下文管理中枢

## 项目目标
构建一个迷你的"五险一金"计算器Web应用，支持多城市、多年份的社保公积金计算。根据预设的员工工资数据和城市社保标准，计算出公司为每位员工应缴纳的社保公积金费用。

## 技术栈
- **前端框架**: Next.js 14 (使用 App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase (PostgreSQL)
- **文件处理**: xlsx库（Excel文件解析）

## 数据库设计

### cities 表（城市标准表）
```sql
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL
);
```

### salaries 表（员工工资表）
```sql
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL
);
```

### results 表（计算结果表）
```sql
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 核心业务逻辑

### 计算流程
1. **数据读取**: 从 salaries 表中读取所有数据
2. **分组处理**: 按 employee_name 和 city_name 分组，计算每位员工在各城市的年度月平均工资
3. **标准获取**: 根据 city_name 和 year 从 cities 表获取对应的社保标准
4. **基数确定**:
   - 若 avg_salary < base_min，使用 base_min
   - 若 avg_salary > base_max，使用 base_max
   - 否则使用 avg_salary
5. **金额计算**: company_fee = contribution_base × rate
6. **结果存储**: 将结果存入 results 表

### 注意事项
- 支持多城市、多年份的灵活计算
- 工资数据必须与对应年份的社保标准匹配
- 同一员工在不同城市可能有不同的计算结果

## 前端页面功能

### 1. 主页 (/)
- **功能**: 应用入口和导航中心
- **布局**: 两个并排或垂直排列的功能卡片
- **卡片一**: "数据上传" - 链接到 /upload
- **卡片二**: "结果查询" - 链接到 /results

### 2. 数据上传页 (/upload)
- **功能**: 数据准备和计算触发
- **按钮一**: "上传城市数据"
  - 上传 Excel 文件到 cities 表
  - 文件格式验证
  - 上传结果反馈
- **按钮二**: "上传工资数据"
  - 上传 Excel 文件到 salaries 表
  - 支持多城市、多年份数据
  - 上传结果反馈
- **按钮三**: "执行计算并存储结果"
  - 触发完整的计算流程
  - 显示计算进度
  - 完成后跳转到结果页

### 3. 结果查询页 (/results)
- **功能**: 展示所有计算结果
- **自动加载**: 页面加载时获取 results 表数据
- **表格展示**:
  - employee_name (员工姓名)
  - city_name (城市)
  - year (年份)
  - avg_salary (平均工资)
  - contribution_base (缴费基数)
  - company_fee (公司缴纳)
- **筛选功能**: 按城市、年份筛选
- **汇总信息**: 显示总缴纳金额

## 详细开发任务清单 (TODOList)

### Phase 1: 项目初始化
- [ ] 创建 Next.js 项目 (`npx create-next-app@latest`)
- [ ] 安装项目依赖
  - [ ] supabase (`@supabase/supabase-js`)
  - [ ] xlsx (`xlsx`)
  - [ ] tailwindcss (已内置)
- [ ] 配置环境变量 (.env.local)
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY

### Phase 2: Supabase 设置
- [ ] 创建 Supabase 项目
- [ ] 创建数据表
  - [ ] 创建 cities 表
  - [ ] 创建 salaries 表
  - [ ] 创建 results 表
- [ ] 设置表的权限 (RLS)
- [ ] 测试数据库连接

### Phase 3: 后端 API 开发
- [ ] 创建 Supabase 客户端 (`lib/supabase.ts`)
- [ ] Excel 解析工具函数 (`lib/excel-parser.ts`)
- [ ] API 路由: `/api/upload/cities`
  - [ ] 接收文件上传
  - [ ] 解析 Excel 数据
  - [ ] 插入 cities 表
- [ ] API 路由: `/api/upload/salaries`
  - [ ] 接收文件上传
  - [ ] 解析 Excel 数据
  - [ ] 插入 salaries 表
- [ ] API 路由: `/api/calculate`
  - [ ] 执行完整计算流程
  - [ ] 批量处理数据
  - [ ] 返回计算结果统计
- [ ] API 路由: `/api/results`
  - [ ] 查询计算结果
  - [ ] 支持筛选参数

### Phase 4: 核心计算逻辑
- [ ] 计算引擎 (`lib/calculator.ts`)
  - [ ] 函数: `calculateAverageSalary()` - 计算平均工资
  - [ ] 函数: `getCityStandard()` - 获取城市标准
  - [ ] 函数: `determineContributionBase()` - 确定缴费基数
  - [ ] 函数: `calculateCompanyFee()` - 计算公司费用
  - [ ] 函数: `executeCalculation()` - 主计算流程

### Phase 5: 前端页面开发
- [ ] 主页 (`app/page.tsx`)
  - [ ] 创建页面布局
  - [ ] 实现功能卡片组件
  - [ ] 添加路由链接
- [ ] 上传页 (`app/upload/page.tsx`)
  - [ ] 创建上传表单
  - [ ] 实现文件选择组件
  - [ ] 添加上传进度显示
  - [ ] 实现计算按钮和进度
- [ ] 结果页 (`app/results/page.tsx`)
  - [ ] 创建数据表格组件
  - [ ] 实现数据筛选功能
  - [ ] 添加分页或虚拟滚动
  - [ ] 显示汇总统计

### Phase 6: UI/UX 优化
- [ ] 创建全局样式 (`app/globals.css`)
- [ ] 实现响应式设计
- [ ] 添加加载状态组件
- [ ] 实现错误处理和提示
- [ ] 优化表单交互体验

### Phase 7: 测试与验证
- [ ] 单元测试
  - [ ] 测试 Excel 解析功能
  - [ ] 测试计算逻辑
  - [ ] 测试 API 接口
- [ ] 集成测试
  - [ ] 测试完整上传流程
  - [ ] 测试计算和结果展示
- [ ] 边界测试
  - [ ] 测试空数据处理
  - [ ] 测试大数据量处理

### Phase 8: 部署准备
- [ ] 优化项目配置
- [ ] 准备部署文档
- [ ] 配置生产环境变量
- [ ] 执行最终测试

## 项目文件结构
```
shebao/
├── app/
│   ├── page.tsx              # 主页
│   ├── upload/
│   │   └── page.tsx          # 上传页
│   ├── results/
│   │   └── page.tsx          # 结果页
│   ├── api/
│   │   ├── upload/
│   │   │   ├── cities/
│   │   │   │   └── route.ts  # 城市数据上传API
│   │   │   └── salaries/
│   │   │       └── route.ts  # 工资数据上传API
│   │   ├── calculate/
│   │   │   └── route.ts      # 计算API
│   │   └── results/
│   │       └── route.ts      # 结果查询API
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── loading.tsx           # 加载组件
├── lib/
│   ├── supabase.ts           # Supabase客户端
│   ├── calculator.ts         # 核心计算逻辑
│   └── excel-parser.ts       # Excel解析工具
├── components/
│   ├── ui/                   # UI组件库
│   ├── Card.tsx              # 卡片组件
│   ├── DataTable.tsx         # 数据表格
│   └── FileUpload.tsx        # 文件上传组件
├── public/
├── .env.local                # 环境变量
├── package.json
├── tailwind.config.js
└── README.md
```

## 注意事项
1. 所有功能都要支持多城市、多年份
2. 数据上传要有格式验证
3. 计算过程要处理边界情况
4. UI要简洁易用，响应式设计
5. 错误处理要友好清晰
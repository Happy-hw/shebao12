# 五险一金计算器

一个基于Next.js的Web应用，用于计算公司为员工缴纳的五险一金费用。

## 功能特点

- 📊 支持Excel文件批量导入数据
- 🏙️ 支持多城市社保标准
- 📅 支持多年份数据计算
- 💰 自动计算缴费基数和公司应缴费用
- 📈 结果展示和筛选功能

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI框架**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **文件处理**: xlsx

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd shebao-calculator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件并配置以下环境变量：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. 设置Supabase数据库

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在SQL编辑器中执行以下SQL创建表：

```sql
-- 创建城市标准表
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL
);

-- 创建员工工资表
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL
);

-- 创建计算结果表
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

### 5. 运行项目

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用指南

### 1. 上传城市数据

准备Excel文件，包含以下字段：
- city_name (城市名)
- year (年份)
- base_min (社保基数下限)
- base_max (社保基数上限)
- rate (综合缴纳比例)

### 2. 上传工资数据

准备Excel文件，包含以下字段：
- employee_id (员工工号)
- employee_name (员工姓名)
- city_name (城市)
- month (月份，格式：YYYYMM)
- salary_amount (工资金额)

### 3. 执行计算

点击"执行计算"按钮，系统将自动：
- 计算每位员工的年度月平均工资
- 根据城市标准确定缴费基数
- 计算公司应缴纳金额
- 保存计算结果

### 4. 查看结果

在结果页面可以：
- 查看所有员工的计算结果
- 按城市和年份筛选
- 查看总缴纳金额统计

## 项目结构

```
shebao-calculator/
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
│   └── layout.tsx            # 根布局
├── lib/
│   ├── supabase.ts           # Supabase客户端
│   ├── calculator.ts         # 核心计算逻辑
│   └── excel-parser.ts       # Excel解析工具
├── public/
├── .env.local                # 环境变量
├── package.json
├── tailwind.config.ts
└── README.md
```

## 注意事项

1. 确保Excel文件格式正确，包含所有必需字段
2. 工资数据的城市名称必须与城市数据中的城市名称一致
3. 计算结果基于上传的数据，请确保数据准确性
4. 建议定期备份计算结果

## 开发说明

### 本地开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License

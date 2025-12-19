const XLSX = require('xlsx');

// Create cities_template.xlsx
function createCitiesTemplate() {
    const citiesData = [
        ['city_name', 'year', 'base_min', 'base_max', 'rate'],
        ['佛山', 2023, 1900, 23832, 0.105],
        ['佛山', 2024, 1900, 24795, 0.107],
        ['广州', 2023, 2100, 36042, 0.145],
        ['广州', 2024, 2300, 38082, 0.148],
        ['深圳', 2023, 2360, 26421, 0.155],
        ['深圳', 2024, 2520, 27978, 0.158],
        ['东莞', 2023, 1900, 25017, 0.115],
        ['东莞', 2024, 1900, 25874, 0.118]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(citiesData);

    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, // city_name
        { wch: 10 }, // year
        { wch: 12 }, // base_min
        { wch: 12 }, // base_max
        { wch: 10 }  // rate
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Cities');
    XLSX.writeFile(wb, 'cities_template.xlsx');
    console.log('Created cities_template.xlsx');
}

// Create salaries_template.xlsx
function createSalariesTemplate() {
    const salariesData = [
        ['employee_id', 'employee_name', 'city_name', 'month', 'salary_amount'],
        ['E001', '张三', '深圳', '2023-01', 8500],
        ['E002', '李四', '广州', '2023-01', 7200],
        ['E003', '王五', '佛山', '2023-01', 6500],
        ['E004', '赵六', '东莞', '2023-01', 5800],
        ['E001', '张三', '深圳', '2023-02', 8500],
        ['E002', '李四', '广州', '2023-02', 7200],
        ['E003', '王五', '佛山', '2023-02', 6800],
        ['E004', '赵六', '东莞', '2023-02', 5800],
        ['E005', '钱七', '深圳', '2023-02', 12000],
        ['E001', '张三', '深圳', '2024-01', 9000],
        ['E002', '李四', '广州', '2024-01', 7800],
        ['E003', '王五', '佛山', '2024-01', 7000],
        ['E004', '赵六', '东莞', '2024-01', 6200],
        ['E005', '钱七', '深圳', '2024-01', 13500]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(salariesData);

    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, // employee_id
        { wch: 15 }, // employee_name
        { wch: 15 }, // city_name
        { wch: 10 }, // month
        { wch: 15 }  // salary_amount
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Salaries');
    XLSX.writeFile(wb, 'salaries_template.xlsx');
    console.log('Created salaries_template.xlsx');
}

// Create both templates
console.log('Creating Excel template files...');
createCitiesTemplate();
createSalariesTemplate();
console.log('All templates created successfully!');
import { pool } from './apps/server/src/db/pool';
import * as fs from 'fs';
import * as path from 'path';

async function initMeters() {
  try {
    console.log('正在连接数据库...');
    
    // 读取 SQL 文件
    const sqlPath = path.join(process.cwd(), 'create_meter_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('正在执行建表脚本...');
    await pool.query(sql);

    console.log('✅ 成功创建仪表管理表 (utility_meters 和 meter_readings)');
    console.log('✅ 已处理“清零/换表”字段 (is_reset)');
    
  } catch (err) {
    console.error('❌ 创建失败:', err);
  } finally {
    await pool.end();
  }
}

initMeters();

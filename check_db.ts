import { Pool } from 'pg'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'hengguang_chemical',
  user: 'postgres',
  password: process.env.PGPASSWORD || '123456'
})

async function check() {
  try {
    // 1. 查 storage_tanks 表结构
    console.log('\n=== storage_tanks 表结构 ===')
    const schema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'storage_tanks';
    `)
    console.table(schema.rows)

    // 2. 查 storage_tanks 里的前几条数据（看看 acid_type 长啥样）
    console.log('\n=== storage_tanks 现有数据样本 ===')
    const data = await pool.query('SELECT tank_id, tank_name, acid_type FROM storage_tanks LIMIT 5')
    console.table(data.rows)

    // 3. 查 materials 表结构
    console.log('\n=== materials 表结构 ===')
    const materialsSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'materials';
    `)
    console.table(materialsSchema.rows)

    // 4. 查 materials 现有数据
    console.log('\n=== materials 现有数据 ===')
    const materialsData = await pool.query('SELECT * FROM materials')
    console.table(materialsData.rows)

  } catch (err) {
    console.error('查询出错:', err)
  } finally {
    await pool.end()
  }
}

check()

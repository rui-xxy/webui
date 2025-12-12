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
    console.log('\n=== materials 表结构 ===')
    const schema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'materials';
    `)
    console.table(schema.rows)

    console.log('\n=== materials 现有数据 ===')
    const data = await pool.query('SELECT * FROM materials')
    console.table(data.rows)

  } catch (err) {
    console.error('查询出错:', err)
  } finally {
    await pool.end()
  }
}

check()

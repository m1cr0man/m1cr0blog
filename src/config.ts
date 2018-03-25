import { env } from 'process'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

export const appRoot = __dirname

export const uploadRoot = appRoot + '/uploads'

export const dbConfig: MysqlConnectionOptions = {
    type: 'mysql',
    host: env.DB_HOST || '127.0.0.1',
    port: +(env.DB_PORT || 3306),
    database: env.DB_NAME || 'm1cr0blog',
    username: env.DB_USER || 'm1cr0blog',
    password: env.DB_PASS,
    entities: [__dirname + '/**/*entity.{js,ts}'],
    synchronize: true
}

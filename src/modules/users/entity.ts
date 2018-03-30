import { Column, Entity } from 'typeorm'
import { compare, hash, genSaltSync} from 'bcryptjs'

const salt = genSaltSync(10)

@Entity()
export class User {
    @Column('varchar', { primary: true })
    // @ts-ignore
    name: string

    @Column('char', { length: 24, unique: true })
    // @ts-ignore
    token: string

    // Length of the bcrypt hashes
    @Column('char', { length: 60, select: false })
    // @ts-ignore
    password: string

    @Column('json')
    // @ts-ignore
    permissions: string[]

    async setPassword(plain_pwd: string): Promise<void> {
        this.password = await hash(plain_pwd, salt)
    }

    checkPassword(plain_pwd: string): Promise<boolean> {
        return compare(plain_pwd, this.password)
    }
}

import { existsSync, mkdir, rename, unlinkSync } from 'fs'
import { BeforeRemove, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import * as moment from 'moment'
import { uploadRoot } from '../../config'
import { promisify } from 'util'
import { User } from '../users/entity'

const mkdirPromise = promisify(mkdir)
const renamePromise = promisify(rename)

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    readonly id: number

    @ManyToOne(() => User, { cascadeAll: true, eager: true })
    // @ts-ignore
    user: User

    @Column('text')
    // @ts-ignore
    filename: string

    @Column('bigint')
    // @ts-ignore
    size: number

    @Column('varchar')
    // @ts-ignore
    mime: string

    @Column('datetime', { precision: 3 })
    // @ts-ignore
    date: Date

    @BeforeRemove()
    removeFile(): void {
        // Check that file exists before deleting, to guarantee
        // that deleting an upload is always idempotent
        const path = this.path
        if (existsSync(path)) unlinkSync(this.path)
    }

    get dirname(): string {
        const folderName = moment(this.date).format('GGMMDD')
        return `${uploadRoot}/${folderName}`
    }

    get path(): string {
        const fileName = `${this.date.getMilliseconds()}.${this.filename}`
        return `${this.dirname}/${fileName}`
    }

    async addFile(raw_file: Express.Multer.File) {
        if (!existsSync(this.dirname)) await mkdirPromise(this.dirname)
        await renamePromise(raw_file.path, this.path)
    }
}

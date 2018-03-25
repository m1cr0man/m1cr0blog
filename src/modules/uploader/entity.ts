import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs'
import { Entity, Column, PrimaryGeneratedColumn, BeforeRemove } from 'typeorm'
import * as moment from 'moment'
import { uploadRoot } from '../../config'

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    readonly id: number

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
        if (this.exists()) unlinkSync(this.path)
    }

    get dirname(): string {
        const folderName = moment(this.date).format('GGMMDD')
        return `${uploadRoot}/${folderName}`
    }

    get path(): string {
        return `${this.dirname}/${this.id}`
    }

    set file(raw_file: Express.Multer.File) {
        if (!existsSync(this.dirname)) mkdirSync(this.dirname)
        renameSync(raw_file.path, this.path)
    }

    exists(): boolean {
        return existsSync(this.path)
    }
}

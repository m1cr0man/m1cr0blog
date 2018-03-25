import { existsSync, mkdirSync, renameSync } from 'fs'
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
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

    @Column('int')
    // @ts-ignore
    size: number

    @Column('varchar')
    // @ts-ignore
    mime: string

    @CreateDateColumn()
    // @ts-ignore
    readonly date: Date

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

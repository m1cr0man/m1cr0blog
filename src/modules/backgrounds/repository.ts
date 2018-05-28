import { HttpException } from '@nestjs/common'
import { existsSync, unlinkSync } from 'fs'
import { join as j } from 'path'
import { Repository } from '../../fsrepo/repository'
import { Background } from './entity'

export class BackgroundsRepository extends Repository<Background> {

    constructor(userId: string) {
        if (!existsSync(j('users', userId))) throw new HttpException('User not found', 404)
        super(j('users', userId, 'uploads'), Background, 3, 'bgdata.json')
    }

    save(ent: Background) {
        if (!existsSync(this.getDir(ent))) throw new HttpException('Upload not found', 404)
        return super.save(ent)
    }

    delete(ent: Background): void {
        if (this.exists(ent.id)) unlinkSync(j(this.getDir(ent), this.metafile))
    }
}

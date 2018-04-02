import { Component, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Upload } from './entity'
import { User } from '../users/entity'

@Component()
export class UploadService {
    constructor(
        @InjectRepository(Upload)
        private readonly repo: Repository<Upload>,
    ) {}

    find(user: User): Promise<Upload[]> {
        return this.repo.find({ user })
    }

    async findOne(id: number): Promise<Upload> {
        const upload = await this.repo.findOneById(id)
        if (!upload) throw new HttpException('File not found', 404)
        return upload
    }

    async create(file: Express.Multer.File, user: User): Promise<Upload> {
        const upload = this.repo.create({
            filename: file.originalname,
            mime: file.mimetype,
            size: file.size,
            date: new Date(),
            user: user
        })

        await upload.addFile(file)

        return this.repo.save(upload)
    }

    async delete(id: number, user: User): Promise<void> {
        const upload = await this.repo.findOneById(id)
        if (upload && upload.user.name != user.name)
            throw new HttpException('Forbidden', 403)
        else if (upload) await this.repo.remove(upload)
    }
}

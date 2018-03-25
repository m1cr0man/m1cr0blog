import { Component, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Upload } from './entity'

@Component()
export class UploadService {
    constructor(
        @InjectRepository(Upload)
        private readonly repo: Repository<Upload>,
    ) {}

    find(): Promise<Upload[]> {
        return this.repo.find()
    }

    async findOne(id: number): Promise<Upload> {
        const upload = await this.repo.findOneById(id)
        if (!upload || !upload.exists()) throw new HttpException('File not found', 404)
        return upload
    }

    async create(file: Express.Multer.File): Promise<Upload> {
        const upload = this.repo.create({
            filename: file.originalname,
            mime: file.mimetype,
            size: file.size
        })

        // Save before adding the file, so that date and ID are set
        await this.repo.save(upload)
        upload.file = file

        return upload
    }

    async delete(id: number): Promise<void> {
        const upload = await this.repo.findOneById(id)
        if (upload) await this.repo.remove(upload)
    }
}

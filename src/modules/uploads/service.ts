import { Component, HttpException } from '@nestjs/common'
import { Upload } from './entity'
import { User } from '../users/entity'

@Component()
export class UploadsService {

    static find(user: User): Upload[] {
        return user.uploads.find()
    }

    static findOne(user: User, id: string): Upload {
        const upload = user.uploads.findOne(id)
        if (!upload) throw new HttpException('Upload not found', 404)
        return upload
    }

    static async create(user: User, file: Express.Multer.File): Promise<Upload> {
        const upload = new Upload(
            user.uploads.generateId(),
            file.originalname,
            file.mimetype,
            new Date(),
            3600,
            file.size
        )
        user.uploads.save(upload)
        user.uploads.saveFile(file, upload)

        return upload
    }

    static delete(user: User, id: string): void {
        const upload = user.uploads.findOne(id)
        if (upload) user.uploads.delete(upload)
    }
}

import { Get, Controller } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Upload } from './entity'

@Controller()
export class UploadController {
    constructor(
        @InjectRepository(Upload)
        private readonly uploadRepo: Repository<Upload>,
    ) {}

    @Get('upload')
    async list(): Promise<Upload[]> {
        return await this.uploadRepo.find()
    }
}

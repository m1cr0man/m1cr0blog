import { Inject, Injectable, PipeTransform } from '@nestjs/common'
import { UserService } from '../users'
import { UploadsService } from './service'

@Injectable()
export class UploadsPipe implements PipeTransform {
    constructor(
        @Inject(UserService)
        private readonly userService: UserService,
    ) {
    }

    transform(userId: string): UploadsService {
        return new UploadsService(this.userService.findOne(userId).uploads)
    }
}

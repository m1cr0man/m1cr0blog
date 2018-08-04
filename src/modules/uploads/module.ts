import { Inject, Module } from '@nestjs/common'
import { UserModule, UserService } from '../users'
import { UploadsController } from './controller'
import { UploadsPipe } from './pipe'
import { UploadsRepository } from './repository'
import { UploadsService } from './service'
import { UploadsViewController } from './viewcontroller'


@Module({
    controllers: [UploadsController, UploadsViewController],
    providers: [UploadsPipe],
    imports: [UserModule],
    exports: [UploadsPipe]
})
export class UploadsModule {
    constructor(
        @Inject(UserService) userService: UserService
    ) {
        // Set up expiry monitor
        // Runs every 5 minutes
        setInterval(() => {
            for (let user of userService.find()) {
                (new UploadsService(new UploadsRepository(user))).clean()
            }
        }, 1000 * 60 * 5)
    }
}

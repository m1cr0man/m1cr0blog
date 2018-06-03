import { Inject, Injectable, PipeTransform } from '@nestjs/common'
import { User } from './entity'
import { UserService } from './service'

@Injectable()
export class UserByIdPipe implements PipeTransform {
    constructor(
        @Inject(UserService)
        private readonly userService: UserService,
    ) {
    }

    transform(userId: string): User {
        return this.userService.findOne(userId)
    }
}

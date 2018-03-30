import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, } from '@nestjs/common'
import { UserService } from './service'
import { User } from './entity'
import { CreateUserDto } from './dtos'

@Controller('/api/v1/users')
export class UserController {
    constructor(
        @Inject(UserService)
        private readonly service: UserService,
    ) {}

    @Get()
    list(): Promise<User[]> {
        return this.service.find()
    }

    @Post()
    @HttpCode(201)
    add(
        @Body() createUserDto: CreateUserDto
    ): Promise<User> {
        return this.service.create(createUserDto)
    }

    @Get(':name')
    view(
        @Param() name: string,
    ): Promise<User> {
        return this.service.findOne(name)
    }

    @Patch(':name')
    @HttpCode(201)
    patch(
        @Param() name: string,
        @Body() updateUserDto: Partial<CreateUserDto>,
    ): Promise<User> {
        return this.service.update(name, updateUserDto)
    }

    @Delete(':name')
    @HttpCode(204)
    delete(
        @Param() name: string
    ): Promise<void> {
        return this.service.delete(name)
    }
}

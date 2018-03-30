import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Response, } from '@nestjs/common'
import { UserService } from './service'
import { User } from './entity'
import { AuthUserDto, CreateUserDto } from './dtos'
import { Response as IResponse } from 'express'

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

    @Post('auth')
    @HttpCode(201)
    async auth(
        @Body() authUserDto: AuthUserDto,
        @Response() res: IResponse
    ): Promise<IResponse> {
        res.header['X-token'] = await this.service.authenticate(authUserDto)
        return res.sendStatus(204)
    }

    @Get(':name')
    view(
        // TODO check out why this returns an object
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

import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Response, } from '@nestjs/common'
import { ApiImplicitBody, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger'
import { UserService } from './service'
import { User } from './entity'
import { AuthUserDto, CreateUserDto } from './dtos'
import { Response as IResponse } from 'express'

@ApiUseTags('Users')
@Controller('/api/v1/users')
export class UserController {
    constructor(
        @Inject(UserService)
        private readonly service: UserService,
    ) {}

    @Get('manage')
    list(): User[] {
        return this.service.find()
    }

    @Post('manage')
    @ApiOperation({ title: 'Add a user' })
    @HttpCode(201)
    add(
        @Body() createUserDto: CreateUserDto
    ): Promise<User> {
        return this.service.create(createUserDto)
    }

    @Post('auth')
    @ApiOperation({ title: 'Login and authenticate' })
    @ApiResponse({ status: 204, description: 'Login successful' })
    @ApiImplicitBody({
        name: 'credentials',
        type: AuthUserDto,

    })
    async auth(
        @Body() authUserDto: AuthUserDto,
        @Response() res: IResponse
    ): Promise<IResponse> {
        res.header('X-Token',
            (await this.service.authenticate(authUserDto)).token
        )
        return res.sendStatus(204)
    }

    @Get('manage/:name')
    view(
        @Param() params: { name: string },
    ): User {
        return this.service.findOne(params.name)
    }

    @Patch('manage/:name')
    @HttpCode(201)
    patch(
        @Param() params: { name: string },
        @Body() updateUserDto: Partial<CreateUserDto>,
    ): Promise<User> {
        return this.service.update(params.name, updateUserDto)
    }

    @Delete('manage/:name')
    @HttpCode(204)
    delete(
        @Param() params: { name: string },
    ): void {
        return this.service.delete(params.name)
    }

    @Post('init')
    @HttpCode(201)
    init(): Promise<void> {
        return this.service.init()
    }
}

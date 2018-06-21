import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'


export class AuthUserDto {
    @ApiModelProperty()
    // @ts-ignore
    name?: string

    @ApiModelProperty()
        // @ts-ignore
    password?: string
}


export class CreateUserDto {
    @ApiModelProperty()
        // @ts-ignore
    name: string

    @ApiModelProperty()
        // @ts-ignore
    password: string

    @ApiModelPropertyOptional()
        // @ts-ignore
    token?: string

    @ApiModelPropertyOptional()
        // @ts-ignore
    permissions?: string[]
}

export class AuthUserDto {
    // @ts-ignore
    name: string

    // @ts-ignore
    password: string
}

export class CreateUserDto extends AuthUserDto {
    // @ts-ignore
    token?: string

    // @ts-ignore
    permissions?: string[]
}

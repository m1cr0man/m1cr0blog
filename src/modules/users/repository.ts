import { Component } from '@nestjs/common'
import * as fs from 'fs'
import { User } from './entity'
import * as path from 'path'

@Component()
export class UsersRepository<Object extends User> {
    root: string

    constructor(root: string) {
        this.root = root

        if (!fs.existsSync(root)) fs.mkdirSync(root)
    }

    protected writeData(user: Object) {
        fs.writeFileSync(this.getPath(user), JSON.stringify(user))
    }

    protected readData(name: string): Object {
        return JSON.parse(fs.readFileSync(path.join(this.root, name)).toString('utf-8'))
    }

    getPath(user: Object): string {
        return path.join(this.root, user.name)
    }

    create(user: Object): boolean {
        if (fs.existsSync(this.getPath(user))) return false

        this.writeData(user)

        return true
    }

    delete(user: Object): void {
        if (fs.existsSync(this.getPath(user))) fs.unlinkSync(this.getPath(user))
    }

    update(name: string, data: Partial<Object>) {
        const user = <Object>{...<object>this.readData(name), ...<object>data}

        this.writeData(user)
    }

    findOne(name: string): User {
        return this.readData(name)
    }

    find(): User[] {
        return fs.readdirSync(this.root).map(x => this.readData(x))
    }
}

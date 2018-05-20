import { Repository } from '../../fsrepo/repository'
import { User } from './entity'
import { join as j } from "path"
import { existsSync } from "fs"

export class UserRepository extends Repository<User> {
    tokenCache: {[index: string]: string}

    constructor() {
        super('users', User)
        this.tokenCache = {}

        this.find().map(x => this.tokenCache[x.token] = x.id)
    }

    generateId(ent: { name: string }) {
        let id;
        do {
            id = Math.random().toString(36).slice(-2)
        } while (existsSync(j(this.root, id)))
        return id
    }

    save(ent: User): boolean {
        this.tokenCache[ent.token] = ent.id
        return super.save(ent)
    }

    findOneByToken(token: string): User | false {
        const id = this.tokenCache[token]
        return id !== undefined && super.findOne(id)
    }
}

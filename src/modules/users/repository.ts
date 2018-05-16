import { Repository } from '../../fsrepo/repository'
import { User } from './entity'

export class UserRepository extends Repository<User> {
    tokenCache: {[index: string]: string}

    constructor() {
        super('users', User)
        this.tokenCache = {}

        this.find().map(x => this.tokenCache[x.token] = x.id)
    }

    // Use user name as ID
    generateId(ent: { name: string }) {
        return ent.name
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

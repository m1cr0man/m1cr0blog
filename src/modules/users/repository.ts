import { Repository } from '../../fsrepo/repository'
import { User } from './entity'


export class UserRepository extends Repository<User> {
    tokenCache: {[index: string]: string}
    nameCache: { [index: string]: string }

    constructor() {
        super('users', User, 2)
        this.tokenCache = {}
        this.nameCache = {}

        this.find().map(x => {
            this.tokenCache[x.token] = x.id
            this.nameCache[x.name] = x.id
        })
    }

    save(ent: User): boolean {
        this.tokenCache[ent.token] = ent.id
        this.nameCache[ent.name] = ent.id
        return super.save(ent)
    }

    merge(ent: User, newEnt: Partial<User>) {
        delete this.tokenCache[ent.token]
        delete this.nameCache[ent.name]
        return super.merge(ent, newEnt)
    }

    delete(ent: User) {
        delete this.tokenCache[ent.token]
        delete this.nameCache[ent.name]
        return super.delete(ent)
    }

    findOneByToken(token: string): User | false {
        const id = this.tokenCache[token]
        return id !== undefined && super.findOne(id)
    }

    findOneByName(name: string): User | false {
        const id = this.nameCache[name]
        return id !== undefined && super.findOne(id)
    }
}

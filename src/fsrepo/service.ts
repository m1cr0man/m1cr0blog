import { BaseEntity } from './entity'
import { Repository } from './repository'

export abstract class BaseService<Entity extends BaseEntity> {
    readonly abstract repo: Repository<Entity>

    find(): Entity[] {
        return this.repo.find()
    }

    findOne(id: Entity['id']): Entity {
        return this.repo.findOne(id)
    }

    abstract create(...any: any[]): Entity | Promise<Entity>

    update(id: Entity['id'], newEnt: Partial<Entity>): Entity | Promise<Entity> {
        const ent = this.findOne(id)

        const updatedEnt = this.repo.merge(ent, newEnt)
        this.repo.save(updatedEnt)
        return updatedEnt
    }

    delete(id: Entity['id']): void {
        if (this.repo.exists(id)) {
            this.repo.delete(this.repo.findOne(id))
        }
    }
}

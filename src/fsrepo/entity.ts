import 'reflect-metadata'

const serializeMetaKey = Symbol('serialize')
const hiddenMetaKey = Symbol('hidden')

export type JSONData<T> = {
    [P in keyof T]: T[P]
}

export abstract class BaseEntity {
    abstract id: string

    constructor() {}

    toSerializableObject(showHidden: boolean = false): JSONData<this> {
        const target = Object.getPrototypeOf(this).constructor
        const params = Reflect.getMetadata(serializeMetaKey, target)
        return (params || [])
            .filter(
                key => showHidden || !Reflect.getMetadata(hiddenMetaKey, target, key)
            ).reduce(
                (map, key) => { map[key] = this[key]; return map }, {}
            )
    }

    static fromSerializableObject(data: any): any {}

    // TODO change toSerializeObject to toJSON
    toJSON(showHidden: boolean | string = false): JSONData<this> {
        if (typeof showHidden != 'boolean') showHidden = false
        return this.toSerializableObject(showHidden)
    }

    static Serialize(key: string) {
        return (target: typeof BaseEntity, ..._: any[]) => {
            const serializedProps: string[] = Reflect.getMetadata(serializeMetaKey, target) || []
            serializedProps.push(key)
            return Reflect.defineMetadata(serializeMetaKey, serializedProps, target)
        }
    }

    static Hide(key: string) {
        return (target: typeof BaseEntity, ..._: any[]) =>
            Reflect.defineMetadata(hiddenMetaKey, true, target, key)
    }
}

import { User } from './modules/users/entity'

declare module 'express' {
    interface Request {
        user?: User
    }
}

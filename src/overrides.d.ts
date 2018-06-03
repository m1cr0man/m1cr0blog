import { User } from './modules/users'

declare module 'express' {
    interface Request {
        user?: User
    }
}

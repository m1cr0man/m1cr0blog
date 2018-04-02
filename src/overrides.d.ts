import { User } from './modules/users/entity'

declare module 'express' {
    // Add user to the request object
    interface Request {
        session: {
            user: User
        }
    }
}

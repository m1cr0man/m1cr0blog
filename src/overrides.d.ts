import { User } from './modules/users/entity'

declare module 'express' {
    // Add user to the request object
    interface session {
        user: User
    }

    interface Request {
        session: session
    }
}

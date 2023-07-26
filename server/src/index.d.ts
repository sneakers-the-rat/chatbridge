declare global {
    namespace Express {
        interface Session {
            logged_in?: boolean
        }
    }
}
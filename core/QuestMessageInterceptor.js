
export const INTERCEPTOR_HIGH_PRIORITY = 100
export const INTERCEPTOR_MEDIUM_PRIORITY = 50
export const INTERCEPTOR_LOW_PRIORITY = 10

class MessageInterceptor {
    constructor(client, priority) {
        this.client = client
        this.priority = priority
    }
}

export default MessageInterceptor
class ServerCommand {

    constructor(client, name, description, options){
        this.client = client
        this.name = name
        this.description = description
        this.options = options
    }
}

export default ServerCommand
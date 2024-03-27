import Server from './Server.js';

class EnglishBackendApp {
    server; // obtaining the server from the Server class as a property

    // It will have two asynchronous methods, one for starting and another for stopping
    async start() {
        const port = process.env.PORT ?? '3000';
        this.server = new Server(port);
        return await this.server.listen();
    }

    async stop() {
        return await this.server?.stop();
    }
}

export default EnglishBackendApp;

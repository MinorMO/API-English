import express from 'express';
import http from 'http';
import router from '../src/routes/verbsRoutes.js';
import cors from 'cors';
// import { authorizationMiddleware } from './middlewares/FirebaseAuth';

class Server {
    constructor(port) {
        this._port = port;
        this._app = express();
        this._app.use(cors());
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: false }));
        // this._app.use(authorizationMiddleware);
        this._app.use(router);
    }

    async listen() {
        return await new Promise(resolve => {
            this._httpServer = this._app.listen(this._port, () => {
                console.log(`Server running on port ${this._port}`);
                console.log('Press CTRL-C to stop\n');
                console.log(`http://localhost:${this._port}`);
                resolve();
            });
        });
    }

    async stop() {
        return await new Promise((resolve, reject) => {
            if (this._httpServer != null) {
                this._httpServer.close(error => {
                    if (error != null) {
                        reject(error);
                    }
                    resolve();
                });
            }
            resolve();
        });
    }
}

export default Server;

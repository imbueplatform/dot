import pump from 'pump';
import { Cell } from '@imbueplatform/dot-cell';

let debug = require('debug')('imbue:dot:network')

export const DEFAULT_PORT = 3282;

export const createNetwork = async (atom: any, options: any = { port: DEFAULT_PORT, lookup: false, announce: false, stream: undefined }): Promise<Cell> => {

    let cell: Cell = new Cell();

    return new Promise<any>(async (resolve, reject) => {

        debug('createNetwork', atom, options);

        await cell.listen(options.port);
        cell.once("error", (err: any) => {
            if (err) debug("ERROR:", err.stack)
            cell.listen(0);
        });
        cell.on('connection', (socket: any, info: any) => {
            debug('on.connectionnnnnnnnnnnnnnn');
            /*
            pump(socket, options.stream(info), socket, function (err) {
                if (err) return reject(err);
            });
            */
        });
        cell.join(atom.discoveryKey, {
            lookup: true,
            announce: options.announce
        }, undefined);

        return resolve(cell);

    });
}
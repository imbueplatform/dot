
import { Cell, CellPeer } from '@imbueplatform/cell';
import { createNetwork } from './network'
import { DotConfig } from './common/types'
import fs from 'fs';
import Debug from 'debug';

const debug = Debug("imbue:dot");

const noop = () => {}



export class Dot {

    private _network: Cell | undefined = undefined;
    private _atom: any | undefined = undefined;
    private _synced: Boolean = false;

    constructor(atom: any) {
        this._atom = atom;
    }

    public async join(options?: DotConfig): Promise<Cell> {

        let networkOptions: any = Object.assign({}, {
            stream: this._createStream,
            announce: options?.announce || false,
            lookup: options?.lookup || false,
            port: options?.port || 3284
        }, options)

        this._network = await createNetwork(this._atom, networkOptions);
        return this._network;
    }

    get key(): string {
        return this._atom.discoveryKey
    }

    public async leave(): Promise<any> {
        if(!this._network)
            return Promise.resolve();

        this._network.leave(this._atom.discoveryKey, () => {

        });
        
        this._network.destroy(noop)

        delete this._network;

        return Promise.resolve();
    }

    public async close(): Promise<any> {
        return this._closeNetwork();
    }

    public async pause(): Promise<void> {
        await this.leave();
    }

    public async resume(): Promise<void> {
        this._network?.join(this._atom.discoveryKey);
    }

    private async _closeNetwork(): Promise<void> {
        if(this._network) 
            return this.leave()
    }

    private _createStream(peer: CellPeer): any {
        let _this: Dot = this;

        fs.writeFileSync('file.txt', "hello");

        let _stream = fs.createReadStream('file.txt');

        _stream.on('close', function () {
            debug('stream close')
        });
        _stream.on('error', function (err) {
            debug('replication error:', err.message)
        });
        _stream.on('end', () => {
            _this._synced = true;
            debug('stream ended');
        });
        return _stream;
    }
}
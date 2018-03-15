import {Promise} from 'es6-promise';

export abstract class NumberLoader {
    abstract loadPart(partNumber: number): Promise<any>;
    constructor(){}
}


export abstract class RemoteFileLoader extends NumberLoader{

    protected namePattern: string;
    protected directoryPath: string;
    protected remoteHost: string;

    loadPart(partNumber: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let client = new XMLHttpRequest();
            client.open('GET', this.getRemotePath(partNumber));
            client.onload = () => {
                if(this.isErroneous(client.responseText)){
                    reject(`Endpoint returned invalid data: ${client.responseText}`)
                } else {
                    resolve(client.responseText);
                }
            };
            client.onerror = function () {
                reject(`error while waiting for part #${partNumber}`)
            };
            client.send();
        })
    }

    abstract getRemotePath(partNumber:number):string;
    abstract isErroneous(content:string): boolean;

    constructor(){
        super();
    }
}

export class NasaSqrtFileLoader extends RemoteFileLoader {

    isErroneous(content: string): boolean {
        return content.indexOf('ERROR') !== -1;
    }

    constructor(){
        super();
        this.namePattern = 'part${number}.txt';
        this.directoryPath = 'parts';
        this.remoteHost = '';
    }


    getRemotePath(partNumber: number): string {
        return this.remoteHost + this.directoryPath + '/' + this.namePattern.replace('${number}', partNumber + '');
    }
}
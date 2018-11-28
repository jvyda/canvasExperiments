import {Promise} from 'es6-promise';

export class WordLoader {

    private directory: string = 'res';
    private folder : string;


    constructor(folder: string) {
        this.folder = folder;
    }

    loadPart(partNumber: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let client = new XMLHttpRequest();
            client.open('GET', this.getFileName(partNumber));
            client.onload = () => {
                resolve(client.responseText.toLowerCase());
            };
            client.onerror = function () {
                reject(`error while waiting for part #${partNumber}`)
            };
            client.send();
        })
    }

    getFileName(part: number){
        return this.directory + '/' + this.folder + '/parts/' + `part${part}.txt`;
    }
}
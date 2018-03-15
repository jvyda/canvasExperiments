import {Utils} from "./Utils";

export interface FileParser {
    parseFileContents(fileContent: string): Array<number>;
}

export class NasaFileParser implements FileParser {
    parseFileContents(fileContent: string): Array<number> {
        return fileContent.replace('.', '').split('').map(Utils.digitToNumber);
    }
}
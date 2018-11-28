export class Config {
    public folderName: string;

    protected constructor() {
        this.reconfigureConfig();
    }

    private static instance: Config;

    public static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    private reconfigureConfig() {
        this.folderName = 'eng';
    }
}
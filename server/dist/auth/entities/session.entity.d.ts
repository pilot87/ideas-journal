export declare class Session {
    static add(sessionID: string, username: string): Promise<any>;
    static duration(sessionID: string): Promise<any>;
    static active(sessionID: string): Promise<void>;
}

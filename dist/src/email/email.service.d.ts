export declare class EmailService {
    private readonly logger;
    private readonly resend;
    private readonly from;
    constructor();
    sendPasswordResetEmail(to: string, resetUrl: string): Promise<void>;
}

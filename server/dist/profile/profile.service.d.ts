import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-passwd.dto';
export declare class ProfileService {
    chemail(changeEmailDto: ChangeEmailDto, username: string, session: string): Promise<{
        message: string;
    }>;
    chpasswd(changePasswordDto: ChangePasswordDto, username: string): Promise<{
        message: string;
    }>;
}

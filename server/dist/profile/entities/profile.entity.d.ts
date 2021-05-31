import { ChangeEmailDto } from '../dto/change-email.dto';
import { ChangePasswordDto } from '../dto/change-passwd.dto';
export declare class Profile {
    static chemail(changeEmailDto: ChangeEmailDto, username: string): Promise<void>;
    static chpasswd(password: ChangePasswordDto, username: string): Promise<void>;
}

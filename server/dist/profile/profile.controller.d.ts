import { ProfileService } from './profile.service';
import { ChangeEmailDto } from './dto/change-email.dto';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-passwd.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    chemail(changeEmailDto: ChangeEmailDto, req: Request): Promise<{
        message: string;
    }>;
    chpasswd(changePasswordDto: ChangePasswordDto, req: Request): Promise<{
        message: string;
    }>;
}

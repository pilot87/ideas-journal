import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    register(createAuthDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        token: any;
        username: any;
        email: any;
    }>;
}

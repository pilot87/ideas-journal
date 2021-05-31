import { CreateUserDto } from '../dto/create-user.dto';
export declare class User {
    static add(createUserDto: CreateUserDto): Promise<any>;
    static findOneByName(name: string): Promise<any>;
}

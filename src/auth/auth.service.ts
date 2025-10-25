import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    constructor(private readonly userSerivce: UserService) {
        this.userSerivce = userSerivce;
    }

    async register(registerDto: RegisterDto) {
        const user = await this.userSerivce.getUserByEmail(registerDto.email);
        return { message: "User registered successfully", user };
    }
}

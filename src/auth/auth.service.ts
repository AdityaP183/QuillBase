import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    constructor(private readonly userSerivce: UserService) {
        this.userSerivce = userSerivce;
    }

    register(registerDto: RegisterDto) {
        const user = this.userSerivce.getUserByEmail(registerDto.email);
        const dbUrl = process.env.DATABASE_URL || "No database url found";
        return { message: "User registered successfully", user, dbUrl };
    }
}

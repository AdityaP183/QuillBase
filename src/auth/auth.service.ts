import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "src/user/user.service";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userSerivce: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const user = await this.userSerivce.getUserByEmail(registerDto.email);
        if (user) {
            throw new ConflictException("User with that email already exists");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            saltRounds,
        );

        const newUser = await this.userSerivce.createUser({
            ...registerDto,
            password: hashedPassword,
        });

        this.logger.log(`User created: ${newUser.email}`);

        const payload = { sub: newUser.id, username: newUser.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}

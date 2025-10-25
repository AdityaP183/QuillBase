import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
        this.authService = authService;
    }

    @Post("register")
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post("login")
    login(@Body() registerDto: LoginDto) {
        return this.authService.login(registerDto);
    }
}

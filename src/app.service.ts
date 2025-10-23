import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    statusCheck() {
        return {
            status: "OK",
            message: "API is up and running",
        };
    }
}

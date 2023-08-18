import { Module } from "@nestjs/common";
import { UserCoreController } from "./user.core.controller";
import { UserService } from "../../services/user.service";
import { JwtService } from "../../services/jwt.service";
import { MailService } from "../../services/mail.service";
import { CheckoutService } from "../../services/checkout.service";
import { ProductService } from "../../services/product.service";

@Module({
    controllers: [UserCoreController],
    providers: [UserService,JwtService, MailService, CheckoutService, ProductService],
})

export class UserCoreModule {

}
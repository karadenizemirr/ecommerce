import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { secureSession } from 'fastify-secure-session';
import { JwtService } from "../services/jwt.service";

@Injectable()
export class NavbarInterceptor {
  constructor(private jwtService: JwtService) {
  }
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>{

    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const session = request.session as secureSession

    let isAdminNavbar:boolean = false
    let userLogin = false

    if (session.get('token')){
      const verify_token = this.jwtService.verifyToken(session.get('token')['token'])

      if (verify_token.role === 'admin'){
        isAdminNavbar = true
      }else if (verify_token.role === 'user'){
        userLogin = true
      }else{
        userLogin = false
        isAdminNavbar = false
      }
    }

    response.locals.isAdminNavbar = isAdminNavbar
    response.locals.userLogin = userLogin


    let isUserLoggedIn = false
    return next.handle()
  }
}
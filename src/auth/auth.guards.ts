import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { JwtService } from "../services/jwt.service";

@Injectable()
export class AuthGuard implements  CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const roles = this.reflector.get<string>('auth', context.getHandler())
    const token = request.session['token']

    if (token){
      const verify_token = this.jwtService.verifyToken(token)

      if (verify_token.role == 'user' && roles === 'user'){
        // User Operations
        return true
      }else if (verify_token.role == 'admin' && roles === 'admin') {
        // Admin Operations
        return true
      }else {
        response.redirect('/user/login')
        return false
      }
    }
    return false

  }
}
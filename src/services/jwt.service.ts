import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtService {
  constructor() {
  }

  private readonly  secretKey = "iqtest"

  generateToken(data:any):string {
    return jwt.sign(data, this.secretKey)
  }

  verifyToken(token:string):any {
    return jwt.verify(token, this.secretKey)
  }
}
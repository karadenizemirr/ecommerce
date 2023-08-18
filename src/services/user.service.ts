import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppDataSource } from "./mysql.service";
import { User } from "../models/user.model";
import * as bcrypt from 'bcrypt'
import { JwtService } from "./jwt.service";
import { MailService } from "./mail.service";
@Injectable()
export class UserService {
  private userRepository:any;

  constructor(private jwtService: JwtService, private mailService: MailService) {
    this.userRepository = AppDataSource.getRepository(User)
  }


  // Register
  async register(data:any){
    try{

      const control = await this.userRepository.findOne(
        {
          where: {
            email: data.email
          }
        }
      )

      if (!control){
        // Password Hash
        try{
          data.password = await bcrypt.hash(data.password, 5)
        }catch (err){
          throw new HttpException('Password hash error', HttpStatus.BAD_REQUEST)
        }

        const user = new User()
        user.name = data.name
        user.surname = data.surname
        user.email = data.email
        user.password = data.password
        user.address = data.address
        user.city = data.city
        user.district = data.district
        user.phone = data.phone_number
        user.identify_number = data.identify_number
        const user_data = await this.userRepository.save(user)
        // Create Email
        //const token = this.jwtService.generateToken({id: user.id})
        //this.mailService.sendEmail(user.email, 'Confirm Email', `http://localhost:3000/confirm/${token}`)
        return user_data
      }else{
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
      }
    }catch(err){
      console.log(err)
      throw new HttpException('Register error', HttpStatus.BAD_REQUEST)
    }

  }

  async confirm(token:string){
    try{
      const verify_token = this.jwtService.verifyToken(token)
      const user = await this.userRepository.findOne({id: verify_token.id})

      if (user){
        user.confirm = true
        await this.userRepository.save(user)
        return true
      }

      return false
    }catch(err){
      throw new HttpException('Confirm error', HttpStatus.BAD_REQUEST)
    }
  }

  async login(username:string, password:string){
    try{
      const user = await this.userRepository.findOne(
        {
          where: {
            email: username
          }
        }
      )

      if (user){
        const verify = await bcrypt.compare(password, user.password)
        if (verify){
          const token = this.jwtService.generateToken({id: user.id, role:user.role})
          return token
        }else{
          throw new HttpException('Password is wrong', HttpStatus.BAD_REQUEST)
        }
      }else{
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
      }
    }catch(err){
      throw new HttpException('Login error', HttpStatus.BAD_REQUEST)
    }
  }

  async get_user(id:string){
    try{
      const user = await this.userRepository.findOne(
        {
          where: {
            id: id
          }
        }
      )
      if (user){
        return user
      }else{
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
      }
    }catch(err){
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    }
  }

  async update_user(data:any){
    try{

      const user = await this.userRepository.findOne(
        {
          where: {
            id: data.id
          }
        }
      )
      if (user){
        user.name = data.name || user.name
        user.surname = data.surname || user.surname
        user.address = data.address || user.address
        user.city = data.city || user.city
        user.district = data.district || user.district
        user.phone = data.phone_number || user.phone
        user.identify_number = data.identify_number || user.identify_number
        await this.userRepository.save(user)
        return user
      }else{
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
      }

    }catch(err){
      throw new HttpException('Update error', HttpStatus.BAD_REQUEST)
    }
  }

}
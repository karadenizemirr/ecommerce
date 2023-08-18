import { Body, Controller, Get, Param, Post, Render, Req, Res, Session } from "@nestjs/common";
import { UserService } from "../../services/user.service";
import { Response ,Request} from "express";
import * as secureSession from '@fastify/secure-session'
import { JwtService } from "../../services/jwt.service";
import { CheckoutService } from "../../services/checkout.service";
@Controller('user')
export class UserCoreController {
  constructor(private userSerivce: UserService, private jwtService: JwtService, private checkoutService:CheckoutService) {
  }

  @Get()
  @Render('home/profile')
  async get_user_profile(@Session() session:secureSession.Session){
    const token = session?.get('token') || null

    if (token && token['token']){
      const user = await this.jwtService.verifyToken(token['token'])
      const user_data = await this.userSerivce.get_user(user['id'])
      return {
        title: 'Profil',
        user: user_data
      }
    }

    return {
      title: 'Profil',
      user: null
    }
  }

  // User Update
  @Post()
  async post_user_update(@Body() body:any){
    const update = await this.userSerivce.update_user(body)
    return update
  }


  @Get('register')
  @Render('home/register')
  async get_register(){
    return {
      title: 'Kayıt Ol'
    }
  }

  @Post('register')
  async post_register(@Body() body:any){
    await this.userSerivce.register(body)
    return {
      title: 'Kayıt Ol'
    }
  }

  @Post('login')
  async post_login(
    @Body() body:any,
    @Res() res:Response,
    @Req() req:Request,
    @Session() session: secureSession.Session

  ){
    const token = await this.userSerivce.login(body.email, body.password)
    if (token){
      // Create Login Sessin
      session.set('token', {token: token})

      res.redirect(302,'/')
    }
    return token
  }


  // Checkout Operations
  @Post('checkout')
  async post_checkout(@Body() body:any, @Session() session:secureSession.Session){
    const token = session?.get('token') || null

    let send_data = null

    if (token && token['token']){
      const user = await this.jwtService.verifyToken(token['token'])
      const user_data = await this.userSerivce.get_user(user['id'])
      const json_data = Object.keys(body).map(key => {
        return JSON.parse(key);
      });

      send_data = {
        user: user_data,
        product: JSON.parse(json_data[0].product_data)
      }
    }else{
      // Guest Checkout
      const json_data = Object.keys(body).map(key => {
        return JSON.parse(key);
      });

      send_data = {
        user:{
          name: json_data[0].form_data.name,
          surname: json_data[0].form_data.surname,
          email: json_data[0].form_data.email,
          phone_number: json_data[0].form_data.phone_number,
          address: json_data[0].form_data.address,
          city: json_data[0].form_data.city,
          country: json_data[0].form_data.country || 'Türkiye',
          district: json_data[0].form_data.district,
          identify_number: json_data[0].form_data.identify_number,
          role: 'guest'
        },
        product: JSON.parse(json_data[0].product_data)
      }
    }

    const payment_form = await this.checkoutService.create_payment_form(send_data)
    return payment_form
  }

  // My Orders
  @Get('orders')
  @Render('home/user/orders')
  async get_user_orders(@Session() session: secureSession.Session){

    const token = session?.get('token') || null
    if (token && token['token']){
      const user = await this.jwtService.verifyToken(token['token'])
      const user_data = await this.userSerivce.get_user(user['id'])
      const orders = await this.checkoutService.get_user_orders(user_data['id'])

      return {
        title: 'Siparişlerim',
        orders: orders
      }
    }

    return {
      title: 'Siparişlerim'
    }
  }
}
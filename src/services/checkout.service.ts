import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../models/user.model";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt'
import { ProductService } from "./product.service";
import { Checkout } from "../models/checkout.mode";
import { AppDataSource } from "./mysql.service";

@Injectable()
export class CheckoutService {
  private checkoutRepository:any
  constructor(private userService: UserService, private productService: ProductService) {
    this.checkoutRepository = AppDataSource.getRepository(Checkout)
  }


  async create_payment_form(data:any){
    try{

      console.log(data)
      let user_data = null

      if (data.user.role === 'guest'){
        // Guest -> Create User
        const password = await bcrypt.hash(data.user.identify_number, 5)
        data.user.password = password
        user_data = await this.userService.register(data.user)

      }else if (data.user.role === 'user') {
        user_data = data.user
      }

      // Create Checkout
      const _checkout_product = []
      let _total_price = 0

      for (let product of data.product){
        const product_detail = await this.productService.get_product_by_name(product.name)
        _checkout_product.push(product_detail)
        _total_price += product.price * product.quantity
      }

      const checkout = new Checkout()
      checkout.user = user_data
      checkout.products = _checkout_product
      checkout.total_price = _total_price.toString()
      const checkout_save = this.checkoutRepository.save(checkout)


    }catch(err){
      throw new HttpException('Payment error', HttpStatus.BAD_REQUEST)
    }
  }

  async get_user_orders(id:string){
    try{
      const data = await this.checkoutRepository.find(
        {
          relations: {
            user:true,
            products: true
          },
          where: {
            user: {
              id: id
            }
          }
        }
      )

      return data
    }catch(err){
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND)
    }
  }

  async get_all_orders(){
    try{

      const data = await this.checkoutRepository.find(
        {
          relations: {
            user:true,
            products: true
          },
          order: {
            created_at: 'DESC'
          }
        }
      )

      return data

    }catch (err){
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND)
    }
  }

  async delete_order(id:number){
    try{
      const data = await this.checkoutRepository.findOne(id)
      await this.checkoutRepository.remove(data)
      return true
    }catch(err){
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND)
    }
  }

  async update_order(id:number, data:any){
    try{
      const order = await this.checkoutRepository.findOne(
        {
          where: {
            id: id
          }
        }
      )

      if (order){
        await this.checkoutRepository.update(id, data)
      }
      return true
    }catch(err){
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND)
    }
  }


}
import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./user.model";
import { Product } from "./product.model";

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  total_price: string

  @Column({default: false})
  is_paid: boolean

  @Column({default: 'null'})
  tracking_code:string

  @Column({default: 'onaylanmadı'})
  status: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Product, (product) => product.checkout)
  products: Product[]

  @OneToOne(() => User, (user) => user.checkout)
  @JoinColumn()
  user: User

}
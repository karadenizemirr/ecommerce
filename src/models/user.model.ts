import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import  {v4 as uuid4} from 'uuid'
import { Checkout } from "./checkout.mode";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id:string = uuid4()

  @Column()
  name:string

  @Column()
  surname:string

  @Column()
  email:string

  @Column()
  password:string

  @Column()
  address:string

  @Column()
  city:string

  @Column()
  district:string

  @Column()
  phone:string

  @Column()
  identify_number:string

  @Column({default: 'user'})
  role:string

  @Column({default: false})
  confirm:boolean

  @CreateDateColumn()
  created_at:Date = new Date()

  @UpdateDateColumn()
  updated_at:Date = new Date()

  @OneToOne(() => Checkout, (checkout) => checkout.user)
  checkout: Checkout



}
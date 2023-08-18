import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  phone_number: string;

  @Column()
  address: string

  @Column()
  email: string;

}
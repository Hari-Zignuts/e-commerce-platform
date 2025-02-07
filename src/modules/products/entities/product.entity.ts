import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/modules/categories/category.entity';
import { Stock } from './stock.entity';
import { Order } from 'src/modules/orders/order.entity';
import { LikeProduct } from 'src/modules/likes/like.entity';
import { Image } from './image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToOne(() => Stock, (stock) => stock.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  stock: Stock;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];

  @OneToMany(() => LikeProduct, (like) => like.product)
  likes: LikeProduct[];

  @OneToMany(() => Image, (image) => image.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images: Image[];
}

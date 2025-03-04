import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @OneToOne(() => Product, (product) => product.stock, { onDelete: 'CASCADE' })
  product: Product;
}

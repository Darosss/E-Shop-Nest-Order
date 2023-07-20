import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public price!: number;

  /*
   * Relation IDs
   */

  @Column({ type: 'integer', array: true })
  public productsIds!: number[];

  @Column({ type: 'integer' })
  public userId!: number;

  //TODO: make an enum?
  @Column({ type: 'varchar', default: 'pending' })
  public status!: string;

  //TODO: make an enum?
  @Column({ type: 'varchar' })
  public shippingAddres!: string;

  //TODO: make an enum?
  @Column({ type: 'varchar' })
  public paymentMethod!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

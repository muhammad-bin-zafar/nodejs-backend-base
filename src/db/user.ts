import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize'
import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

type attr = InferAttributes<User>
type crAttr = InferCreationAttributes<User>

@Table
export default class User extends Model<attr, crAttr> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: CreationOptional<string>

	mobile!: string
	firstName!: string
	lastName!: CreationOptional<string>
	email!: string
	password!: string
}

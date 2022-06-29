import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize'
import { AllowNull, AutoIncrement, Column, DataType, Default, DefaultScope, Model, PrimaryKey, Scopes, Table } from 'sequelize-typescript'

type attr = InferAttributes<user>
type crAttr = InferCreationAttributes<user>

@DefaultScope(()=>({
	attributes: {exclude: ['password']}
}))
@Scopes(()=>({
	'attr:cred': {
		attributes: {include:['password']}
	}
}))
@Table
export default class user extends Model<attr, crAttr> {
	@AllowNull(false)
	@PrimaryKey
	@Default(DataType.UUIDV4)
	@Column(DataType.UUIDV4)
	id!: CreationOptional<string>

	@Column
	mobile?: string

	@Column
	firstName!: string

	@Column(DataType.TEXT)
	lastName!: CreationOptional<string>

	@Column
	email!: string

	@Column
	password!: string
}

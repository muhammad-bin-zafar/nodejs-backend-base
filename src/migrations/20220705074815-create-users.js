'use strict'

module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4(),
			},
			mobile: Sequelize.STRING,
			firstName: Sequelize.STRING,
			lastName: Sequelize.STRING,
			email: Sequelize.STRING,
			password: Sequelize.STRING,
			createdAt: Sequelize.DATE,
			updatedAt: Sequelize.DATE,
			deletedAt: Sequelize.DATE,
		})
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.dropTable('users')
	},
}

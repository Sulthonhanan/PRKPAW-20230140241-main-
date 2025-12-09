await queryInterface.createTable('Presensis', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  checkIn: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  checkOut: {
    type: Sequelize.DATE,
    allowNull: true
  },
  latitude: {
    type: Sequelize.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: Sequelize.DECIMAL(11, 8),
    allowNull: true
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});

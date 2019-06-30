module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // Qual tabela quero adicionar a coluna
      'avatar_id', // Qual o nome da coluna
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' }, // Qual tabela dentro de model que quero referenciar e qual campo desta tabela
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};

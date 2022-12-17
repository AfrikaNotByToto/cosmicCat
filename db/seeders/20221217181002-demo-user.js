/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: "John Doe",
          score: 53,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Doe",
          score: 70,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Vladimir",
          score: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ann",
          score: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};

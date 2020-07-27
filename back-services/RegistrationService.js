function RegisterationService(usersRepository) {
  async function getUsers() {
    return await usersRepository.findAll();
  }

  async function addUser(userData) {
    return usersRepository.addUser(userData);
  }

  async function findByNameSurnameDateOfBirth(name, surname, dateOfBirth) {
    return usersRepository.findByNameSurnameDateOfBirth(
      name,
      surname,
      dateOfBirth
    );
  }

  async function getVerifiedUsers() {
    return new Promise((resolv, rej) => {
      let verifiedEmailUsers = [];
      usersRepository.findAll().then((users) => {
        users.forEach((user) => {
          if (user.verified) {
            verifiedEmailUsers.push(user);
          }
        });
        resolv(verifiedEmailUsers);
      });
    });
  }

  return {
    getUsers,
    addUser,
    findByNameSurnameDateOfBirth,
    getVerifiedUsers
  };
}

module.exports = { RegisterationService };

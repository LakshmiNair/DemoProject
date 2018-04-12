// DOMAIN LAYER
// Has the userRepository as a dependency. The UserService does not know
// nor does it care where the user models came from. This is abstracted away
// by the implementation of the repositories. It just calls the needed repositories
// gets the results and usually applies some business logic on them.

function create(userRepository) {
    async function getAllUsers() {
        const users = await userRepository.getAll();
        return users;
    }

    async function validateUser(user) {
        console.log("service");
        return (await userRepository.validateUser(user));
    }

    async function createUser(user) {
        // TODO: catch possible errors here and rethrow a custom error you defined instead
        const result = await userRepository.add(user);        
        return result;
    }
    async function resetPassword(user) {
        return (await userRepository.resetPassword(user));
    }
    async function generateActivationCode(user) {
        return (await userRepository.generateActivationCode(user));
    }
    async function updateUser(user) {
        return (await userRepository.update(user));
    }

    return {
        createUser,
        validateUser,
        getAllUsers,
        generateActivationCode,
        resetPassword,
        updateUser,
    };
}

module.exports.create = create;

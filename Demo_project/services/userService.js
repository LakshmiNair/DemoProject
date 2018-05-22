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
    async function verifyUser(user) {
        const users = await userRepository.verifyUser(user);
        return users;
    }
    async function getUser(token) {
        const user = await userRepository.getUser(token);
        return user;
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
    async function updateUser(token,user) {
        return (await userRepository.update(token,user));
    }

    return {
        createUser,
        verifyUser,
        validateUser,
        getAllUsers,
        getUser,
        generateActivationCode,
        resetPassword,
        updateUser,
    };
}

module.exports.create = create;

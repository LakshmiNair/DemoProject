// DOMAIN LAYER
// Has the userRepository as a dependency. The UserService does not know
// nor does it care where the user models came from. This is abstracted away
// by the implementation of the repositories. It just calls the needed repositories
// gets the results and usually applies some business logic on them.

function create(collectionRepository) {
    async function getCollection(token) {
        const collections = await collectionRepository.get(token);
        return collections;
    }

    async function uploadFile(file,body) {
        const dataset = await collectionRepository.uploadFile(file,body);
        return dataset;
    }
    
    return {
        getCollection,
        uploadFile,
    };
}

module.exports.create = create;
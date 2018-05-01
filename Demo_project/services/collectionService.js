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
    async function getfiles(body,token) {
        const dataset = await collectionRepository.getfiles(body,token);
        return dataset;
    }
    async function uploadFile(file,body,token) {
        const dataset = await collectionRepository.uploadFile(file,body,token);
        return dataset;
    }
    async function newFolder(file,token) {
        const collection = await collectionRepository.newFolder(file,token);
        return collection;
    }
    async function renameFolder(file,token) {
        const collection = await collectionRepository.renameFolder(file,token);
        return collection;
    }
    async function removeFolder(file,token) {
        const collection = await collectionRepository.removeFolder(file,token);
        return collection;
    }
    async function removeFile(file,token) {
        const dataset = await collectionRepository.removeFile(file,token);
        return dataset;
    }
    async function renameFile(file,token) {
        const dataset = await collectionRepository.renameFile(file,token);
        return dataset;
    }
    async function removemultipleFiles(file,token) {
        const dataset = await collectionRepository.removemultipleFiles(file,token);
        return dataset;
    }
    return {
        getCollection,
        getfiles,
        uploadFile,
        newFolder,
        renameFolder,
        removeFolder,
        removeFile,
        renameFile,
        removemultipleFiles,
    };
}

module.exports.create = create;

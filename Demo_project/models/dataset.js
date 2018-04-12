class Dataset {


    constructor(id, collectionId, datasetId, name, createdTime, metadata, extension, state, size,deleted) {
        this.id = id;
        this.collectionId = collectionId;
        this.datasetId = datasetId;
        this.name = name;
        this.createdTime = createdTime;
        this.metadata = metadata;
        this.extension = extension;
        this.state = state;
        this.size = size;
        this.deleted = deleted;

    }
}

module.exports = Dataset;
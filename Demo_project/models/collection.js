class Collection {


    constructor(id, name, createTime, updateTime, userId, state, deleted, size) {
        this.id = id;
        this.name = name;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.userId = userId;
        this.state = state;
        this.deleted = deleted;
        this.size = size;
        
    }
}

module.exports = Collection;
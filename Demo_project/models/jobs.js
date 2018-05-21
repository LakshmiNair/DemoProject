class Jobs {


    constructor(id, createTime, updateTime, userId, collectionId, workflowId, commandLine, info, dependencies, jobState, stderr, exitCode) {
        this.id = id;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.userId = userId;
        this.collectionId = collectionId;
        this.workflowId = workflowId;
        this.commandLine = commandLine;
        this.info = info;
        this.dependencies = dependencies;
        this.jobState = jobState;
        this.stderr = stderr;
        this.exitCode = exitCode;
       
    }
}

module.exports = Jobs;
/**
 * Created by priit on 1.06.15.
 */
function Session( id ){
    this.isAsync = false;
    this.isFinished = false;
    this.id = id;
    this.success = false;
    this.message = Session.messages.NOT_FOUND;
    this.storageType = Session.storageTypes.MEMORY;
    this.data = null;
    this.outputPath = null;
    this.contentType = null;
}

Session.messages = {
    RUNNING: 'RUNNING',
    OK: 'OK',
    ERROR: 'ERROR',
    NOT_FOUND: "NOT_FOUND"
};

Session.storageTypes = {
    MEMORY: 'MEMORY',
    FILE: 'FILE'
};

module.exports = Session;
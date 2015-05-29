/**
 * Created by priit on 28.05.15.
 */

function ServiceResponse( serviceId ){

    this.messages = {
        OK: "OK",
        ERROR: "ERROR",
        NOT_FOUND: "NOT_FOUND"
    };

    this.serviceId = serviceId;
    this.success = true;
    this.message = this.messages.OK;
    this.recheckInterval = 5;
    this.data = null;
    this.contentType = 'text';
};

ServiceResponse.prototype.getApiResponse = function(){

    var response = {};

    if(this.serviceId){
        response.serviceId = this.serviceId;
    }

    response.success = this.success;
    response.message = this.message;
    response.recheckInterval = this.recheckInterval;

    if(this.data){
        response.data = this.data;
        response.contentType = this.contentType;
    }

    return {response: response};
};

module.exports = ServiceResponse;
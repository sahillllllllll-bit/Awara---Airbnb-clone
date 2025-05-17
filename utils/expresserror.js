class expresserror extends Error {
    constructor(statuscode,message){
        super();
        this.sattuscode=statuscode;
        this.message = message;
    }
}

module.exports= expresserror;
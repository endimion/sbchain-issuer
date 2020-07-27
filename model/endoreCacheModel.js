export default class EndorseRequest {
    constructor(endorser,did,cred, uuid) {
        this.endorser = endorser; 
        this.did = did 
        this.cred= cred 
        this.uuid=uuid
      }
}
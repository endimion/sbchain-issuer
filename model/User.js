
class User {
    constructor(email, vcType, status, verified= false ) {
        this.email = email;
        this.vcType = vcType;
        this.status = status;            
        this.verified = verified
      }
}


export { User };;
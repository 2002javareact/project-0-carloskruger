export class UserDTO {
    username:string
    password:string
    email:string
    userId:number// a unique number for identification
    firstName:string
    lastName:string
    role:string // their user permissions
    // associate - for you can use the service
    // finance-manager - for you work on reimbursements
    // admin - you can ban people or add/remove movies
    constructor(username:string,
        password:string,
        email:string,
        userId:number,
        firstName:string,
        lastName:string,
        role:string){
            this.username = username
            this.password = password
            this.email = email
            this.userId = userId
            this.firstName = firstName
            this.lastName = lastName
            this.role = role
        }
}
export class ReimbursementDTO {
    reimbursementId:number
    author:number
    amount:number
    description:string
    dateSubmitted:number// a unique number for identification
    dateResolved:number
    resolver:number // their user permissions
    status:number
    type:number
    constructor(
        reimbursementId:number,
        author:number,
        amount:number,
        description:string,
        dateSubmitted:number,
        dateResolved:number,
        resolver:number,
        status:number,
        type:number){
            this.reimbursementId = reimbursementId
            this.author = author
            this.amount = amount
            this.description = description
            this.dateSubmitted = dateSubmitted
            this.dateResolved = dateResolved
            this.resolver = resolver
            this.status = status
            this.type = type
        }
}
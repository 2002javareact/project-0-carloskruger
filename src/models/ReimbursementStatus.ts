export class ReimbursementStatus {
        statusId: number // primary key
        status: string // not null, unique
    constructor(
            statusId: number, // primary key
            status: string // not null, unique       
    ){
        this.statusId=statusId, // primary key
        this.status =status // not null, unique
      }
}
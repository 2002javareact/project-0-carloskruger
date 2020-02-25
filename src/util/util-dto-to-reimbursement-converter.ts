import { ReimbursementDTO } from "../dtos/ReimbursementDTO";
import { Reimbursement } from "../models/Reimbursement";


export function reimbursementDTOToReimbursementConverter(reimbursementDTO:ReimbursementDTO):Reimbursement{

    return new Reimbursement(
        reimbursementDTO.reimbursementId,
        reimbursementDTO.author,
        reimbursementDTO.amount,
        reimbursementDTO.description,
        reimbursementDTO.dateSubmitted,
        reimbursementDTO.dateResolved,
        reimbursementDTO.resolver,
        reimbursementDTO.status,
        reimbursementDTO.type
    )
}
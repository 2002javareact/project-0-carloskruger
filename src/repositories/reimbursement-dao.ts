import { PoolClient } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { BadCredentialsError } from "../errors/BadCredentialsError";
import { InternalServerError } from "../errors/InternalServerError";
import { reimbursementDTOToReimbursementConverter } from "../util/util-dto-to-reimbursement-converter";
import { ReimbursementDTO } from "../dtos/ReimbursementDTO";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
``;

export async function daoFindReimbursementByStatus(
	statusId: number
): Promise<Reimbursement[]> {
	let client: PoolClient; // our potential connection to db
	try {
		client = await connectionPool.connect();
		// a paramaterized query
		let results = await client.query(
			'SELECT * FROM ers.reimbursement U inner join ers.reimbursement_status R on U."statusId" = R."statusId"  WHERE R."statusId" = $1',
			[statusId]
		);
		if (results.rowCount === 0) {
			throw new Error("Reimbursement Not Found");
		}
		return results.rows.map(reimbursementDTOToReimbursementConverter);
	} catch (e) {
		console.log(e);
		if (e.message === "Reimbursement Not Found") {
			throw new ReimbursementNotFoundError();
		} else {
			throw new InternalServerError();
		}
	} finally {
		client && client.release();
	}
}

export async function daoFindReimbursementsByUser(
	userId: number
): Promise<Reimbursement[]> {
	let client: PoolClient; // our potential connection to db
	try {
		client = await connectionPool.connect();
		let results = await client.query(
			'SELECT * FROM ers.reimbursement U inner join ers.reimbursement_status R on U."statusId" = R."statusId"  WHERE U."author" = $1',
			[userId]
		);
		if (results.rowCount === 0) {
			throw new Error("Reimbursement Not Found");
		}
		return results.rows.map(reimbursementDTOToReimbursementConverter);
	} catch (e) {
		console.log(e);
		if (e.message === "Reimbursement Not Found") {
			throw new ReimbursementNotFoundError();
		} else {
			throw new InternalServerError();
		}
	} finally {
		client && client.release();
	}
}

export async function daoSubmitReimbursement(
	newReimbursement: ReimbursementDTO
): Promise<Reimbursement> {
	let client: PoolClient; // our potential connection to db
	try {
		client = await connectionPool.connect();
		let result = await client.query(
			'INSERT INTO ers.reimbursement (author, amount, "dateSubmitted", "dateResolved", description, resolver, "statusId", "typeId") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
			[
				newReimbursement.author,
				newReimbursement.amount,
				newReimbursement.dateSubmitted,
				newReimbursement.dateResolved,
				newReimbursement.description,
				newReimbursement.resolver,
				newReimbursement.status,
				newReimbursement.type
			]
		);
		return reimbursementDTOToReimbursementConverter(newReimbursement);
	} catch (e) {
		console.log(e);

		throw new InternalServerError();
	} finally {
		client && client.release();
	}
}

export async function daoUpdateReimbursement(
	updates: object[],
	id: number
): Promise<Reimbursement> {
	let client: PoolClient;
	try {
		client = await connectionPool.connect();

		let updateAuthor: boolean = false;
		let newAuthor: string = "";
		let updateAmount: boolean = false;
		let newAmount: number;
		let updateDateSubmitted: boolean = false;
		let newDateSubmitted: number;
		let updateDateResolved: boolean = false;
		let newDateResolved: number;
		let updateDescription: boolean = false;
		let newDescription: string = "";
		let updateResolver: boolean = false;
		let newResolver: number = 0;
		let updateStatus: boolean = false;
		let newStatus: number = 0;
		let updateType: boolean = false;
		let newType: number = 0;
		for (let i = 0; i < updates.length; i++) {
			switch (updates[i][0]) {
				case "author":
					updateAuthor = true;
					newAuthor = updates[i][1];
					break;
				case "amount":
					updateAmount = true;
					newAmount = updates[i][1];
					break;
				case "dateSubmitted":
					updateDateSubmitted = true;
					newDateSubmitted = updates[i][1];
					break;
				case "dateResolved":
					updateDateResolved = true;
					newDateResolved = updates[i][1];

					break;
				case "description":
					updateDescription = true;
					newDescription = updates[i][1];
					break;
				case "resolver":
					updateResolver = true;
					newResolver = updates[i][1];
					break;
				case "status":
					updateStatus = true;
					newStatus = updates[i][1];
					break;
				case "type":
					updateType = true;
					newType = updates[i][1];
					break;
				case "default":
					break;
			}

			if (updateAuthor === true && newAuthor) {
				await client.query(
					'update ers.reimbursement set author = $1 where reimbursement."reimbursementId" = $2',
					[newAuthor, id]
				);
			}

			if (updateAmount === true && newAmount) {
				await client.query(
					'update ers.reimbursement set amount = $1 where reimbursement."reimbursementId" = $2',
					[newAmount, id]
				);
			}

			if (updateDateSubmitted === true && newDateSubmitted) {
				await client.query(
					'update ers.reimbursement set "dateSubmitted" = $1 where reimbursement."reimbursementId" = $2',
					[newDateSubmitted, id]
				);
			}

			if (updateDateResolved === true && newDateResolved) {
				await client.query(
					'update ers.reimbursement set "dateResolved"= $1 where reimbursement."reimbursementId" = $2',
					[newDateResolved, id]
				);
			}

			if (updateDescription === true && newDescription) {
				await client.query(
					'update ers.reimbursement set description = $1 where reimbursement."reimbursementId" = $2',
					[newDescription, id]
				);
			}

			if (updateResolver === true && newResolver) {
				await client.query(
					'update ers.reimbursement set resolver= $1 where reimbursement."reimbursementId" = $2',
					[newResolver, id]
				);
			}
			if (updateStatus === true && newStatus) {
				await client.query(
					'update ers.reimbursement set "statusId" = $1 where reimbursement."reimbursementId" = $2',
					[newStatus, id]
				);
			}

			if (updateType === true && newType) {
				await client.query(
					'update ers.reimbursement set "typeId" = $1 where reimbursement."reimbursementId" = $2',
					[newType, id]
				);
			}
		}

		let updatedReimbursement = daoFindReimbursementById(id);
		return updatedReimbursement;
	} catch (e) {
		// id DNE
		//need if for that
		if (e.message === "Reimbursement not Updated") {
			throw new ReimbursementNotFoundError();
		}
		console.log(e);
		throw new InternalServerError();
	} finally {
		client && client.release();
	}
}

export async function daoFindReimbursementById(
	id: number
): Promise<Reimbursement> {
	let client: PoolClient;
	try {
		client = await connectionPool.connect();
		let result = await client.query(
			'SELECT * FROM ers.reimbursement U  WHERE U."reimbursementId" = $1',
			[id]
		);
		if (result.rowCount === 0) {
			throw new Error("Reimbursement Not Found");
		}
		return reimbursementDTOToReimbursementConverter(result.rows[0]);
	} catch (e) {
		// id DNE
		//need if for that
		console.log(e);
		if (e.message === "Reimbursement Not Found") {
			throw new ReimbursementNotFoundError();
		}
		throw new InternalServerError();
	} finally {
		client && client.release();
	}
}

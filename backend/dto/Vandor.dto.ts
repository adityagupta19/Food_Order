export interface CreateVandorInput {
	name: string;
	ownerName: string;
	foodType: [string];
	pincode: string;
	address: string;
	phone: string;
	email: string;
	password: string;
}

export interface VandorLoginInput {
	email: string;
	password: string;
}

export interface VandorPayload {
	_id: string;
	email: String;
	name: string;
	foodTypes: [string];
}

export interface UpdateVandorInputs {
	name: string;
	foodType: [string];
	address: string;
	phone: string;
}

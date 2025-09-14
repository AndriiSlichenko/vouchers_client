export interface Campaign {
	id: number;
	name: string;
	prefix: string;
	amount: number;
	currency: string;
	validFrom: string;
	validTo: string;
	createdAt: string;
	updatedAt: string;
}

export interface Voucher {
	id: number;
	campaignId: number;
	code: string;
	isUsed: boolean;
	usedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateCampaignRequest {
	name: string;
	prefix: string;
	amount: number;
	currency: string;
	validFrom: string;
	validTo: string;
}

export interface GenerateVouchersRequest {
	count: number;
}

export interface ListCampaignsResponse {
	data: Campaign[];
	total: number;
	page: number;
	limit: number;
}

export interface ListVouchersResponse {
	data: Voucher[];
	pagination: {
		total: number;
		page: number;
		pages: number;
		limit: number;
	};
}
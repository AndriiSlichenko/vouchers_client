import type {
	Campaign,
	CreateCampaignRequest,
	GenerateVouchersRequest,
	ListCampaignsResponse,
	ListVouchersResponse
} from '../types';

declare const API_URL: string;
const API_BASE_URL = `${API_URL}/api`;

class ApiService {
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${API_BASE_URL}${endpoint}`;
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	async getCampaigns(page = 1, limit = 20): Promise<ListCampaignsResponse> {
		return this.request<ListCampaignsResponse>(`/campaigns?page=${page}&limit=${limit}`);
	}

	async getCampaign(id: number): Promise<Campaign> {
		return this.request<Campaign>(`/campaigns/${id}`);
	}

	async createCampaign(campaign: CreateCampaignRequest): Promise<Campaign> {
		return this.request<Campaign>('/campaigns', {
			method: 'POST',
			body: JSON.stringify(campaign),
		});
	}

	async deleteCampaign(id: number): Promise<void> {
		await this.request(`/campaigns/${id}`, {
			method: 'DELETE',
		});
	}

	async getVouchers(campaignId: number, page = 1, limit = 50): Promise<ListVouchersResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		return this.request<ListVouchersResponse>(`/campaigns/${campaignId}/vouchers?${params}`);
	}

	async generateVouchers(campaignId: number, request: GenerateVouchersRequest): Promise<void> {
		await this.request(`/campaigns/${campaignId}/vouchers`, {
			method: 'POST',
			body: JSON.stringify(request),
		});
	}

	async downloadVouchers(campaignId: number): Promise<Blob> {
		const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/vouchers/download`);

		if (!response.ok) {
			throw new Error(`Download Error: ${response.status} ${response.statusText}`);
		}

		return response.blob();
	}
}

export const apiService = new ApiService();

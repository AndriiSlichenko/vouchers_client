import React, { useState, useEffect } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Alert,
	Snackbar,
} from '@mui/material';
import {
	Add as AddIcon,
} from '@mui/icons-material';
import type { Campaign } from '../types';
import { apiService } from '../services/api';
import CreateCampaignForm from './CreateCampaignForm';
import VoucherManagement from './VoucherManagement';
import CampaignCard from './CampaignCard';

const NoCampaigns = () => (
	<Card>
		<CardContent>
			<Typography variant="h6" color="textSecondary" textAlign="center">
				No campaigns found. Create your first campaign to get started!
			</Typography>
		</CardContent>
	</Card>
);

const CampaignList: React.FC = () => {
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
	const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

	const fetchCampaigns = async () => {
		try {
			setLoading(true);
			const response = await apiService.getCampaigns();
			setCampaigns(response.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCampaigns();
	}, []);

	const handleCreateCampaign = async (campaignData: any) => {
		try {
			await apiService.createCampaign(campaignData);
			setCreateDialogOpen(false);
			await fetchCampaigns();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create campaign');
		}
	};

	const handleDeleteCampaign = async () => {
		if (!campaignToDelete) return;

		try {
			await apiService.deleteCampaign(campaignToDelete.id);
			setDeleteDialogOpen(false);
			setCampaignToDelete(null);
			await fetchCampaigns();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete campaign');
		}
	};

	const handleViewVouchers = (campaign: Campaign) => {
		setSelectedCampaign(campaign);
		setVoucherDialogOpen(true);
	};

	const handleOpenDeleteCampaignDialog = (campaign: Campaign) => {
		setCampaignToDelete(campaign);
		setDeleteDialogOpen(true);
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4" component="h1">
					Voucher Campaigns
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setCreateDialogOpen(true)}
				>
					Create Campaign
				</Button>
			</Box>
			{!campaigns.length ? (
				<NoCampaigns />
			) : (
				<Grid container spacing={3}>
					{campaigns.map((campaign) => (
						<Grid size={{ xs: 12, md: 6, lg: 4 }} key={campaign.id}>
							<CampaignCard
								campaign={campaign}
								handleViewVouchers={(campaign) => handleViewVouchers(campaign as Campaign)} 
								openDeleteCampaignDialog={(campaign) => handleOpenDeleteCampaignDialog(campaign as Campaign)}
							/>
						</Grid>
					))}
				</Grid>
			)}

			{/* Create Campaign Dialog */}
			<Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>Create New Campaign</DialogTitle>
				<DialogContent>
					<CreateCampaignForm onSubmit={handleCreateCampaign} />
				</DialogContent>
			</Dialog>

			{/* Voucher Management Dialog */}
			<Dialog open={voucherDialogOpen} onClose={() => setVoucherDialogOpen(false)} maxWidth="lg" fullScreen>
				<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					Vouchers for {selectedCampaign?.name}
					<Button onClick={() => setVoucherDialogOpen(false)}>Close</Button>
				</DialogTitle>
				<DialogContent>
					{selectedCampaign && <VoucherManagement campaign={selectedCampaign} />}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
				<DialogTitle>Delete Campaign</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete the campaign "{campaignToDelete?.name}"?
						This action cannot be undone and will also delete all associated vouchers.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleDeleteCampaign} color="error" variant="contained">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				onClose={() => setError(null)}
			>
				<Alert onClose={() => setError(null)} severity="error">
					{error}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default CampaignList;
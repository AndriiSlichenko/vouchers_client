import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Button,
	TextField,
	Grid,
	Card,
	CardContent,
	Alert,
	Snackbar,
	CircularProgress,
} from '@mui/material';
import {
	Add as AddIcon,
	Refresh as RefreshIcon,
	Download as DownloadIcon,
} from '@mui/icons-material';
import type { Campaign, Voucher } from '../types';
import { apiService } from '../services/api';
import VouchersTable from './vouchersTable';

interface VoucherManagementProps {
	campaign: Campaign;
}

export const LIMIT = 20;

const VoucherManagement: React.FC<VoucherManagementProps> = ({ campaign }) => {
	const [vouchers, setVouchers] = useState<Voucher[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalVouchers, setTotalVouchers] = useState(0);
	const [generateCount, setGenerateCount] = useState(100_000);
	const [generating, setGenerating] = useState(false);
	const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);

	const fetchVouchers = async () => {
		try {
			setLoading(true);
			const { data, pagination } = await apiService.getVouchers(campaign.id, page, LIMIT);
			const { pages: pagesResponse, total: totalResponse } = pagination;
			setVouchers(data);
			setTotalPages(pagesResponse);
			setTotalVouchers(totalResponse);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch vouchers');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchVouchers();
	}, [campaign.id, page]);

	const handleGenerateVouchers = async () => {
		if (generateCount < 1 || generateCount > 100000) {
			setError('Count must be between 1 and 100,000');
			return;
		}

		try {
			setGenerating(true);
			await apiService.generateVouchers(campaign.id, { count: generateCount });
			setError(null);
			await fetchVouchers();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to generate vouchers');
		} finally {
			setGenerating(false);
		}
	};

	const handleDownloadVouchers = async () => {
		try {
			setIsDownloadingCSV(true);
			const blob = await apiService.downloadVouchers(campaign.id);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `vouchers-${campaign.name}-${campaign.id}.csv`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			setIsDownloadingCSV(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to download vouchers');
		} finally {
			setIsDownloadingCSV(false);
		}
	};

	const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const isDisabled = loading || generating || isDownloadingCSV;

	return (
		<Box>
			<Box mb={3}>
				<Grid container spacing={2} alignItems="center">
					<Grid size={{ xs: 12, md: 6 }}>
						<Typography variant="h6">
							{campaign.name} - {totalVouchers} vouchers
						</Typography>
						<Typography variant="body2" color="textSecondary">
							Prefix: {campaign.prefix} | Amount: {campaign.amount} {campaign.currency}
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<Box display="flex" gap={1} justifyContent="flex-end" flexWrap="wrap">
							<Button
								variant="outlined"
								startIcon={<RefreshIcon />}
								onClick={fetchVouchers}
								disabled={isDisabled}
							>
								Refresh
							</Button>
							<Button
								variant="contained"
								startIcon={<DownloadIcon />}
								onClick={handleDownloadVouchers}
								disabled={totalVouchers === 0 || isDisabled}
							>
								Download CSV
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Box>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Generate New Vouchers
					</Typography>
					<Typography variant="body2" color="textSecondary" mb={2}>
						Each voucher will have a unique code like: {campaign.prefix}-XXXXXX
					</Typography>
					<Grid container spacing={2} alignItems="center">
						<Grid size={{ xs: 12, sm: 4 }}>
							<TextField
								fullWidth
								label="Number of vouchers"
								type="number"
								value={generateCount}
								onChange={(e) => setGenerateCount(parseInt(e.target.value) || 0)}
								helperText="1 - 100,000 vouchers"
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 4 }} sx={{ height: '56px', marginBottom: '23px' }}>
							<Button
								variant="contained"
								sx={{ height: '100%', width: '224px' }}
								startIcon={!generating && <AddIcon />}
								onClick={handleGenerateVouchers}
								disabled={isDisabled || generateCount < 1 || generateCount > 100000}
							>
								{generating ? (
									<CircularProgress  color="info" />
								) : 'Generate Vouchers'}
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<VouchersTable
				loading={loading}
				vouchers={vouchers}
				totalVouchers={totalVouchers}
				totalPages={totalPages}
				page={page}
				handlePageChange={handlePageChange}
			/>
			
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

export default VoucherManagement;
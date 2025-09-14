import React from 'react';
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Pagination,
	CircularProgress,
} from '@mui/material';
import type { Voucher } from '../types';
import { LIMIT } from './VoucherManagement';

const getStatusChip = (isUsed: boolean) => {
	if (isUsed) {
		return <Chip label="Used" color="success" size="small" />;
	}

	return <Chip label="Available" color="default" size="small" />;
};

const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
};

interface VouchersTableProps {
    loading: boolean;
    vouchers: Voucher[];
    totalVouchers: number;
    totalPages: number;
    page: number;
    handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

function VouchersTable({
    loading,
    vouchers,
    totalVouchers,
    totalPages,
    page,
    handlePageChange,
}: VouchersTableProps) {
    if (loading) {
        return (
            <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', minHeight: '400px', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ height: '400px', width: '100%' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Code</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Created At</TableCell>
							<TableCell>Used At</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={4} align="center">
									<CircularProgress />
								</TableCell>
							</TableRow>
						) : vouchers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} align="center">
									<Typography variant="body2" color="textSecondary">
										No vouchers found
									</Typography>
								</TableCell>
							</TableRow>
						) : (
							vouchers.map(({ id, code, createdAt, usedAt, isUsed }) => (
								<TableRow key={id}>
									<TableCell>
										<Typography variant="body2" fontFamily="monospace">
											{code}
										</Typography>
									</TableCell>
									<TableCell>{getStatusChip(isUsed)}</TableCell>
									<TableCell>{formatDate(createdAt)}</TableCell>
									<TableCell>
										{usedAt ? formatDate(usedAt) : '-'}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			{totalVouchers > 0 && (
				<Box mt={3}>
					<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
						<Typography variant="body2" color="textSecondary">
							Showing {((page - 1) * LIMIT) + 1} to {Math.min(page * LIMIT, totalVouchers)} of {totalVouchers} vouchers
						</Typography>
						<Typography variant="body2" color="textSecondary">
							Page {page} of {totalPages}
						</Typography>
					</Box>
					<Box display="flex" justifyContent="center">
						<Pagination
							count={totalPages}
							page={page}
							onChange={handlePageChange}
							color="primary"
							size="large"
							showFirstButton
							showLastButton
						/>
					</Box>
				</Box>
			)}
        </>
    );
};

export default VouchersTable;

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { CreateCampaignRequest } from '../types';

interface CreateCampaignFormProps {
	onSubmit: (campaign: CreateCampaignRequest) => void;
}

const currencies = [
	{ code: 'SEK', name: 'Swedish Krona' },
	{ code: 'USD', name: 'US Dollar' },
	{ code: 'EUR', name: 'Euro' },
	{ code: 'GBP', name: 'British Pound' },
	{ code: 'CAD', name: 'Canadian Dollar' },
	{ code: 'AUD', name: 'Australian Dollar' },
];

const initialFormData: CreateCampaignRequest = {
	name: 'Campaign 1',
	prefix: 'DISCOUNT',
	amount: 100,
	currency: 'EUR',
	validFrom: '2025-01-01',
	validTo: '2026-01-01',
};

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSubmit }) => {
	const [formData, setFormData] = useState<CreateCampaignRequest>(initialFormData);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Campaign name is required';
		}

		if (!formData.prefix.trim()) {
			newErrors.prefix = 'Prefix is required';
		} else if (formData.prefix.length > 50) {
			newErrors.prefix = 'Prefix must not exceed 50 characters';
		}

		if (formData.amount <= 0) {
			newErrors.amount = 'Amount must be greater than 0';
		}

		if (!formData.validFrom) {
			newErrors.validFrom = 'Valid from date is required';
		}

		if (!formData.validTo) {
			newErrors.validTo = 'Valid to date is required';
		} else if (formData.validFrom && formData.validTo && formData.validFrom >= formData.validTo) {
			newErrors.validTo = 'Valid to date must be after valid from date';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	const handleChange = (field: keyof CreateCampaignRequest) => (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData(prev => ({
			...prev,
			[field]: event.target.value,
		}));
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: '',
			}));
		}
	};

	const handleDateChange = (field: 'validFrom' | 'validTo') => (date: Date | null) => {
		if (date) {
			setFormData(prev => ({
				...prev,
				[field]: date.toISOString(),
			}));
			if (errors[field]) {
				setErrors(prev => ({
					...prev,
					[field]: '',
				}));
			}
		}
	};

	const handleCurrencyChange = (event: any) => {
		setFormData(prev => ({
			...prev,
			currency: event.target.value,
		}));
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} display="flex" flexDirection="column" gap={2}>
				<TextField
					label="Campaign Name"
					value={formData.name}
					onChange={handleChange('name')}
					error={!!errors.name}
					helperText={errors.name}
					required
				/>
				<TextField
					label="Prefix"
					value={formData.prefix}
					onChange={handleChange('prefix')}
					error={!!errors.prefix}
					helperText={errors.prefix || 'e.g., DISCOUNT'}
					required
				/>
				<FormControl fullWidth required error={!!errors.currency}>
					<InputLabel>Currency</InputLabel>
					<Select
						value={formData.currency}
						onChange={handleCurrencyChange}
						label="Currency"
					>
						{currencies.map((currency) => (
							<MenuItem key={currency.code} value={currency.code}>
								{currency.code} - {currency.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					label="Amount"
					type="number"
					value={formData.amount}
					onChange={handleChange('amount')}
					error={!!errors.amount}
					helperText={errors.amount}
					required
				/>
				<DatePicker
					label="Valid From"
					value={formData.validFrom ? new Date(formData.validFrom) : null}
					onChange={handleDateChange('validFrom')}
					slotProps={{
						textField: {
							fullWidth: true,
							error: !!errors.validFrom,
							helperText: errors.validFrom,
							required: true,
						},
					}}
				/>
				<DatePicker
					label="Valid To"
					value={formData.validTo ? new Date(formData.validTo) : null}
					onChange={handleDateChange('validTo')}
					slotProps={{
						textField: {
							fullWidth: true,
							error: !!errors.validTo,
							helperText: errors.validTo,
							required: true,
						},
					}}
				/>
				<Box display="flex" gap={2} justifyContent="flex-end">
					<Button type="submit" variant="contained" size="large">
						Create Campaign
					</Button>
				</Box>
			</Box>
		</LocalizationProvider>
	);
};

export default CreateCampaignForm;
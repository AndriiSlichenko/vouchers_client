import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Chip,
} from '@mui/material';

import {
	Delete as DeleteIcon,
	Visibility as ViewIcon,
} from '@mui/icons-material';

interface Campaign {
    name: string;
    prefix: string;
    amount: number;
    currency: string;
    validFrom: string;
    validTo: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

interface CampaignCardProps {
    campaign: Campaign;
    handleViewVouchers: (campaign: Campaign) => void;
    openDeleteCampaignDialog: (campaign: Campaign) => void;
}

const CampaignCard = ({ campaign, handleViewVouchers, openDeleteCampaignDialog }: CampaignCardProps) => {
    const {
        name,
        prefix,
        amount,
        currency,
        validFrom,
        validTo,
    } = campaign;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    {name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    Prefix: <Chip label={prefix} color="success" size='medium' />
                </Typography>
                <Typography variant="h6" color="primary">
                    Amount: {formatCurrency(amount, currency)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Valid: {formatDate(validFrom)} - {formatDate(validTo)}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewVouchers(campaign)}
                    >
                        View Vouchers
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => openDeleteCampaignDialog(campaign)}
                    >
                        Delete Campaign
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
};

export default CampaignCard;

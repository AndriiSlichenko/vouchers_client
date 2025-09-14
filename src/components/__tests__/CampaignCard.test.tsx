import { render, screen, fireEvent } from '../../test/test-utils';
import CampaignCard from '../CampaignCard';

const mockCampaign = {
  name: 'Test Campaign',
  prefix: 'TEST',
  amount: 100,
  currency: 'EUR',
  validFrom: '2025-01-01',
  validTo: '2025-12-31',
};

const mockHandlers = {
  handleViewVouchers: jest.fn(),
  openDeleteCampaignDialog: jest.fn(),
};

describe('CampaignCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders campaign information correctly', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        handleViewVouchers={mockHandlers.handleViewVouchers}
        openDeleteCampaignDialog={mockHandlers.openDeleteCampaignDialog}
      />
    );

    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText('Prefix:')).toBeInTheDocument();
    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('Amount: €100.00')).toBeInTheDocument();
    expect(screen.getByText(/Valid:/)).toBeInTheDocument();
  });

  it('calls handleViewVouchers when View Vouchers button is clicked', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        handleViewVouchers={mockHandlers.handleViewVouchers}
        openDeleteCampaignDialog={mockHandlers.openDeleteCampaignDialog}
      />
    );

    const viewButton = screen.getByText('View Vouchers');
    fireEvent.click(viewButton);

    expect(mockHandlers.handleViewVouchers).toHaveBeenCalledWith(mockCampaign);
    expect(mockHandlers.handleViewVouchers).toHaveBeenCalledTimes(1);
  });

  it('calls openDeleteCampaignDialog when Delete Campaign button is clicked', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        handleViewVouchers={mockHandlers.handleViewVouchers}
        openDeleteCampaignDialog={mockHandlers.openDeleteCampaignDialog}
      />
    );

    const deleteButton = screen.getByText('Delete Campaign');
    fireEvent.click(deleteButton);

    expect(mockHandlers.openDeleteCampaignDialog).toHaveBeenCalledWith(mockCampaign);
    expect(mockHandlers.openDeleteCampaignDialog).toHaveBeenCalledTimes(1);
  });

  it('formats currency correctly for different currencies', () => {
    const usdCampaign = { ...mockCampaign, currency: 'USD', amount: 50 };
    
    render(
      <CampaignCard
        campaign={usdCampaign}
        handleViewVouchers={mockHandlers.handleViewVouchers}
        openDeleteCampaignDialog={mockHandlers.openDeleteCampaignDialog}
      />
    );

    expect(screen.getByText('Amount: $50.00')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        handleViewVouchers={mockHandlers.handleViewVouchers}
        openDeleteCampaignDialog={mockHandlers.openDeleteCampaignDialog}
      />
    );

    // The exact format depends on locale, but should contain the year
    expect(screen.getByText(/Valid:/)).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('renders all required buttons', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        handleViewVouchers={mockHandlers.handleViewVouchers}
        openDeleteCampaignDialog={mockHandlers.openDeleteCampaignDialog}
      />
    );

    expect(screen.getByText('View Vouchers')).toBeInTheDocument();
    expect(screen.getByText('Delete Campaign')).toBeInTheDocument();
  });
});
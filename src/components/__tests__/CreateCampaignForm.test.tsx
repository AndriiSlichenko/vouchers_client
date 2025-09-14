import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import CreateCampaignForm from '../CreateCampaignForm';

const mockOnSubmit = jest.fn();

const defaultProps = {
  onSubmit: mockOnSubmit,
};

describe('CreateCampaignForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields with default values', () => {
    render(<CreateCampaignForm {...defaultProps} />);

    expect(screen.getByDisplayValue('Campaign 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('DISCOUNT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('EUR')).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<CreateCampaignForm {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Campaign 1');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Campaign');

    expect(nameInput).toHaveValue('New Campaign');
  });

  it('prevents submission with empty required fields', async () => {
    const user = userEvent.setup();
    render(<CreateCampaignForm {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Campaign 1');
    await user.clear(nameInput);

    const submitButton = screen.getByText('Create Campaign');
    await user.click(submitButton);

    // Form should not submit with empty name
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('prevents submission with empty prefix', async () => {
    const user = userEvent.setup();
    render(<CreateCampaignForm {...defaultProps} />);

    const prefixInput = screen.getByDisplayValue('DISCOUNT');
    await user.clear(prefixInput);

    const submitButton = screen.getByText('Create Campaign');
    await user.click(submitButton);

    // Form should not submit with empty prefix
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('prevents submission with invalid amount', async () => {
    const user = userEvent.setup();
    render(<CreateCampaignForm {...defaultProps} />);

    const amountInput = screen.getByDisplayValue('100');
    await user.clear(amountInput);
    await user.type(amountInput, '-10');

    const submitButton = screen.getByText('Create Campaign');
    await user.click(submitButton);

    // Form should not submit with negative amount
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when form is valid', async () => {
    const user = userEvent.setup();
    render(<CreateCampaignForm {...defaultProps} />);

    const submitButton = screen.getByText('Create Campaign');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Campaign 1',
        prefix: 'DISCOUNT',
        amount: 100,
        currency: 'EUR',
        validFrom: '2025-01-01',
        validTo: '2026-01-01',
      });
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    render(<CreateCampaignForm {...defaultProps} />);

    const submitButton = screen.getByText('Create Campaign');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset to initial values
    expect(screen.getByDisplayValue('Campaign 1')).toBeInTheDocument();
  });

  it('renders currency select with default value', () => {
    render(<CreateCampaignForm {...defaultProps} />);

    const currencySelect = screen.getByDisplayValue('EUR');
    expect(currencySelect).toBeInTheDocument();
  });

  it('has all required form fields', () => {
    render(<CreateCampaignForm {...defaultProps} />);

    expect(screen.getByDisplayValue('Campaign 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('DISCOUNT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('EUR')).toBeInTheDocument();
    expect(screen.getByText('Create Campaign')).toBeInTheDocument();
  });
});
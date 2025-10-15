import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChipiPaymentButton } from '@/components/chipi-payment-button'

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_CHIPI_PUBLIC_KEY: 'test-public-key',
  NEXT_PUBLIC_CHIPI_MERCHANT_WALLET: '0x1234567890abcdef1234567890abcdef12345678',
  CHIPI_SECRET_KEY: 'test-secret-key',
  CHIPI_WEBHOOK_SECRET: 'test-webhook-secret',
}

Object.assign(process.env, mockEnv)

describe('ChipiPaymentButton', () => {
  const defaultProps = {
    amount: 10,
    currency: 'USDC',
    recipientWallet: '0x1234567890abcdef1234567890abcdef12345678',
  }

  it('renders payment button initially', () => {
    render(<ChipiPaymentButton {...defaultProps} />)
    
    expect(screen.getByText('Pay 10 USDC')).toBeInTheDocument()
  })

  it('shows payment form when clicked', () => {
    render(<ChipiPaymentButton {...defaultProps} />)
    
    const payButton = screen.getByText('Pay 10 USDC')
    fireEvent.click(payButton)
    
    expect(screen.getByText('Confirm Payment')).toBeInTheDocument()
    expect(screen.getByText('Enter your PIN to complete the payment of 10 USDC')).toBeInTheDocument()
  })

  it('shows cancel and pay now buttons in form', () => {
    render(<ChipiPaymentButton {...defaultProps} />)
    
    const payButton = screen.getByText('Pay 10 USDC')
    fireEvent.click(payButton)
    
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Pay Now')).toBeInTheDocument()
  })

  it('disables pay now button when PIN is empty', () => {
    render(<ChipiPaymentButton {...defaultProps} />)
    
    const payButton = screen.getByText('Pay 10 USDC')
    fireEvent.click(payButton)
    
    const payNowButton = screen.getByText('Pay Now')
    expect(payNowButton).toBeDisabled()
  })

  it('enables pay now button when PIN is entered', () => {
    render(<ChipiPaymentButton {...defaultProps} />)
    
    const payButton = screen.getByText('Pay 10 USDC')
    fireEvent.click(payButton)
    
    const pinInput = screen.getByPlaceholderText('Enter your PIN')
    fireEvent.change(pinInput, { target: { value: '1234' } })
    
    const payNowButton = screen.getByText('Pay Now')
    expect(payNowButton).not.toBeDisabled()
  })

  it('calls onSuccess callback when payment succeeds', async () => {
    const onSuccess = jest.fn()
    render(<ChipiPaymentButton {...defaultProps} onSuccess={onSuccess} />)
    
    const payButton = screen.getByText('Pay 10 USDC')
    fireEvent.click(payButton)
    
    const pinInput = screen.getByPlaceholderText('Enter your PIN')
    fireEvent.change(pinInput, { target: { value: '1234' } })
    
    const payNowButton = screen.getByText('Pay Now')
    fireEvent.click(payNowButton)
    
    // Wait for mock payment to complete
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('shows loading state during payment', async () => {
    render(<ChipiPaymentButton {...defaultProps} />)
    
    const payButton = screen.getByText('Pay 10 USDC')
    fireEvent.click(payButton)
    
    const pinInput = screen.getByPlaceholderText('Enter your PIN')
    fireEvent.change(pinInput, { target: { value: '1234' } })
    
    const payNowButton = screen.getByText('Pay Now')
    fireEvent.click(payNowButton)
    
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })
})

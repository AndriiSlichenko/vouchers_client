# Component Tests

This directory contains unit tests for the React components using Vitest and React Testing Library.

## Test Files

- `CampaignCard.test.tsx` - Tests for the CampaignCard component
- `CreateCampaignForm.test.tsx` - Tests for the CreateCampaignForm component

## Running Tests

```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Each test file follows this pattern:
- **Setup**: Mock functions and default props
- **Rendering**: Component rendering with test utilities
- **Assertions**: Testing component behavior and user interactions

## Test Utilities

The tests use custom render utilities in `src/test/test-utils.tsx` that provide:
- Material-UI theme provider
- Date picker localization
- Custom render function with all providers

## Coverage

Tests cover:
- Component rendering
- User interactions (clicks, typing)
- Form validation
- Event handlers
- Props handling
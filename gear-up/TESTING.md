# Test Documentation

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (recommended for development):

```bash
npm run test:watch
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## Test Structure

All test files are co-located with their components/modules and follow the naming convention `ComponentName.test.tsx` or `ModuleName.test.ts`.

### Component Test Files Created

1. **StatsCard.test.tsx** - Tests for the stats card component
   - Validates rendering of label and value
   - Tests all variant types (default, yellow, green, red)
   - Verifies hover effects and icon display
   - Tests edge cases (zero values, large numbers)

2. **DashboardHeader.test.tsx** - Tests for the dashboard header
   - Validates header title and subtitle
   - Tests Add Vehicle button and link
   - Verifies icon rendering
   - Tests responsive layout classes

3. **FilterDropdown.test.tsx** - Tests for the filter dropdown
   - Tests dropdown open/close functionality
   - Validates filter status display
   - Tests filter selection and callbacks
   - Verifies checkmark for active filter
   - Tests backdrop click handling
   - Validates car count display

4. **EmptyInventoryState.test.tsx** - Tests for empty state
   - Validates all text content
   - Tests Add Vehicle button and link
   - Verifies all feature cards render
   - Tests icon rendering
   - Validates animation classes
   - Tests responsive grid layout

5. **DealerCarCard.test.tsx** - Tests for individual car card
   - Tests car rendering via CarCard component
   - Validates status badge display
   - Tests hover show/hide of options
   - Tests edit and delete callbacks
   - Validates options menu functionality
   - Tests different status badge variants

6. **CarList.test.tsx** - Tests for car listing
   - Tests empty state display
   - Validates car card rendering
   - Tests grid layout classes
   - Verifies animation classes
   - Tests prop passing to child components
   - Handles edge cases (null, empty array, no IDs)

7. **DealerCarDashboard.test.tsx** - Integration tests for main dashboard
   - Tests all component integrations
   - Validates stats cards rendering
   - Tests filter functionality
   - Verifies layout and styling classes
   - Tests with empty and populated data

## Test Coverage

The test suite covers:

- ✅ Component rendering
- ✅ User interactions (clicks, hovers)
- ✅ Props validation
- ✅ Conditional rendering
- ✅ Callback functions
- ✅ Edge cases and error scenarios
- ✅ Responsive design classes
- ✅ Animation classes
- ✅ Integration between components

## Mocking Strategy

### External Dependencies

- **next/link**: Mocked to render simple anchor tags
- **@/components/Car/CarCard**: Mocked in DealerCarCard tests
- **Custom hooks**: Mocked in DealerCarDashboard tests

### Test Utilities

- **@testing-library/react**: For rendering and querying
- **@testing-library/jest-dom**: For additional matchers
- **jest**: For mocking and assertions

## Best Practices Followed

1. **Isolation**: Each test is independent and doesn't affect others
2. **Clarity**: Test names clearly describe what is being tested
3. **Coverage**: Tests cover happy paths, edge cases, and error scenarios
4. **Mocking**: External dependencies are properly mocked
5. **Cleanup**: `beforeEach` and `afterEach` hooks ensure clean state
6. **Accessibility**: Tests use semantic queries (getByRole, getByText)

## Continuous Integration

These tests are ready to be integrated into CI/CD pipelines. Update your CI configuration to run:

```yaml
- npm install
- npm test -- --ci --coverage --maxWorkers=2
```

## Future Improvements

Consider adding:

- Snapshot tests for visual regression
- Integration tests with actual API calls
- E2E tests using Playwright or Cypress
- Performance tests for list rendering
- Accessibility tests with jest-axe

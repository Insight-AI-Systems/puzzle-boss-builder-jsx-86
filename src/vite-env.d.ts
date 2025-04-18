
/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />

// Add augmentation to include jest-dom matchers
interface JestMatchers<R> {
  toBeInTheDocument(): R;
  toBeVisible(): R;
  toHaveTextContent(text: string): R;
  toBeDisabled(): R;
  toBeEnabled(): R;
  toHaveClass(className: string): R;
  toHaveAttribute(attr: string, value?: string): R;
  toHaveStyle(style: Record<string, any>): R;
  toHaveFocus(): R;
  toBeChecked(): R;
  toBePartiallyChecked(): R;
  toBeRequired(): R;
  toBeValid(): R;
  toBeInvalid(): R;
  toBeEmptyDOMElement(): R;
  toHaveValue(value: string | string[] | number): R;
  toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
  toBeEmpty(): R;
}

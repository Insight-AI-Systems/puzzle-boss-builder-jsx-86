
/// <reference types="@testing-library/jest-dom" />

// This file augments the Jest namespace with testing-library/jest-dom matchers
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toHaveTextContent(text: string | RegExp): R;
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
}

// This empty export is necessary to make TypeScript treat this file as a module
export {};

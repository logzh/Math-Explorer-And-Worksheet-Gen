export enum Operation {
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
  MIXED = 'mixed'
}

export interface MathProblem {
  id: string;
  num1: number;
  num2: number;
  operator: string; // '×' or '÷'
  answer: number;
}

export interface ExplanationRequest {
  num1: number;
  num2: number;
  operation: Operation;
}

export interface WorksheetConfig {
  count: number;
  maxNumber: number; // For operands in multiplication, or divisors in division
  operation: Operation;
}
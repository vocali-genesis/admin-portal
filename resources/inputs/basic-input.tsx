import React, { forwardRef } from "react";
import styled from "styled-components";

export interface BasicInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  type?: string;
  value?: string;
  testId?: string;
}

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 2vh;
  color: black;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: #f8fafc;
  height: 52px;
  flex: 1;

  &:focus {
    outline: none;
    border-color: #38b2ac;
    box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.1);
  }
`;

const BasicInput = forwardRef<
  React.RefObject<HTMLInputElement>,
  BasicInputProps
>(function BasicInput({ value, testId, ...props }: BasicInputProps, ref) {
  return (
    <StyledInput
      value={value}
      {...props}
      data-testid={testId}
      ref={ref as React.RefObject<HTMLInputElement>}
      name={props.id}
    />
  );
});

export default BasicInput;

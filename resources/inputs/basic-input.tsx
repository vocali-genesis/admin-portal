import React from "react";
import styled from "styled-components";

interface BasicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: #f8fafc;
  height: 6vh;

  &:focus {
    outline: none;
    border-color: #38b2ac;
    box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.1);
  }
`;

const BasicInput: React.FC<BasicInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  return <StyledInput value={value} onChange={(e) => onChange(e)} {...props} />;
};

export default BasicInput;

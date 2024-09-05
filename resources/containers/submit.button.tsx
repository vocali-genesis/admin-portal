import React from "react";
import styled from "styled-components";

interface SubmitButtonProps {
  label: string;
  testId?: string;
  isSubmitting?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  testId,
  isSubmitting,
}) => {
  return (
    <StyledButton type="submit" data-testid={testId} disabled={isSubmitting}>
      {isSubmitting ? <Spinner /> : label}
    </StyledButton>
  );
};

export default SubmitButton;

const StyledButton = styled.button`
  background: var(--secondary);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-family: "Montserrat", sans-serif;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
`;

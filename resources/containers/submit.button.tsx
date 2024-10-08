import React from "react";
import styled from "styled-components";
import { SmallSpinner } from "./small-spinner";

interface SubmitButtonProps {
  label: string;
  testId?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  testId,
  isSubmitting,
  disabled = false,
  onClick = () => {},
}) => {
  return (
    <StyledButton
      type="submit"
      data-testid={testId}
      disabled={isSubmitting || disabled}
      onClick={onClick}
    >
      {isSubmitting ? <SmallSpinner /> : label}
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



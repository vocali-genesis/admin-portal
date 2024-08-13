import React from "react";
import styled from "styled-components";

interface SubmitButtonProps {
  label: string;
  testId?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, testId }) => {
  return (
    <StyledButton type="submit" data-testid={testId}>
      {label}
    </StyledButton>
  );
};

export default SubmitButton;

const StyledButton = styled.button`
  background: #1c364b;
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
`;

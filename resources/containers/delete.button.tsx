import React from "react";
import { FaTrash } from "react-icons/fa6";
import styled from "styled-components";

interface DeleteButtonProps {
  label: string;
  testId?: string;
  onClick: () => void;
}

/**
 * Refactor this:
 * Use basic button on the hook
 * Allow customization
 */
const DeleteButton: React.FC<DeleteButtonProps> = ({
  label,
  testId,
  onClick,
}) => {
  return (
    <StyledButton data-testid={testId} onClick={onClick}>
      <FaTrash size={16} style={{ color: "#DF4949", marginTop: 4 }} />
      {label}
    </StyledButton>
  );
};

export default DeleteButton;

const StyledButton = styled.button`
  background-color: #ffc1c1;
  color: black;
  padding: 7.5px 30px;
  border-radius: 4px;
  border: 1px solid #df4949;
  cursor: pointer;
  font-size: 2vh;
  font-family: "Montserrat", sans-serif;
  margin-top: 3vh;
  display: flex;
  gap: 1vh;
  align-content: center;
`;

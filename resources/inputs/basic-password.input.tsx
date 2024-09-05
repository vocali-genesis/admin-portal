import React, { forwardRef, useState } from "react";
import BasicInput, { BasicInputProps } from "./basic-input";
import styled from "styled-components";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const VisibilityButton = styled.button`
  position: absolute;
  right: 0;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #888;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }
`;

const BasicPasswordInput: React.FC<BasicInputProps> = forwardRef(
  function BasicPasswordInput(props: BasicInputProps, ref) {
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
      <PasswordInputWrapper>
        <BasicInput
          {...props}
          ref={ref}
          type={showConfirmPassword ? "text" : "password"}
        />
        <VisibilityButton
          onClick={(event: React.MouseEvent) => {
            event.preventDefault();
            setShowConfirmPassword(!showConfirmPassword);
          }}
        >
          {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </VisibilityButton>
      </PasswordInputWrapper>
    );
  }
);

export default BasicPasswordInput;

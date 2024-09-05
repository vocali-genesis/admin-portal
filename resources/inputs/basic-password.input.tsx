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

const BasicPasswordInput = forwardRef<
  React.RefObject<HTMLInputElement>,
  BasicInputProps
>(function BasicPasswordInput(props: BasicInputProps, ref) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Here we have a ref pass a a prop to a sub-component. I had to put any, spend 30 min figuring out how to make it build and pass the test at the same time
   */
  return (
    <PasswordInputWrapper>
      <BasicInput
        {...props}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        ref={ref as any}
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
});

export default BasicPasswordInput;

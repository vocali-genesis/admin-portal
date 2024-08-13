import React from "react";
import { FieldError } from "react-hook-form";
import styled from "styled-components";

interface Properties {
  children: JSX.Element;
  label: string;
  name: string;
  error?: FieldError | undefined;
}
/**
 * And input wrapper for the style used in the settings page
 */
export const SettingsInputField = ({
  children,
  label,
  name,
  error,
}: Properties) => {
  return (
    <FormGroup>
      <div className="flex items-center">
        <FieldLabel htmlFor={name}>{label}:</FieldLabel>
        {children}
      </div>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </FormGroup>
  );
};

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;

  & input {
    flex: 0 0 60%;
    padding: 8px;
    border: 1px solid var(--gray-200);
    border-radius: 4px;
    height: 6vh;
    color: black;
    font-size: 2vh;
    font-family: "Montserrat", sans-serif;
  }
`;

const FieldLabel = styled.label`
  flex: 0 0 40%;
  text-align: right;
  margin-right: 20px;
  color: black;
  font-family: "Montserrat", sans-serif;
  font-size: 2vh;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 2vh;
  margin-top: 5px;
  margin-left: calc(40% + 20px);
  font-family: "Montserrat", sans-serif;
`;

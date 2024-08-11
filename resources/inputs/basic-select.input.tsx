import React from "react";
import styled from "styled-components";

interface Props {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  testId?: string;
  disabled?: boolean;
}

export const BasicSelect = (props: Props) => {
  return (
    <Select
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      data-testid={props.testId}
      onChange={(e) => props.onChange(e.target.value)}
    >
      {props.options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 6vh;
  color: black;
  font-size: 2vh;
  font-family: "Montserrat", sans-serif;
`;

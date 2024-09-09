import React from "react";
import styled from "styled-components";

interface Props {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string, selectedLabel?: string }>;
  testId?: string;
  disabled?: boolean;
  width?: string;
  className?: string;
}

export const BasicSelect = (props: Props) => {
  return (
    <SelectWrapper className={props.className}>
      <Select
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        data-testid={props.testId}
        onChange={(e) => props.onChange(e.target.value)}
        style={{ width: props.width }}
      >
        {props.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.value === props.value
              ? option.selectedLabel || option.label
              : option.label}
          </option>
        ))}
      </Select>
    </SelectWrapper>
  );
};

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid var(--gray-200);
  border-radius: 4px;
  height: 6vh;
  color: black;
  font-size: 2vh;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;

  /* Center the text */
  text-align: center;
  text-align-last: center;

  /* Remove default arrow in IE */
  &::-ms-expand {
    display: none;
  }

  /* Style for when the select is open */
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  /* Ensure the text is centered in Firefox */
  option {
    text-align: center;
  }
`;
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
    <SelectWrapper width={props.width} className={props.className}>
      <Select
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        data-testid={props.testId}
        onChange={(e) => props.onChange(e.target.value)}
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

const SelectWrapper = styled.div<{ width?: string }>`
  position: relative;
  width: ${props => props.width || '100%'};

  &::after {
    content: '▼';
    font-size: 1vh;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    position: absolute;
    pointer-events: none;
  }
`;

const Select = styled.select`
  appearance: none;
  width: 100%;
  padding: 8px;
  padding-right: 30px; /* Space for the custom arrow */
  border: 1px solid var(--gray-200);
  border-radius: 4px;
  height: 6vh;
  color: black;
  font-size: 2vh;
  font-family: "Montserrat", sans-serif;
  background-color: white;
  cursor: pointer;

  text-align: center;
  text-align-last: center;

  &::-ms-expand {
    display: none;
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  option {
    text-align: center;
  }
`;
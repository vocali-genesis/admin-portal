import styled from "styled-components";


export function ButtonSpinner({ hidden }: { hidden: boolean }) {
    if (hidden) {
        return
    }
    return <Spinner />
}

const Spinner = styled.span`
    border: 2px solid #f3f3f3;
    border-top: 2px solid var(--primary);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
  `
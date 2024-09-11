import moment from "moment";
import packageJson from '../../package.json';
import styled from "styled-components";

export default function AppFooter(props: {}) {

    return (
        <Version  >
            Genesis @{moment().year()} - v{packageJson.version}
        </Version>
    )
}

const Version = styled.div`
    color: var(--secondary);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 10px;
    display: flex;
    justify-content: flex-end;
    margin-top: 3em;
    padding: 0.5em;
`
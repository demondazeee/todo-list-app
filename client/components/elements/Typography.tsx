import styled from "styled-components";

export const H1 = styled.h1`
    font-size: 4rem;
`
export const H2 = styled.h2`
    font-size: 3.5rem;
`
export const H3 = styled.h3`
    font-size: 2.5rem;
`

export const P = styled.p`
    font-size: 1.5rem;


    color: ${props => {
        return props.color || "#000"
    }}
`
import styled from "styled-components";


export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`

export const FormInputContainer = styled.div`
     & > *:not(:last-child) {
        margin-bottom: 10px;
    }
`

export const FormActionContainer = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 20px;
    }
`
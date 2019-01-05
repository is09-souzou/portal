import React from "react";
import Image from "src/components/atoms/Image";
import styled from "styled-components";

export interface ImageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    defaultImageUrl?: string;
    hintText?: string;
    labelText?: string;
    onImageLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

interface State {
    focused: boolean;
    imageUrl: string | undefined;
    invalid: boolean;
}

export default class extends React.Component<ImageInputProps, State> {
    state: State = {
        focused : false,
        imageUrl: undefined,
        invalid : false
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(e);
        if (this.state.imageUrl) {
            URL.revokeObjectURL(this.state.imageUrl);
        }
        const file = e.target.files![0];
        this.setState({
            imageUrl: file && URL.createObjectURL(file)
        });
    }

    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur(e);
        this.setState({
            focused: false,
            invalid: !e.target.validity.valid
        });
    }

    handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        this.props.onFocus && this.props.onFocus(e);
        this.setState({
            focused: true
        });
    }

    render() {
        const {
            className,
            defaultImageUrl,
            disabled = false,
            height = "",
            hintText = "",
            labelText,
            name = String(Math.random()),
            onBlur = () => undefined,
            onChange = () => undefined,
            onFocus = () => undefined,
            onSubmit = () => undefined,
            width = "",
            onImageLoad,
            ...props
        } = this.props;

        const id = this.props.id ? this.props.id : name;

        return (
            <Host
                className={className}
            >
                <StyledLabel
                    htmlFor={id}
                >
                    {labelText &&
                        <LabelText
                            invalid={this.state.invalid}
                            focused={this.state.focused}
                            disabled={disabled}
                        >
                            {labelText}
                        </LabelText>
                    }
                    <StyledImage
                        alt={hintText}
                        height={height}
                        onLoad={onImageLoad}
                        src={this.state.imageUrl || defaultImageUrl}
                        width={width}
                    />
                </StyledLabel>
                <StyledInput
                    accept="image/*"
                    disabled={disabled}
                    id={id}
                    name={name}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    type="file"
                    {...props}
                    unselectable={undefined}
                />
            </Host>
        );
    }
}

const Host = styled.div`
    margin: 16px 0 8px 0;
    display: flex;
`;

const StyledImage = styled(Image as React.SFC<React.ImgHTMLAttributes<HTMLImageElement>>)`
    border: 1px solid #DDD;
    height: calc(100% - 1.1rem);
`;

const StyledLabel = styled.label`
    flex-grow     : 1;
    flex-direction: column;
    display       : flex;
    height        : inherit;
    width         : inherit;
    cursor        : pointer;
`;

interface LabelTextProps {
    invalid: boolean;
    focused: boolean;
    disabled: boolean;
}

const LabelText = styled("span")`
    :not(:empty) {
        display      : inline-block;
        margin-bottom: 8px;
        font-size    : .75rem;
        transition   : all .3s ease-out;
        color        : ${(props: LabelTextProps) => (
                             props.invalid  ? "#F40"
                           : props.focused  ? "#2196F3"
                           : props.disabled ? "#DDD"
                           :                  "#777"
                        )};
    }
`;

const StyledInput = styled.input`
    display: none;
`;
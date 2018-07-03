import React from "react";
import {
    Slide,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
} from "@material-ui/core";
import { DialogProps } from "@material-ui/core/Dialog";
import { SlideProps }  from "@material-ui/core/Slide";
import styled          from "styled-components";
import { SingUp }               from "./wrapper/Auth";
import { NotificationListener } from "./wrapper/NotificationListener";

const Transition = (props: SlideProps) =>  <Slide direction="up" {...props} />;

interface Props extends DialogProps {
    notificationListener: NotificationListener;
    onSignUp: SingUp;
}

export default (
    {
        notificationListener,
        onClose,
        onSignUp,
        ...props
    }: Props
) => (
    <Dialog
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        {...props}
    >
        <form
            // tslint:disable-next-line:jsx-no-lambda
            onSubmit={async e => {
                e.preventDefault();

                const displayName = (e.target as any).elements["sign-up-display-name"].value;
                const email = (e.target as any).elements["sign-up-email"].value;
                const password = (e.target as any).elements["sign-up-password"].value;

                try {
                    await onSignUp(
                        email, password,
                        { email, "custom:display_name": displayName }
                    );
                    notificationListener.notification("info", "Send Mail");
                } catch (e) {
                    notificationListener.errorNotification(e);
                    return;
                }
                onClose && onClose(e);
            }}
        >
            <DialogTitle id="alert-dialog-slide-title">
                Create Account
            </DialogTitle>
            <StyledDialogContent>
                <TextField
                    name="sign-up-email"
                    label="Email Address"
                    margin="normal"
                    type="email"
                    required
                />
                <TextField
                    name="sign-up-password"
                    label="Password"
                    margin="normal"
                    type="password"
                    required
                />
                <TextField
                    name="sign-up-display-name"
                    label="Display Name"
                    margin="normal"
                    type="none"
                    required
                />
            </StyledDialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                >
                    cancel
                </Button>
                <Button component="button" color="primary" type="submit" variant="raised">
                    submit
                </Button>
            </DialogActions>
        </form>
    </Dialog>
);

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;

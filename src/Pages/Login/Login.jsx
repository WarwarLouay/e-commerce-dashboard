import React from 'react';
import axios from 'axios';
import { Card, Input, Spacer, Button, Loading } from "@nextui-org/react";
import classes from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Login = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [values, setValues] = React.useState({
        username: '',
        password: '',
    });

    const loginHandler = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.post('http://localhost:4000/api/admin/login', {
                ...values,
            }, { withCredentials: true });
            if (data.message === 'wrong_username') {
                setMessage('Incorrect Username');
                setOpen(true);
            }
            if (data.message === 'wrong_password') {
                setMessage('Incorrect Password');
                setOpen(true);
            }
            if (!data.message) {
                localStorage.setItem('isLoggedIn', 'isLoggedIn');
                navigate('/');
            }
        } catch (err) {
            setMessage('Something Wrong');
            setOpen(true);
        }
        setIsLoading(false);
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div className={classes.body}>
            <h3>Welcome Back</h3>
            <Card className={classes.card} css={{ mw: "400px" }}>
                <Card.Body>
                    <Spacer y={1.6} />
                    <Input labelPlaceholder="Username" name='username' onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} />
                    <Spacer y={1.6} />
                    <Input.Password labelPlaceholder="Password" name='password' onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} />
                    <Spacer y={1.6} />
                    {!isLoading ? <Button shadow color="gradient" auto
                        onClick={loginHandler} >
                        Login
                    </Button>
                        :
                        <Button shadow color="gradient" auto>
                            <Loading type="points" color="currentColor" size="sm" />
                        </Button>}
                    <Spacer y={1.6} />
                </Card.Body>
            </Card>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Login

/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Moment from 'moment';
import { useParams } from 'react-router-dom';
import Request from '../../Config/Request';
import { Grid, Card, User, Row } from "@nextui-org/react";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const OrderDetails = () => {

    const params = useParams();
    const request = new Request();
    const id = params.id;

    const [orderDetails, setOrderDetails] = React.useState('');
    const [isOk, setIsOk] = React.useState(false);

    const [openAlert, setOpenAlert] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('');

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    React.useEffect(() => {
        callPage();
    }, []);

    async function callPage() {
        const response = await request.getOrderById(params.id);
        console.log(response.data);
        if (response) {
            setIsOk(true);
            setOrderDetails(response.data);
            console.log(orderDetails);
        }
    };

    const acceptOrder = async () => {
        try {
            const response = await request.acceptOrder({id});
            if (response.data.message === 'accepted') {
                setMessage('Order Accepted');
                setSeverity('success')
                setOpenAlert(true);
                callPage();
            } else {
                setMessage('Something wrong');
                setSeverity('error')
                setOpenAlert(true);
                console.log(response);
            }
        } catch (error) {
            setMessage('Something wrong');
            setSeverity('error')
            setOpenAlert(true);
        }
    };

    const rejectOrder = async () => {
        try {
            const response = await request.rejectOrder({id});
            if (response.data.message === 'rejected') {
                setMessage('Order Rejected');
                setSeverity('success')
                setOpenAlert(true);
                callPage();
            } else {
                setMessage('Something wrong');
                setSeverity('error')
                setOpenAlert(true);
                console.log(response);
            }
        } catch (error) {
            setMessage('Something wrong');
            setSeverity('error')
            setOpenAlert(true);
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    return (
        <div>
            {isOk ? <div style={{ padding: '2% 5%' }}>
                <Grid.Container gap={2} justify="space-between">
                    {orderDetails.product.map((product) => {
                        return (
                            <Grid xs={12}>
                                <Card>
                                    <Card.Body>
                                        <Row style={{ justifyContent: 'space-between' }}>
                                            <User squared src={`http://localhost:4000${product.product.productImage}`} css={{ p: 0 }}>
                                                {product.product.productName}
                                            </User>
                                            <b>{product.product.productPrice}$</b>
                                            <b>X{product.qty}</b>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Grid>
                        )
                    })}
                    <b style={{ padding: '2% 5%' }}>{Moment(orderDetails.date).format('LLL')}</b>
                    <b style={{ padding: '2% 5%' }}><big>Total: </big>{orderDetails.total}$</b>

                    <Card style={{ margin: '2% 5%' }}>
                        <Card.Body>
                            <big><b>Customer:</b></big>
                            <p><b>Name: </b>{orderDetails.user.fullName}</p>
                            <p><b>Email: </b>{orderDetails.user.email}</p>
                            <p><b>Phone: </b>{orderDetails.user.countryCode}{orderDetails.user.phone}</p>
                        </Card.Body>
                    </Card>
                    <Card style={{ margin: '2% 5%' }}>
                        <Card.Body>
                            <big><b>Shipping Address:</b></big>
                            <p><b>Address: </b>{orderDetails.shipping.Address}</p>
                            <p><b>Street: </b>{orderDetails.shipping.Street}</p>
                            <p><b>Building: </b>{orderDetails.shipping.Building}</p>
                        </Card.Body>
                    </Card>
                </Grid.Container>
                { orderDetails.status === '0' && <Stack style={{ margin: '5%' }} direction="row" spacing={2}>
                    <Button variant="outlined"
                        color='error'
                        startIcon={<DeleteIcon />}
                        onClick={rejectOrder}>
                        Reject
                    </Button>
                    <Button variant="contained"
                        endIcon={<SendIcon />}
                        onClick={acceptOrder}>
                        Deliver
                    </Button>
                </Stack>}
            </div> : <div></div>}

            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default OrderDetails

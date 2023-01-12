/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import { Table, Row, Col, Tooltip, User, Modal, Input, Button, Text } from "@nextui-org/react";
import { IconButton } from "../../Components/IconButton/IconButton";
import { EyeIcon } from "../../Components/EyeIcon/EyeIcon";
import { EditIcon } from "../../Components/EditIcon/EditIcon";
import { DeleteIcon } from "../../Components/DeleteIcon/DeleteIcon";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Request from '../../Config/Request';

const Products = () => {

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const request = new Request();
    const navigate = useNavigate();
    const [cookie, removeCookie] = useCookies([]);

    const [openAlert, setOpenAlert] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('');

    const [products, setProducts] = React.useState([]);
    const [selectedProductId, setSelectedProductId] = React.useState('');
    const [selectedProductName, setSelectedProductName] = React.useState('');
    const [selectedProductPrice, setSelectedProductPrice] = React.useState('');
    const [selectedProductDescription, setSelectedProductDescription] = React.useState('');

    const [visible, setVisible] = React.useState(false);
    const [visibleDelete, setVisibleDelete] = React.useState(false);

    React.useEffect(() => {
        const verifyUser = async () => {
            if (!cookie.jwt) {
                navigate('/login');
            } else {
                const { data } = await axios.post('http://localhost:4000/api/admin', {}, { withCredentials: true });
                if (!data.status) {
                    removeCookie('jwt');
                    navigate('/login');
                } else {
                }
            }
        };
        verifyUser();
        callPage();
    }, [cookie, navigate, removeCookie, products]);

    async function callPage() {
        const response = await request.get('product');
        setProducts(response.data);
    }

    const edittHandler = (product) => {
        setSelectedProductId(product._id);
        setSelectedProductName(product.productName);
        setSelectedProductPrice(product.productPrice);
        setSelectedProductDescription(product.productDescription);
        setVisible(true);
    };
    const closeHandler = () => {
        setVisible(false);
    };

    const deletetHandler = (product) => {
        setSelectedProductId(product._id);
        setSelectedProductName(product.productName);
        setVisibleDelete(true);
    };
    const closeHandlerDelete = () => {
        setVisibleDelete(false);
    };

    const submitDeleteHandler = async () => {
        const id = selectedProductId;
        const data = { id };
        try {
            const response = await request.deleteProduct(data);
            if (response.data.message === 'deleted') {
                setVisibleDelete(false);
                setMessage(`${selectedProductName} deleted`);
                setSeverity('success')
                setOpenAlert(true);
            } else {
                setVisibleDelete(false);
                setMessage('Something wrong');
                setSeverity('error')
                setOpenAlert(true);
            }
        } catch (error) {
            setVisibleDelete(false);
            setMessage('Something wrong');
            setSeverity('error')
            setOpenAlert(true);
        }
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    return (
        <div style={{ width: '80%', marginLeft: '10%', marginBottom: '5%' }}>
            <br /><br />
            <Button shadow color="gradient" auto>
                Add
            </Button>
            <br />
            <Table
                bordered
                shadow={false}
                color="primary"
                aria-label="Example pagination  table"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
            >
                <Table.Header>
                    <Table.Column>NAME</Table.Column>
                    <Table.Column>PRICE</Table.Column>
                    <Table.Column>ACTIONS</Table.Column>
                </Table.Header>
                <Table.Body>
                    {products.map((product) => {
                        return (
                            <Table.Row key={product._id}>
                                <Table.Cell>
                                    <User squared src={`http://localhost:4000${product.productImage}`} css={{ p: 0 }}>
                                        {product.productName}
                                    </User></Table.Cell>
                                <Table.Cell>{product.productPrice}$</Table.Cell>
                                <Table.Cell>
                                    <Row justify="center" align="center">
                                        <Col css={{ d: "flex" }}>
                                            <Tooltip content="Details">
                                                <IconButton onClick={() => console.log("View user", product._id)}>
                                                    <EyeIcon size={20} fill="#979797" />
                                                </IconButton>
                                            </Tooltip>
                                        </Col>
                                        <Col css={{ d: "flex" }}>
                                            <Tooltip content="Edit user">
                                                <IconButton onClick={() => edittHandler(product)}>
                                                    <EditIcon size={20} fill="#979797" />
                                                </IconButton>
                                            </Tooltip>
                                        </Col>
                                        <Col css={{ d: "flex" }}>
                                            <Tooltip
                                                content="Delete user"
                                                color="error"
                                                onClick={() => deletetHandler(product)}
                                            >
                                                <IconButton>
                                                    <DeleteIcon size={20} fill="#FF0080" />
                                                </IconButton>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
                <Table.Pagination
                    shadow
                    noMargin
                    align="center"
                    rowsPerPage={5}
                    onPageChange={(page) => console.log({ page })}
                />
            </Table>

            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        <Text b size={18}>
                            Edit
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Title"
                        value={selectedProductName}
                        onChange={(e) => setSelectedProductName(e.target.value)}
                    />
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Price"
                        value={selectedProductPrice}
                        onChange={(e) => setSelectedProductPrice(e.target.value)}
                    />
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Description"
                        value={selectedProductDescription}
                        onChange={(e) => setSelectedProductDescription(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={closeHandler}>
                        Close
                    </Button>
                    <Button auto onPress={closeHandler}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visibleDelete}
                onClose={closeHandlerDelete}
            >
                <Modal.Body>
                    <Text id="modal-title" size={18}>
                        Are You sure you want to delete
                        <Text b size={18}>
                            '{selectedProductName}'
                        </Text>
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={closeHandlerDelete}>
                        Close
                    </Button>
                    <Button auto color="warning" onPress={submitDeleteHandler}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Products

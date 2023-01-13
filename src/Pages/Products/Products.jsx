/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import { Table, Row, Col, Tooltip, User, Modal, Input, Button, Text, Dropdown } from "@nextui-org/react";
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
    const [categories, setCategories] = React.useState([]);

    const [selected, setSelected] = React.useState(new Set([""]));
    const selectedCategoryValue = React.useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
    );
    const [productImage, setProductImage] = React.useState([]);
    const [productImageSrc, setProductImageSrc] = React.useState('');
    const [productName, setProductName] = React.useState('');
    const [productPrice, setProductPrice] = React.useState('');
    const [productDescription, setProductDescription] = React.useState('');

    const [selectedProductCategory, setSelectedProductCategory] = React.useState(new Set([""]));
    const selectedValue = React.useMemo(
        () => Array.from(selectedProductCategory),
        console.log(selectedProductCategory.anchorKey),
        [selectedProductCategory]
    );
    const [selectedProductId, setSelectedProductId] = React.useState('');
    const [selectedProductImage, setSelectedProductImage] = React.useState('');
    const [selectedProductName, setSelectedProductName] = React.useState('');
    const [selectedProductPrice, setSelectedProductPrice] = React.useState('');
    const [selectedProductDescription, setSelectedProductDescription] = React.useState('');

    const [visible, setVisible] = React.useState(false);
    const [visibleAdd, setVisibleAdd] = React.useState(false);
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
    }, [cookie, navigate, removeCookie]);

    async function callPage() {
        const product = await request.get('product');
        console.log(product.data);
        setProducts(product.data);

        const category = await request.get('category');
        console.log(category.data);
        setCategories(category.data);
    }

    const edittHandler = (product) => {
        setSelectedProductId(product._id);
        setSelectedProductImage(product.productImage);
        setSelectedProductCategory(product.categoryId.categoryName);
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

    const closeHandlerAdd = () => {
        setVisibleAdd(false);
    };

    const submitDeleteHandler = async () => {
        const id = selectedProductId;
        const data = { id };
        try {
            const response = await request.deleteProduct(data);
            if (response.data.message === 'deleted') {
                setMessage(`${selectedProductName} deleted`);
                setSeverity('success')
                setOpenAlert(true);
            } else {
                setMessage('Something wrong');
                setSeverity('error')
                setOpenAlert(true);
            }
        } catch (error) {
            setMessage('Something wrong');
            setSeverity('error')
            setOpenAlert(true);
        }
        setVisibleDelete(false);
        callPage();
    }

    const updateHandler = async () => {
        const data = { selectedProductId, selectedProductName, selectedProductPrice, selectedProductDescription };
        try {
            const response = await request.updateProduct(data);
            if (response.data.message === 'updated') {
                setMessage(`${selectedProductName} updated`);
                setSeverity('success')
                setOpenAlert(true);
            } else {
                setMessage('Something wrong');
                setSeverity('error')
                setOpenAlert(true);
            }
        } catch (error) {
            setMessage('Something wrong');
            setSeverity('error')
            setOpenAlert(true);
        }
        setVisible(false);
        callPage();
    }

    const addProductHandler = () => {
        const category = selected.anchorKey;
        let formData = new FormData();
        for (let key in productImage) {
            formData.append('productImage', productImage[key]);
        }
        formData.append('productName', productName);
        formData.append('productPrice', productPrice);
        formData.append('productDescription', productDescription);
        formData.append('category', category);

        if(!productName || !productDescription || !productPrice || !productImage || !selected) {
            setMessage('Please fill all information');
            setSeverity('error');
            setOpenAlert(true);
            setVisibleAdd(false);
        } else if(!Number(productPrice)) {
            setMessage('Please enter a valid price');
            setSeverity('error');
            setOpenAlert(true);
            setVisibleAdd(false);
        } else {
        axios.post(`http://localhost:4000/api/product`, formData).then(response => {
                if (response.data.message === 'added') {
                    setMessage(`${productName} added`);
                    setSeverity('success');
                    setOpenAlert(true);
                    callPage();
                    setProductName('');
                    setProductPrice('');
                    setProductDescription('');
                    setSelected('');
                    setProductImageSrc('');
                    setProductImage([]);
                } else {
                    setMessage('Something wrong');
                    setSeverity('error');
                    setOpenAlert(true);
                }
            }).catch(error => {
                setMessage('Something wrong');
                setSeverity('error');
                setOpenAlert(true);
            });
            setVisibleAdd(false);
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
            <Button shadow color="gradient" auto onPress={() => setVisibleAdd(true)}>
                Add
            </Button>
            <br />
            <Table
                style={{zIndex: '0'}}
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
                    <Table.Column>CATEGORY</Table.Column>
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
                                <Table.Cell>{product.categoryId.categoryName}</Table.Cell>
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
                open={visibleAdd}
                onClose={closeHandlerAdd}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        <Text b size={18}>
                            Add Product
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {productImageSrc ?
                        <img style={{ width: 'auto', height: '250px' }} src={productImageSrc} alt='' />
                        :
                        <div style={{ width: '100%', height: '250px', border: '1px solid black', textAlign: 'center' }}>
                            <h5 style={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Upload Image</h5>
                        </div>
                    }
                    <label htmlFor='file' style={{border: '2px solid grey', padding: '0.5rem 0', textAlign: 'center', borderRadius: '0.7rem', cursor: 'pointer'}}>
                       {productImageSrc ? 'Change' : 'Upload'}
                    </label>
                    <input style={{display: 'none'}} type='file' id='file'
                        accept='.png, .jpg .jpeg'
                        onChange={(e) => {
                            setProductImage(e.target.files); const file = e.target.files[0];
                            if (!file) return;
                            setProductImageSrc(URL.createObjectURL(file));
                        }} />
                    <Dropdown>
                        <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
                            {selectedCategoryValue}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Multiple selection actions"
                            color="primary"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selected}
                            onSelectionChange={setSelected}
                        >
                            {categories.map((category) => {
                                return (
                                    <Dropdown.Item key={category._id}>{category.categoryName}</Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Title"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={closeHandlerAdd}>
                        Close
                    </Button>
                    <Button auto onPress={addProductHandler}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

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
                    <img style={{ width: 'auto', height: '250px' }} src={`http://localhost:4000${selectedProductImage}`} alt='' />
                    <Dropdown>
                        <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
                            {selectedValue}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Multiple selection actions"
                            color="primary"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedProductCategory}
                            onSelectionChange={setSelectedProductCategory}
                        >
                            {categories.map((category) => {
                                return (
                                    <Dropdown.Item key={category._id}>{category.categoryName}</Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
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
                    <Button auto onPress={updateHandler}>
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

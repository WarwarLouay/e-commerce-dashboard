/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import axios from 'axios';
import Request from '../../Config/Request';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Table, Row, Col, Tooltip, User, Modal, Input, Button, Text } from "@nextui-org/react";
import { IconButton } from "../../Components/IconButton/IconButton";
import { DeleteIcon } from "../../Components/DeleteIcon/DeleteIcon";

const Categories = () => {

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const request = new Request();

    const [openAlert, setOpenAlert] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('');

    const [categories, setCategories] = React.useState([]);

    const [categoryImage, setCategoryImage] = React.useState([]);
    const [categoryImageSrc, setCategoryImageSrc] = React.useState('');
    const [categoryName, setCategoryName] = React.useState('');

    const [selectedCategoryId, setSelectedCategoryId] = React.useState('');
    const [selectedCategoryName, setSelectedCategoryName] = React.useState('');

    const [visibleAdd, setVisibleAdd] = React.useState(false);
    const [visibleDelete, setVisibleDelete] = React.useState(false);

    React.useEffect(() => {
        callPage();
    }, []);

    async function callPage() {
        const category = await request.get('category');
        console.log(category.data);
        setCategories(category.data);
    }

    const deletetHandler = (category) => {
        setSelectedCategoryId(category._id);
        setSelectedCategoryName(category.categoryName);
        setVisibleDelete(true);
    };
    const closeHandlerDelete = () => {
        setVisibleDelete(false);
    };

    const closeHandlerAdd = () => {
        setVisibleAdd(false);
    };

    const submitDeleteHandler = async () => {
        const id = selectedCategoryId;
        const data = { id };
        try {
            const response = await request.deleteCategory(data);
            if (response.data.message === 'deleted') {
                setMessage(`${selectedCategoryName} deleted`);
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

    const addCategoryHandler = () => {
        let formData = new FormData();
        for (let key in categoryImage) {
            formData.append('categoryImage', categoryImage[key]);
        }
        formData.append('categoryName', categoryName);

        if (!categoryImage || !categoryName) {
            setMessage('Please fill all information');
            setSeverity('error');
            setOpenAlert(true);
            setVisibleAdd(false);
        } else {
            axios.post(`http://localhost:4000/api/category`, formData).then(response => {
                if (response.data.message === 'added') {
                    setMessage(`${categoryName} added`);
                    setSeverity('success');
                    setOpenAlert(true);
                    callPage();
                    setCategoryName('');
                    setCategoryImageSrc('');
                    setCategoryImage([]);
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
                style={{ zIndex: '0' }}
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
                    <Table.Column>ACTIONS</Table.Column>
                </Table.Header>
                <Table.Body>
                    {categories.map((category) => {
                        return (
                            <Table.Row key={category._id}>
                                <Table.Cell>
                                    <User squared src={`http://localhost:4000${category.categoryImage}`} css={{ p: 0 }}>
                                        {category.categoryName}
                                    </User></Table.Cell>
                                <Table.Cell>
                                    <Row justify="center" align="center">
                                        <Col css={{ d: "flex" }}>
                                            <Tooltip
                                                content="Delete user"
                                                color="error"
                                            >
                                                <IconButton onClick={() => deletetHandler(category)}>
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
                    {categoryImageSrc ?
                        <img style={{ width: 'auto', height: '250px' }} src={categoryImageSrc} alt='' />
                        :
                        <div style={{ width: '100%', height: '250px', border: '1px solid black', textAlign: 'center' }}>
                            <h5 style={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Upload Image</h5>
                        </div>
                    }
                    <label htmlFor='file' style={{ border: '2px solid grey', padding: '0.5rem 0', textAlign: 'center', borderRadius: '0.7rem', cursor: 'pointer' }}>
                        {categoryImageSrc ? 'Change' : 'Upload'}
                    </label>
                    <input style={{ display: 'none' }} type='file' id='file'
                        accept='.png, .jpg .jpeg'
                        onChange={(e) => {
                            setCategoryImage(e.target.files); const file = e.target.files[0];
                            if (!file) return;
                            setCategoryImageSrc(URL.createObjectURL(file));
                        }} />
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Title"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={closeHandlerAdd}>
                        Close
                    </Button>
                    <Button auto onPress={addCategoryHandler}>
                        Add
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
                            '{selectedCategoryName}'
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

export default Categories

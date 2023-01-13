/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Moment from 'moment';
import Request from '../../Config/Request';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Table, Row, Col, Tooltip, Modal, Button, Text } from "@nextui-org/react";
import { IconButton } from "../../Components/IconButton/IconButton";
import { EyeIcon } from "../../Components/EyeIcon/EyeIcon";
import { DeleteIcon } from "../../Components/DeleteIcon/DeleteIcon";

const Orders = () => {

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const request = new Request();

  const [openAlert, setOpenAlert] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('');

  const [orders, setOrders] = React.useState([]);

  const [selectedOrderId, setSelectedOrderId] = React.useState('');

  const [visibleDelete, setVisibleDelete] = React.useState(false);

  React.useEffect(() => {
    callPage();
  }, []);

  async function callPage() {
    const order = await request.get('order/getall');
    console.log(order.data);
    setOrders(order.data);
  }

  const deletetHandler = (order) => {
    setSelectedOrderId(order._id);
    setVisibleDelete(true);
  };
  const closeHandlerDelete = () => {
    setVisibleDelete(false);
  };

  const submitDeleteHandler = async () => {
    const id = selectedOrderId;
    const data = { id };
    try {
      const response = await request.deleteOrder(data);
      if (response.data.message === 'deleted') {
        setMessage('Order Deleted');
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

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <div style={{ width: '80%', marginLeft: '10%', marginBottom: '5%' }}>
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
          <Table.Column>DATE</Table.Column>
          <Table.Column>AMOUNT</Table.Column>
          <Table.Column>ACTIONS</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => {
            return (
              <Table.Row key={order._id}>
                <Table.Cell>{order.user.fullName}</Table.Cell>
                <Table.Cell>{Moment(order.date).format('LLL')}</Table.Cell>
                <Table.Cell>{order.total}$</Table.Cell>
                <Table.Cell>
                  <Row justify="center" align="center">
                  <Col css={{ d: "flex" }}>
                                            <Tooltip content="Details">
                                                <IconButton onClick={() => console.log("View user", order._id)}>
                                                    <EyeIcon size={20} fill="#979797" />
                                                </IconButton>
                                            </Tooltip>
                                        </Col>
                    <Col css={{ d: "flex" }}>
                      <Tooltip
                        content="Delete order"
                        color="error"
                      >
                        <IconButton onClick={() => deletetHandler(order)}>
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
        open={visibleDelete}
        onClose={closeHandlerDelete}
      >
        <Modal.Body>
          <Text id="modal-title" size={18}>
            Are You sure you want to delete this order?
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

export default Orders

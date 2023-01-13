/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Request from '../../Config/Request';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Table, Row, Col, Tooltip, Modal, Button, Text } from "@nextui-org/react";
import { IconButton } from "../../Components/IconButton/IconButton";
import { DeleteIcon } from "../../Components/DeleteIcon/DeleteIcon";

const Customers = () => {

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const request = new Request();

  const [openAlert, setOpenAlert] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('');

  const [users, setUsers] = React.useState([]);

  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [selectedUserName, setSelectedUserName] = React.useState('');

  const [visibleDelete, setVisibleDelete] = React.useState(false);

  React.useEffect(() => {
    callPage();
  }, []);

  async function callPage() {
    const user = await request.get('user');
    console.log(user.data);
    setUsers(user.data);
  }

  const deletetHandler = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserName(user.fullName);
    setVisibleDelete(true);
  };
  const closeHandlerDelete = () => {
    setVisibleDelete(false);
  };

  const submitDeleteHandler = async () => {
    const id = selectedUserId;
    const data = { id };
    try {
      const response = await request.deleteUser(data);
      if (response.data.message === 'deleted') {
        setMessage(`${selectedUserName} deleted`);
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
          <Table.Column>EMAIL</Table.Column>
          <Table.Column>COUNTRY</Table.Column>
          <Table.Column>PHONE</Table.Column>
          <Table.Column>ACTIONS</Table.Column>
        </Table.Header>
        <Table.Body>
          {users.map((user) => {
            return (
              <Table.Row key={user._id}>
                <Table.Cell>{user.fullName}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.country}</Table.Cell>
                <Table.Cell>{user.countryCode} {user.phone}</Table.Cell>
                <Table.Cell>
                  <Row justify="center" align="center">
                    <Col css={{ d: "flex" }}>
                      <Tooltip
                        content="Delete user"
                        color="error"
                      >
                        <IconButton onClick={() => deletetHandler(user)}>
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
            Are You sure you want to delete
            <Text b size={18}>
              '{selectedUserName}'
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

export default Customers

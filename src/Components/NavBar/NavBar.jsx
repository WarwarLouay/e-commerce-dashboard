/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import axios from 'axios';
import Request from '../../Config/Request';
import classes from './NavBar.module.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Text, Avatar, Dropdown, Badge } from "@nextui-org/react";

const NavBar = () => {

    const navigate = useNavigate();
    const request = new Request();
    const [cookie, removeCookie] = useCookies([]);
    const [active, setIsActive] = React.useState('Products');

    const [isIn, setIsIn] = React.useState(true);

    const [productLength, setProductLength] = React.useState('');
    const [categoryLength, setCategoryLength] = React.useState('');
    const [userLength, setUserLength] = React.useState('');
    const [orderLength, setOrderLength] = React.useState('');

    const collapseItems = [
        {
            title: 'Products',
            link: ''
        },
        {
            title: 'Categories',
            link: 'categories'
        },
        {
            title: 'Customers',
            link: 'customers'
        },
        {
            title: 'Orders',
            link: 'orders'
        },
    ];

    React.useEffect(() => {
        const verifyUser = async () => {
            if (!cookie.jwt) {
                navigate('/login');
            } else {
                const { data } = await axios.post('http://localhost:4000/api/admin', {}, { withCredentials: true });
                if (!data.status) {
                    setIsIn(false);
                    removeCookie('jwt');
                    navigate('/login');
                } else {
                    setIsIn(true);
                }
            }
        };
        verifyUser();
        callPage();
    }, [cookie, navigate, removeCookie]);

    async function callPage() {
        const order = await request.get('order/getall');
        setOrderLength(order.data.length);

        const user = await request.get('user');
        setUserLength(user.data.length);

        const category = await request.get('category');
        setCategoryLength(category.data.length);

        const product = await request.get('product');
        setProductLength(product.data.length);
    }

    const logOut = () => {
        removeCookie('jwt');
        navigate('/login');
        setIsIn(false);
        localStorage.removeItem('isLoggedIn');
    }

    return (
        <div>
            {isIn ? <Navbar isBordered variant="sticky">
                <Navbar.Toggle showIn="xs" />
                <Navbar.Brand
                    css={{
                        "@xs": {
                            w: "12%",
                        },
                    }}
                >
                    {/*<AcmeLogo />*/}
                    <Text b color="inherit" hideIn="xs">
                        BP Shop
                    </Text>
                </Navbar.Brand>
                <Navbar.Content
                    enableCursorHighlight
                    activeColor="primary"
                    hideIn="xs"
                    variant="highlight-rounded"
                >
                    <Badge color="error" content={productLength}>
                        <Navbar.Link className={classes.link}
                            isActive={active === 'Products'}
                            onClick={() => setIsActive('Products')}>
                            <Link to='/'>Products</Link>
                        </Navbar.Link>
                    </Badge>

                    <Badge color="error" content={categoryLength}>
                        <Navbar.Link className={classes.link}
                            isActive={active === 'Categpries'}
                            onClick={() => setIsActive('Categpries')}>
                            <Link to='/categories'>Categories</Link>
                        </Navbar.Link>
                    </Badge>

                    <Badge color="error" content={userLength}>
                        <Navbar.Link className={classes.link}
                            isActive={active === 'Customers'}
                            onClick={() => setIsActive('Customers')}>
                            <Link to='/customers'>Customers</Link>
                        </Navbar.Link>
                    </Badge>

                    <Badge color="error" content={orderLength}>
                        <Navbar.Link className={classes.link}
                            isActive={active === 'Orders'}
                            onClick={() => setIsActive('Orders')}>
                            <Link to='/orders'>Orders</Link>
                        </Navbar.Link>
                    </Badge>
                </Navbar.Content>
                <Navbar.Content
                    css={{
                        "@xs": {
                            w: "12%",
                            jc: "flex-end",
                        },
                    }}
                >
                    <Dropdown placement="bottom-right">
                        <Navbar.Item>
                            <Dropdown.Trigger>
                                <Avatar
                                    bordered
                                    as="button"
                                    color="primary"
                                    size="md"
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                />
                            </Dropdown.Trigger>
                        </Navbar.Item>
                        <Dropdown.Menu
                            aria-label="User menu actions"
                            color="primary"
                            onAction={(actionKey) => console.log({ actionKey })}
                        >
                            <Dropdown.Item key="profile" css={{ height: "$18" }}>
                                <Text b color="inherit" css={{ d: "flex" }}>
                                    Signed in as
                                </Text>
                                <Text b color="inherit" css={{ d: "flex" }}>
                                    zoey@example.com
                                </Text>
                            </Dropdown.Item>
                            <Dropdown.Item key="settings" withDivider>
                                My Settings
                            </Dropdown.Item>
                            <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
                            <Dropdown.Item key="analytics" withDivider>
                                Analytics
                            </Dropdown.Item>
                            <Dropdown.Item key="system">System</Dropdown.Item>
                            <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
                            <Dropdown.Item key="help_and_feedback" withDivider>
                                Help & Feedback
                            </Dropdown.Item>
                            <Dropdown.Item key="logout" withDivider color="error">
                                <div onClick={logOut}>Log Out</div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Content>
                <Navbar.Collapse>
                    {collapseItems.map((item, index) => (
                        <Navbar.CollapseItem
                            key={item}
                            activeColor="secondary"
                            css={{
                                color: index === collapseItems.length - 1 ? "$error" : "",
                            }}
                            isActive={item.title === active}
                        >
                            <Link
                                color="inherit"
                                css={{
                                    minWidth: "100%",
                                }}
                                style={{ textDecoration: 'none' }}
                                to={`/${item.link}`}
                                onClick={() => setIsActive(item.title)}
                            >
                                {item.title}
                            </Link>
                        </Navbar.CollapseItem>
                    ))}
                </Navbar.Collapse>
            </Navbar> : <div></div>}
        </div>
    )
}

export default NavBar

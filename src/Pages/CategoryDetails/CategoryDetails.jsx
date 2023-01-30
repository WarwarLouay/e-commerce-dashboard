/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useParams } from 'react-router-dom';
import Request from '../../Config/Request';
import { Card, Grid, Row, Text } from "@nextui-org/react";

const CategoryDetails = () => {

    const params = useParams();
    const request = new Request();

    const [products, setProducts] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        callPage();
    }, []);

    async function callPage() {
        const response = await request.getProductsByCategory(params.id);
        console.log(response.data);
        if (response) {
            setIsLoading(true);
            setProducts(response.data);
            console.log(products);
        }
    };

  return (
    <div>
      {
        isLoading ? <Grid.Container gap={2} justify="flex-start">
        {products.map((product, index) => (
          <Grid xs={6} sm={2} key={index}>
            <Card isPressable>
              <Card.Body css={{ p: 0 }}>
                <Card.Image
                  src={`http://localhost:4000${product.productImage}`}
                  objectFit="cover"
                  width="100%"
                  height={140}
                  alt=''
                />
              </Card.Body>
              <Card.Footer css={{ justifyItems: "flex-start" }}>
                <Row wrap="wrap" justify="space-between" align="center">
                  <Text b>{product.productEngName}</Text>
                  <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                    {product.productPrice}$
                  </Text>
                </Row>
              </Card.Footer>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
       :
       <div></div>
      }
    </div>
  )
}

export default CategoryDetails

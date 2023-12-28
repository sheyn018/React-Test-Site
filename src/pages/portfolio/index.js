import React from "react";
import { LibrariaSearch } from "@libraria/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { meta } from "../../content_option";

export const Portfolio = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> List | {meta.title} </title>{" "}
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4"> List </h1>{" "}
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <LibrariaSearch anonKey="36b71a7c-689d-4484-a41c-1bc4b0b6c8b6" isDarkMode={true}/>

      </Container>
    </HelmetProvider>
  );
};

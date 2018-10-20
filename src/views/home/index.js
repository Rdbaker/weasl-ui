import React, { Component } from 'react';
import { Pane, Heading, Table } from 'evergreen-ui';
import { Container, Row, Col, ButtonDropdown, DropdownItem } from 'reactstrap';
import Header from '../../components/header';
import './style.css';

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <main id='main-content'>
          <Pane elevation={1}>
            <Container className="wsl-heading">
              <Row>
                <Col>
                  <Heading size={900} marginTop="default">Home</Heading>
                </Col>
              </Row>
            </Container>
          </Pane>
          <Container>
            <Table>
              <Table.Head>
                <Table.TextHeaderCell>
                  Name
                </Table.TextHeaderCell>
                <Table.TextHeaderCell>
                  E-Mail
                </Table.TextHeaderCell>
                <Table.TextHeaderCell>
                  Last Login
                </Table.TextHeaderCell>
                <Table.TextHeaderCell>
                  Options
                </Table.TextHeaderCell>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.TextCell>
                    Roger Testing
                  </Table.TextCell>
                  <Table.TextCell>
                    test@tester.com
                  </Table.TextCell>
                  <Table.TextCell>
                    8/13/2018
                  </Table.TextCell>
                  <Table.TextCell>
                    <ButtonDropdown title="Options" toggle={() => {}}>
                      <DropdownItem>View</DropdownItem>
                      <DropdownItem>Remove</DropdownItem>
                    </ButtonDropdown>
                  </Table.TextCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Container>
        </main>
      </div>
    );
  }
}

export default Home;

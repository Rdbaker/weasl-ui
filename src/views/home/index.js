import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { DataTable, PaginationV2, Modal } from 'carbon-components-react';
import { Link } from 'react-router-dom';

import { EndUsersAPI } from 'api/endUsers';

import Header from 'components/Header';
import './style.css';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      perPage: 25,
      fetching: false,
      fetchingSuccess: false,
      fetchingFailed: false,
      fetchingError: null,
      pageData: [],
      paginationData: {},
    };
  }

  componentDidMount() {
    this.doFetchUsers();
  }

   doFetchUsers = async () => {
    const {
      page,
      perPage,
    } = this.state;

    this.fetchStarted();
    try {
      const response = await EndUsersAPI.getEndUsers(page, perPage);
      const { data, meta: { pagination }} = await response.json();
      this.fetchSuccess(data, pagination);
    } catch (err) {
      this.fetchFailed(err);
    }
  }

  fetchStarted() {
    this.setState({
      fetching: true,
      fetchingError: null,
      fetchingSuccess: false,
      fetchingError: false,
    });
  }

  fetchFailed(err) {
    this.setState({
      fetching: false,
      fetchingError: err,
      fetchingSuccess: false,
      fetchingError: true,
    });
  }

  fetchSuccess(data, pagination) {
    this.setState({
      fetching: false,
      fetchingError: null,
      fetchingSuccess: true,
      fetchingError: false,
      pageData: data,
      paginationData: pagination,
    });
  }

  getFormattedRow(endUser) {
    return {
      id: endUser.id,
      identity: endUser.identity.email || endUser.identity.phone_number,
      lastLogin: endUser.activity.last_login_at,
      firstLoginAttempt: endUser.activity.created_at,
      attributes: !!Object.keys(endUser.attributes).length ? 'Click to view' : 'None',
    };
  }

  getFormattedRows() {
    const {
      pageData,
    } = this.state;

    return pageData.map(this.getFormattedRow);
  }

  onChangePagination = ({ page, pageSize }) => {
    this.setState({
      page,
      perPage: pageSize
    }, this.doFetchUsers)
  }

  toggleModal = () => {
    this.setState(prevState => ({ isAttributeModalOpen: !prevState.isAttributeModalOpen }))
  }

  renderModalContent = () => {
    const {
      selectedUserId,
      pageData,
      isCreatingNewAttribute,
    } = this.state;

    const endUser = pageData.find(endUser => endUser.id === selectedUserId)

    // TODO: error state
    const attrs = Object.entries(endUser.attributes)

    return (
      <div>
        {!attrs.length &&
          <div>This user has no custom attributes.</div>
        }
    {!!attrs.length && attrs.map((([attr_name, { trusted, value }]) => <div>{attr_name}: {String(value)} <span>({trusted ? 'trusted' : 'not trusted'})</span></div>))}
      </div>
    );
  }

  render() {
    const {
      paginationData,
      page,
      perPage,
      isAttributeModalOpen,
      pageData,
    } = this.state;

    const pageDataEmpty = pageData.length === 0;

    return (
      <div>
        <Header />
        <Modal
          open={isAttributeModalOpen}
          onRequestClose={this.toggleModal}
          onRequestSubmit={this.toggleModal}
          primaryButtonDisabled={true}
          secondaryButtonText="Close"
          primaryButtonText="Save"
        >
          {isAttributeModalOpen && this.renderModalContent()}
        </Modal>
        {pageDataEmpty &&
          <div className="weasl-onboarding-setup-steps">
            <h2>Your 3 steps to setup login on your site</h2>
            <ol>
              <li>✅ Signup for Weasl</li>
              <li>Setup your <Link to="/account">settings</Link></li>
              <li>Install the <Link to="/account/snippet">snippet</Link> on your website</li>
            </ol>
          </div>
        }
        {!pageDataEmpty &&
          <main id="main-content" className="with-header">
            <Paper elevation={0} square={true} className="wsl-heading">
              <div className="constrain-width">
                <Typography variant={'h4'}>Home</Typography>
              </div>
            </Paper>
            <div className="constrain-width">
              <DataTable
                rows={this.getFormattedRows()}
                headers={[
                  { key: 'identity', header: 'Email or Phone' },
                  { key: 'lastLogin', header: 'Last Login' },
                  { key: 'firstLoginAttempt', header: 'First Login Attempt' },
                  { key: 'attributes', header: 'Attributes' }
                ]}
                render={({ rows, headers, getHeaderProps }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow onClick={() => this.setState({selectedUserId: row.id}, this.toggleModal)} key={row.id}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
              <PaginationV2
                page={page}
                pageSize={perPage}
                pageSizes={[25, 50, 100]}
                isLastPage={!('next' in paginationData)}
                totalItems={20 * (paginationData.total || 0)}
                onChange={this.onChangePagination}
                className="wsl-table-pagination-fixed"
              />
            </div>
          </main>
        }
      </div>
    );
  }
}

export default Home;

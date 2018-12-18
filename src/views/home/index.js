import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { DataTable, PaginationV2 } from 'carbon-components-react';

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

  render() {
    const {
      paginationData,
      page,
      perPage,
    } = this.state;

    return (
      <div>
        <Header />
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
                        <TableRow key={row.id}>
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
              isLastPage={'next' in paginationData}
              totalItems={20 * (paginationData.total || 0)}
              onChange={this.onChangePagination}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default Home;

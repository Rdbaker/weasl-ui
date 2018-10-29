import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { DataTable } from 'carbon-components-react';

import Header from '../../components/Header';
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
  render() {
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
            <DataTable rows={[{'id': '1', 'name': 'None', 'email': 'test@test.com', 'lastlogin': 'Oct. 28', 'options': 'None' }]} headers={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'E-Mail' },
              { key: 'lastlogin', header: 'Last Login' },
              { key: 'options', header: 'Options' }
            ]} render={({ rows, headers, getHeaderProps }) => (
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
          </div>
        </main>
      </div>
    );
  }
}

export default Home;

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const SummaryTable = ({ alerts, highlights, isLoading }) => {
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    // Simulating a delay for fetching data
    const delay = setTimeout(() => {
      setShowTable(true);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </div>
      ) : showTable ? (
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Alerts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell>{alert.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Highlights</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {highlights.map((highlight, index) => (
                  <TableRow key={index}>
                    <TableCell>{highlight.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : null}
    </div>
  );
};

export default SummaryTable;
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {ClimbingBoxLoader} from "react-spinners"

const SummaryTable = ({ alerts, highlights, isLoading }) => {
  const [showAlertsTable, setShowAlertsTable] = useState(false);
  const [showHighlightsTable, setShowHighlightsTable] = useState(false);
  const [prevAlertsLength, setPrevAlertsLength] = useState(0);
  const [prevHighlightsLength, setPrevHighlightsLength] = useState(0);

  useEffect(() => {
    // Simulating a delay for fetching data
    const delay = setTimeout(() => {
      setShowAlertsTable(true);
      setShowHighlightsTable(true);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (alerts.length !== prevAlertsLength) {
      // New alerts added, trigger fade-in effect
      setShowAlertsTable(false);
      setTimeout(() => setShowAlertsTable(true), 0); // Delay to reset transition
      setPrevAlertsLength(alerts.length);
    }
  }, [alerts, prevAlertsLength]);

  useEffect(() => {
    if (highlights.length !== prevHighlightsLength) {
      // New highlights added, trigger fade-in effect
      setShowHighlightsTable(false);
      setTimeout(() => setShowHighlightsTable(true), 0); // Delay to reset transition
      setPrevHighlightsLength(highlights.length);
    }
  }, [highlights, prevHighlightsLength]);

  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px', display: "flex", justifyContent: "center" }}>
          <ClimbingBoxLoader color="#36d7b7" />
        </div>
      ) : (
        <div>
          {showAlertsTable && (
            <TableContainer component={Paper} style={{ opacity: showAlertsTable ? 1 : 0, transition: 'opacity 0.5s ease', marginTop: '20px' }}>
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
          )}

          {showHighlightsTable && (
            <TableContainer component={Paper} style={{ opacity: showHighlightsTable ? 1 : 0, transition: 'opacity 0.5s ease', marginTop: '20px' }}>
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
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryTable;
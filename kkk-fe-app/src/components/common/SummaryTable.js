import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import {ClimbingBoxLoader} from "react-spinners"

const SummaryTable = ({ alerts, highlights, isLoading }) => {
  const [showAlertsTable, setShowAlertsTable] = useState(false);
  const [showHighlightsTable, setShowHighlightsTable] = useState(false);
  const [prevAlertsLength, setPrevAlertsLength] = useState(0);
  const [prevHighlightsLength, setPrevHighlightsLength] = useState(0);

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
          {showAlertsTable && alerts.length > 0 && (
            <TableContainer component={Paper} style={{ opacity: showAlertsTable ? 1 : 0, transition: 'opacity 0.5s ease', marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Component</TableCell>
                    <TableCell>Alert</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map((alert, index) => {
                    if(alert){
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip label={alert.category.toUpperCase()} color="error" style={{marginRight: "10px"}}/>
                          </TableCell>
                          <TableCell>
                          {alert.count} users have recently had issues with application {alert.category}, please investigate immediately.
                          </TableCell>
                        </TableRow>
                      )
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}


            <TableContainer component={Paper} style={{ opacity: true ? 1 : 0, transition: 'opacity 0.5s ease', marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Users want this to be added</TableCell>
                  </TableRow>
                </TableHead>
                {showHighlightsTable && highlights.length > 0 && (
                <TableBody>
                  {highlights.map((highlight, index) => {
                    if (highlight && highlight.FeedbackResponse && highlight.FeedbackResponse.suggestion && highlight.FeedbackResponse.categories.length > 0) {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div style={{display: "flex", alignItems: "center"}}>
                            Username: {highlight.name.toUpperCase()}
                              {
                                highlight.FeedbackResponse.categories.map((category, index) => (
                                  <Chip label={category.toUpperCase()} color="primary" style={{marginLeft: "10px"}} key={index}/>
                                ))
                              }
                            </div>
                            <br />
                            {highlight.FeedbackResponse.suggestion}
                          </TableCell>
                        </TableRow>
                      )
                    }
                  })}
                </TableBody>
                )}
              </Table>
            </TableContainer>
        </div>
      )}
    </div>
  );
};

export default SummaryTable;
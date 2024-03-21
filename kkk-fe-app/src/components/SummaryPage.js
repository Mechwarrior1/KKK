import {useEffect, useState} from 'react';
import {Button, Container} from '@mui/material';
import SummaryTable from "./common/SummaryTable";

const mockHighlights = [
  {category: "suggestion", message: "users enjoy this feature and would like to see upvote feature", volume:"medium"},
  {category: "photo taking", message: "users worships you for this feature and crave to see the ability to choose more than 1 photo", volume:"high"}
]

const mockAlerts = [
  {category: "login", message: "production issue and your not going home son, people are complaining about unable to login", volume:"high"}
]

function UserPage() {
  const [highlights, setHightlights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHighlightsData = async () => {
      try {
        // const highlightsResponse = await fetch('highlights-endpoint');
        // const newHighlights = await highlightsResponse.json();
        // setHightlights(newHighlights);
        // Using mock data, activate above when BE ready
        setHightlights(mockHighlights);
      } catch (error) {
        console.error('Error fetching highlights data:', error);
      }
    };

    const fetchAlertsData = async () => {
      try {
        // const alertsResponse = await fetch('alerts-endpoint');
        // const newAlerts = await alertsResponse.json();
        // setAlerts(newAlerts);
        // Using mock data, activate above when BE ready
        setAlerts(mockAlerts);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error('Error fetching alerts data:', error);
      }
    };

    const longPollingLoop = async () => {
      while (true) {
        await fetchHighlightsData();
        await fetchAlertsData();
        setIsLoading(false)
        // Wait for a specific interval before making the next request
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds interval
      }
    };

    longPollingLoop();

    // Cleanup function to stop the loop if component unmounts
    return () => {
      // You might want to add code here to stop the long polling loop,
      // such as setting a flag or using something like clearInterval.
    };
  }, []);

  const handleAddHighlights = () => {
    setHightlights((prev)=> {return [...prev, ...mockHighlights]});
  };

  useEffect(()=>{console.log("hello world")},[])
  return (
    <Container maxWidth="sm" style={{ margin: '20px auto' }}>
      <SummaryTable
        isLoading={isLoading}
        alerts={alerts}
        highlights={highlights}
      />
      <Button variant="contained" onClick={handleAddHighlights}>Add highlights</Button>
    </Container>
  );
}

export default UserPage;
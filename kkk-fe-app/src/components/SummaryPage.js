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

const alertThreshold = 1

function UserPage() {
  const [highlights, setHightlights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let response = []
    if (alerts.length > 0) {
      const countOfPerformance = alerts.reduce((acc, obj) => {
        if (obj.FeedbackResponse.categories == null || obj.FeedbackResponse.categories.length == 0) {return acc;}
        obj.FeedbackResponse.categories.forEach(category => {
          if (category.toLowerCase() === "performance") {
            acc++;
          }
        });
        return acc;
      }, 0);
      if (countOfPerformance > alertThreshold) {
        response = [{category: "performance", count: countOfPerformance}, ...response]
      }
      const countOfDesign = alerts.reduce((acc, obj) => {
        if (obj.FeedbackResponse.categories == null || obj.FeedbackResponse.categories.length == 0) {return acc;}
        obj.FeedbackResponse.categories.forEach(category => {
          console.log("cat",category)
          if (category.toLowerCase() === "design") {
            console.log("incremented",category)
            acc++;
          }
        });
        return acc;
      }, 0);
      console.log("count of design", countOfDesign)
      if (countOfDesign > alertThreshold) {
        response = [{category: "design", count: countOfDesign}, ...response]
      }
      const countOfFeature = alerts.reduce((acc, obj) => {
        if (obj.FeedbackResponse.categories == null || obj.FeedbackResponse.categories.length == 0) {return acc;}
        obj.FeedbackResponse.categories.forEach(category => {
          if (category.toLowerCase() === "feature") {
            acc++;
          }
        });
        return acc;
      }, 0);
      if (countOfFeature > alertThreshold) {
        response = [{category: "design", count: countOfFeature}, ...response]
      }
    }
    console.log('response',response)
    setFilteredAlerts(response)
  }, [alerts])


  useEffect(() => {
    const fetchHighlightsData = async () => {
      try {
        const highlightsResponse = await fetch('/get-suggestion?suggestion=true');
        const newHighlights = await highlightsResponse.json();
        const response = newHighlights.reverse();
        console.log("highlights",newHighlights)
        setHightlights(response);
      } catch (error) {
        console.error('Error fetching highlights data:', error);
      }
    };

    const fetchAlertsData = async () => {
      try {
        const alertsResponse = await fetch('/get-sentiment?sentiment=negative');
        const newAlerts = await alertsResponse.json();
        console.log("alerts", newAlerts)
        setAlerts(newAlerts);
        await new Promise(resolve => setTimeout(resolve, 8000));
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
        await new Promise(resolve => setTimeout(resolve, 8000)); // 5 seconds interval
      }
    };

    longPollingLoop();

    // Cleanup function to stop the loop if component unmounts
    return () => {
      // You might want to add code here to stop the long polling loop,
      // such as setting a flag or using something like clearInterval.
    };
  }, []);

  useEffect(()=>{console.log("hello world")},[])
  return (
    <Container maxWidth="sm" style={{ margin: '20px auto' }}>
      <SummaryTable
        isLoading={isLoading}
        alerts={filteredAlerts}
        highlights={highlights}
      />
    </Container>
  );
}

export default UserPage;
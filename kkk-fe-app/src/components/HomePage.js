import {Typography, Container, Button} from '@mui/material';
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <Container maxWidth="sm" style={{ margin: '20px auto' }}>
      <Fade delay={1e3} cascade damping={1e-1}>
        <Typography variant="h4" color="inherit" component="div" pb={4}>
          Klassify Karens & Kevins (KKK)
        </Typography>
      </Fade>
      <Fade delay={1e3} cascade damping={1e-2}>
        <img alt={"meme"} src={'./womanyellingcat.jpg'} style={{ marginBottom: '20px', display: 'block', width: "100%" }} />
      </Fade>
      <Fade delay={1e3} cascade damping={1e-2}>
        <Container style={{display: "flex", justifyContent: "space-around"}}>
          <Link to="/user" style={{ textDecoration: 'none' }} >
            <Button color="warning" size='large' variant="outlined" style={{minWidth: "180px", minHeight: "180px", borderWidth: "thick", borderRadius: "12px"}}>
              User Inputs
            </Button>
          </Link>
          <Link to="/summary" style={{ textDecoration: 'none' }}>
            <Button color="primary" size='large' variant="contained" style={{minWidth: "180px", minHeight: "180px", borderWidth: "thick", borderRadius: "12px"}}>
              Developer View
            </Button>
          </Link>
        </Container>
      </Fade>
    </Container>
  );
}

export default HomePage;
import {useEffect, useState} from 'react';
import { Snackbar ,Container, TextField, Button } from '@mui/material';

function UserPage() {
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlt, setIsOpenAlt] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const [activateNasty, setActivateNasty] = useState(false)

    const handleFormSubmit = async () => {
        if (comment === "karen") {
          setActivateNasty(true)
          setComment('')
          setIsOpenAlt(true);
          return
        }
        if (comment === "nice") {
          setActivateNasty(false)
          setComment('')
          setIsOpenAlt(true);
          return
        }
        try {
            const response = await fetch(`/submit?nasty=${activateNasty? 'true': 'false'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, comment }),
            });
            const data = await response.json();
            console.log(data);
          setComment('')
            setIsSuccess(true);
            setIsOpen(true);
        } catch (error) {
            console.error(error);
            setIsSuccess(false);
            setIsOpen(true);
        }

    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

  const handleCloseModalAlt = () => {
    setIsOpenAlt(false);
  };
useEffect(()=>{console.log("hello world")},[])
    return (
        <Container maxWidth="sm" style={{ margin: '20px auto' }}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                style={{ marginBottom: '20px' }}
            />
            <TextField
                label="Enter a normal conversational message"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                margin="normal"
                multiline
                rows={5}
                fullWidth
                style={{ marginBottom: '20px' }}
            />
            <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                Submit
            </Button>

            <Snackbar
              open={isOpen}
              autoHideDuration={3000} // 5 seconds
              onClose={handleCloseModal}
              message={isSuccess ? "Submission successful!" : "Submission failed. Please try again."}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              key={'top' + 'center'}
            />

          <Snackbar
            open={isOpenAlt}
            autoHideDuration={3000} // 5 seconds
            onClose={handleCloseModalAlt}
            message={activateNasty ? "Karen mode activated!" : "Lets play nice."}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            key={'top' + 'center' + 2}
          />
        </Container>
    );
}

export default UserPage;
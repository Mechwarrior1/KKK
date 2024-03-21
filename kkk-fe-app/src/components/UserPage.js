import { useState } from 'react';
import { Container, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function UserPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);

    const handleFormSubmit = async () => {
        try {
            const response = await fetch('https://kkk-api.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email }),
            });
            const data = await response.json();
            console.log(data);

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

    return (
        <Container>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                Submit
            </Button>

            <Dialog open={isOpen} onClose={handleCloseModal}>
                <DialogTitle>{isSuccess ? "Success" : "Error"}</DialogTitle>
                <DialogContent>
                    <p>{isSuccess ? "Submission successful!" : "Submission failed. Please try again."}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default UserPage;
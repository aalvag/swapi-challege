import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

import NavBar from '../NavBar';

export default function Layout({ children }) {
  return (
    <div>
      <NavBar />
      <Toolbar />
      <Container maxWidth="xl">{children}</Container>
    </div>
  );
}

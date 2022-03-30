import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import Logo from '../assets/Star-Wars-Logo-Amarillo-PNG.png';
import Background from '../assets/giphy.webp';
import { loginUser } from '../features/user/userLoginSlice';
import { decrypt } from '../services/crypto';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(60);

  const { error, username, isLoggedIn, loading } = useSelector(
    state => state.user
  );

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: values => {
      const { username, password } = values;
      const decryptedPassword = decrypt(password);
      if (decryptedPassword) {
        dispatch(loginUser({ username, password: decryptedPassword }));
      } else {
        setLoginError(true);
      }
      setAttempts(prev => prev + 1);
    }
  });

  useEffect(() => {
    if (username && username?.name) {
      navigate('/user-details', { replace: true });
    }
  }, [username]);

  useEffect(() => {
    if (attempts > 3) {
      setDisabled(true);
      setTimeout(() => {
        setLoginError(false);
        setAttempts(0);
        setDisabled(false);
        setCount(60);
      }, 60000);
    }
  }, [attempts]);

  useEffect(() => {
    if (attempts > 3) {
      setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
    }
  }, [count, attempts]);

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{
        height: '100vh',
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
            marginBottom: 4
          }}
          alt="Star Wars Logo"
          src={Logo}
        />
        <Typography component="h1" variant="h4" color="white">
          Demo APP
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            autoComplete="username"
            autoFocus
            sx={{
              backgroundColor: 'rgba(222,222,222,0.5)',
              borderRadius: '0.3rem'
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="text"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              backgroundColor: 'rgba(222,222,222,0.5)',
              borderRadius: '0.3rem'
            }}
          />
          <Typography
            component="h1"
            variant="h6"
            color="red"
            sx={{ textAlign: 'center' }}
          >
            {loginError || error ? 'Invalid username or password' : ''}
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            color="red"
            sx={{ textAlign: 'center' }}
          >
            {attempts > 3 ? `Too many attempts, wait ${count} seg ` : ''}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={disabled}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <CircularProgress color="secondary" size={25} />
            ) : (
              'Login'
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={attempts > 0 ? true : false}
        key={['bottom', 'center']}
      >
        <Alert variant="filled" severity="warning">
          Number of attempts: {attempts}
        </Alert>
      </Snackbar>
    </Container>
  );
}

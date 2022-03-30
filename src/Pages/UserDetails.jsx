import { Grid, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Layout from '../components/Layout';
import LoaderBackdrop from '../components/Loader';
import { getFilms } from '../features/films/filmsSlice';

const UserDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector(state => state.user);
  const { films, isLoading } = useSelector(state => state.films);

  useEffect(() => {
    if (films.length === username.films.length) {
      return;
    }
    if (username.films.length > 0 && films.length === 0) {
      username.films.forEach(film => {
        dispatch(getFilms(film));
      });
    }
  }, [username, films, dispatch]);

  const handleClick = film => {
    const arrayFilms =
      JSON.parse(localStorage.getItem(`${username.name}`)) || [];
    const visitedPage = {
      title: film.title,
      user: username.name,
      date: new Date().toLocaleDateString()
    };
    arrayFilms.push(visitedPage);
    localStorage.setItem(`${username.name}`, JSON.stringify(arrayFilms));
    navigate(`/film/${film.title}`, { state: { film } });
  };

  if (isLoading)
    return (
      <Layout>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Box m={2}>
              <LoaderBackdrop loading={isLoading} />
            </Box>
          </Grid>
        </Grid>
      </Layout>
    );

  return (
    <Layout>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            User Details
          </Typography>
          <Typography variant="h5" component="div">
            Nombre: {username.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Usuario desde: {new Date(username.created).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" component="p">
            {username.films.length} películas
          </Typography>

          {films.map(film => (
            <Paper
              key={film.title}
              // component={Link}
              // to={`/film/${film.title}`}
              // state={{
              //   film
              // }}
              sx={{ m: 2, textDecoration: 'none' }}
              onClick={() => handleClick(film)}
            >
              <Box sx={{ p: 2, color: '#FAA809', border: 1, borderRadius: 8 }}>
                <Typography variant="h5">Titulo:</Typography>
                <Typography>{film.title}</Typography>
                <Typography variant="h5">Director:</Typography>
                <Typography variant="body2">{film.director}</Typography>
                <Typography variant="h5">Opening Crawl:</Typography>
                <Typography variant="body2">{film.opening_crawl}</Typography>
              </Box>
            </Paper>
          ))}
        </CardContent>
      </Card>
    </Layout>
  );
};
export default UserDetails;

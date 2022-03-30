import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Layout from '../components/Layout';
import LoaderBackdrop from '../components/Loader';
import { getCharacters } from '../features/characters.js/characters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Visited Films by User last 7 days'
    }
  }
};

const FilmDetatailsScreen = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  // filter las 7 days
  const filterData = data => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const filteredData = data.filter(item => {
      const date = new Date(item);
      return date > lastWeek;
    });

    return filteredData;
  };
  // array of days visited
  let days = filterData(data).map(item => {
    return new Date(item).getDate();
  });

  // array of last 7 days
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    last7Days.push(
      new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).getDate()
    );
  }
  last7Days.reverse();

  // count days visited
  const unique = arr => {
    let indices = [...last7Days];
    indices.map((item, index) => {
      arr.map((item2, index2) => {
        if (item === item2) {
          indices[index] = index2 + 1;
        } else {
          indices[index] = 0;
        }
      });
    });
    return indices;
  };

  const uniqueDays = unique(days);

  const dataChart = {
    labels: last7Days,
    datasets: [
      {
        label: 'Visited Films',
        data: uniqueDays,
        backgroundColor: 'rgba(250, 168, 9, 0.5)'
      }
    ]
  };

  const { title, director, opening_crawl, characters, producer } =
    location.state.film;

  const { username } = useSelector(state => state.user);
  const visitedPage = JSON.parse(localStorage.getItem(`${username.name}`));
  useEffect(() => {
    if (visitedPage && visitedPage.length > 0) {
      const arrayFilms = visitedPage.filter(
        film => film.title === title && film.user === username.name
      );
      setCount(arrayFilms.length);
      if (arrayFilms.length > 0) {
        const data = arrayFilms.map(film => film.date);
        setData(data);
      }
    }
  }, []);

  const { characters: charactersState, isLoading } = useSelector(
    state => state.characters
  );

  useEffect(() => {
    if (charactersState.length === characters.length) {
      return;
    }
    if (characters.length > 0 && charactersState.length === 0) {
      characters.forEach(character => {
        dispatch(getCharacters(character));
      });
    }
  }, [characters, charactersState, dispatch]);

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
      <Grid>
        <Typography align="right"> Visits: {count}</Typography>
        <Typography variant="h4">Title: {title}</Typography>
        <Typography variant="h5">Director: {director}</Typography>
        <Typography variant="h5">
          {producer.includes(',') ? 'Producers:' : 'Producer:'} {producer}
        </Typography>
        <Typography variant="body1">
          <strong>Open Crawl:</strong> {opening_crawl}
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FAA809' }} align="center">
                  Nombre
                </TableCell>
                <TableCell sx={{ color: '#FAA809' }} align="center">
                  Homeworld - name
                </TableCell>
                <TableCell sx={{ color: '#FAA809' }} align="center">
                  Hair Color
                </TableCell>
                <TableCell sx={{ color: '#FAA809' }} align="center">
                  Height
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charactersState.map((character, i) => (
                <TableRow
                  key={character.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {character.name}
                  </TableCell>
                  <TableCell align="center">
                    {character.homeworldName}
                  </TableCell>
                  <TableCell align="center">{character.hair_color}</TableCell>
                  <TableCell align="center">{character.height}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <Bar options={options} data={dataChart} />
        </Box>
      </Grid>
    </Layout>
  );
};

export default FilmDetatailsScreen;

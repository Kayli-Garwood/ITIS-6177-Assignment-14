
import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import MuiLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CreateMonkeyForm from '../components/Monkey/CreateMonkeyForm';
import MonkeyTable from '../components/Monkey/MonkeyTable';
import ProTip from '../src/ProTip';
import Link from '../src/Link';

const useStyles = makeStyles(theme => {
  return ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      margin: theme.spacing(2),
    },
    section: {
      // backgroundColor: theme.palette.primary.main,
      margin: theme.spacing(5),
    }
  })
});

export default function Index () {
  const styles = useStyles()
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sugar Generator Index Page
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <Grid container spacing={3}>
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Form Component(s)
            </Typography>
          </Grid>
          <Grid item style={{ maxWidth: '100%' }}>
             
            <div className={styles.section}>
              <Divider style={{ margin: 25 }}/>
                <Paper className={styles.paper}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Create Monkey Form
                  </Typography>
                  <CreateMonkeyForm />
                </Paper>
                <MonkeyTable />
            </div>
  
          </Grid>
        </Grid>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Built with love by the '}
          <MuiLink color="inherit" href="https://sugarkubes.io">
            Sugarkubes
          </MuiLink>
          {' team.'}
        </Typography>
      </Box>
    </Container>
  );
}
  
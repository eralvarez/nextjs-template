import { Typography, Box, Grid, Card, CardContent } from '@mui/material';

export default function AppDashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to your application dashboard. This page is wrapped in the DashboardLayout component.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3" color="primary">
                1,234
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Projects
              </Typography>
              <Typography variant="h3" color="primary">
                42
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Tasks
              </Typography>
              <Typography variant="h3" color="primary">
                18
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

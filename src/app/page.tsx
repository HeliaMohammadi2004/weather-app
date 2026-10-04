import { Container, Typography, Paper } from "@mui/material";
import CurrentWeatherCard from "@/components/weather/CurrentWeatherCard";
import { Box } from "@mui/material";
import type { WeatherLocation } from "@/types/location";
import WeatherDashboard from "@/components/weather/WeatherDashboard";

const berlin: WeatherLocation = {
  id: 2950159,
  name: "Berlin",
  country: "Germany",
  admin1: "Berlin",
  latitude: 52.52,
  longitude: 13.41,
};

export default function HomePage() {
  return (
    <main>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ mt: 3 }}>
            <WeatherDashboard initialLocation={berlin} />
          </Box>
        </Paper>
      </Container>
    </main>
  );
}

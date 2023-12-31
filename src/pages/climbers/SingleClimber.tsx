import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

type Climber = {
  id: React.ReactNode;
  name: string;
};

const SingleClimberPage = () => {
  const [climber, setClimber] = useState<Climber | null>();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const climberResponse = await supabase
        .from("profiles")
        .select(
          `
          id,name
        `
        )
        .eq("slug", params.slug)
        .single();

      setClimber(climberResponse?.data);
    };

    fetchData();
  }, [params.slug]);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
        }}
      >
        <Typography level="h1" fontSize="xl2" sx={{ mb: 1 }}>
          Setores / {climber?.name}
        </Typography>

        <Card sx={{ minHeight: "280px", width: 320 }}>
          <CardCover>
            <img
              src="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320"
              srcSet="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </CardCover>
          <CardCover
            sx={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
            }}
          />
          <CardContent sx={{ justifyContent: "flex-end" }}>
            <Typography level="title-lg" textColor="#fff">
              Yosemite National Park
            </Typography>
            <Typography
              startDecorator={<PlaceOutlinedIcon />}
              textColor="neutral.300"
            >
              California, USA
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default SingleClimberPage;

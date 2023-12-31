import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TerrainOutlinedIcon from "@mui/icons-material/TerrainOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import ImageIcon from "@mui/icons-material/Image";

import CountClimbRoutes from "./CountClimbRoutes";

type SectorsCardProps = {
  id: React.ReactNode;
  name: React.ReactNode;
  slug: string;
  description: React.ReactNode;
  how_to_get_there: React.ReactNode;
  city: string;
  state: string;
  stars: number;
  updated_at: string;
  image?: string;
  liked?: boolean;
};

export default function SectorsCard({
  id,
  city,
  state,
  name,
  slug,
  description,
  how_to_get_there,
  stars,
  updated_at,
  liked = false,
  image,
}: SectorsCardProps) {
  const [isLiked, setIsLiked] = React.useState(liked);
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        transition: "250ms all",
        mb: 2,
        padding: {
          xs: 0,
          sm: 2,
        },
        boxShadow: "none",
        borderRadius: "sm",
        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
        },
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        width="100%"
        spacing={2.5}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: 200,
            },
            marginBottom: {
              xs: -2.5,
              sm: 0,
            },
          }}
        >
          <AspectRatio
            ratio={4 / 3}
            sx={(theme) => ({
              borderRadius: "xs",
              [theme.breakpoints.down("sm")]: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            })}
          >
            {image ? (
              <img alt="" src={image} style={{ display: "block" }} />
            ) : (
              <ImageIcon
                sx={{ display: "block", fontSize: "4rem", opacity: 0.4 }}
              />
            )}
            {stars > 25 && (
              <Chip
                variant="soft"
                startDecorator={<EmojiEventsOutlinedIcon />}
                size="sm"
                sx={{ position: "absolute", bottom: 8, left: 8 }}
              >
                pico irado!
              </Chip>
            )}
          </AspectRatio>
        </Box>
        <Stack
          sx={{
            padding: {
              xs: 2,
              sm: 0,
            },
          }}
          spacing={1}
          flex={1}
          justifyContent="space-evenly"
        >
          <Stack
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <div>
              <Typography fontWeight="md" fontSize="lg">
                <Link
                  component={RouterLink}
                  overlay
                  underline="none"
                  to={slug}
                  sx={{ color: "text.primary" }}
                >
                  {name}
                </Link>
              </Typography>
            </div>
            <IconButton
              variant={isLiked ? "solid" : "soft"}
              onClick={() => setIsLiked((prev) => !prev)}
              sx={{
                display: { xs: "none", sm: "flex" },
              }}
            >
              <StarBorderOutlinedIcon />
            </IconButton>
          </Stack>
          <Stack spacing={1} direction="row">
            <Typography level="body-md">{description}</Typography>
          </Stack>

          <Stack spacing={1} direction="row">
            <Typography level="body-md">
              <strong>Como chegar:</strong> {how_to_get_there}
            </Typography>
          </Stack>

          <Stack spacing={3} direction="row" sx={{ mt: 16 }}>
            <Typography level="body-sm" startDecorator={<PlaceOutlinedIcon />}>
              {city}/{state}
            </Typography>
            <Typography
              level="body-sm"
              startDecorator={<TerrainOutlinedIcon />}
              display={{
                xs: "none",
                md: "flex",
              }}
            >
              <CountClimbRoutes id={id} /> vias
            </Typography>

            <Typography
              sx={{
                flexGrow: 1,
                textAlign: "right",
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography
                level="body-sm"
                startDecorator={<TodayOutlinedIcon />}
              >
                {updated_at}
              </Typography>
            </Typography>

            <IconButton
              variant={isLiked ? "solid" : "outlined"}
              onClick={() => setIsLiked((prev) => !prev)}
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                display: { xs: "flex", sm: "none" },
              }}
            >
              <StarBorderOutlinedIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

import { useEffect } from "react";
import { Card, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { Package, Tag, Truck, Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../index.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import usePushpad from "../../hooks/usePushpad";

const sections = [
  { name: "Productos", icon: <Package size={28} />, to: "/products" },
  { name: "Marcas", icon: <Tag size={28} />, to: "/brands" },
  { name: "Proveedores", icon: <Truck size={28} />, to: "/brand-suppliers" },
  { name: "Usuarios", icon: <Users size={28} />, to: "/users" },
  { name: "Logs", icon: <Activity size={28} />, to: "/action-logs" },
];


const Home = () => {
  usePushpad();

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "#111",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar sx={{ justifyContent: "center", py: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: "#2c2c2c",
            }}
          >
            Tienda Tech - Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          px: { xs: 3, sm: 6 },
          py: 8,
          background: "linear-gradient(180deg, #fafafa 0%, #f4f4f4 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 50 }}
        >
          <Typography
            variant="h2"
            fontWeight="700"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "#2c2c2c",
              textAlign: "center",
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 1,
            }}
          >
            Bienvenido al Panel de Control
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#666",
              fontSize: 18,
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Gestiona tus productos, marcas y usuarios de forma eficiente y elegante.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 5,
          }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.name}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <Link to={section.to} style={{ textDecoration: "none" }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    p: 4,
                    background: "#fff",
                    border: "1px solid #eee",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    minHeight: 160,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box sx={{ color: "#111", mb: 2 }}>{section.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    {section.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#777", fontWeight: 500 }}>
                    Gestionar {section.name.toLowerCase()}
                  </Typography>
                </Card>
              </Link>
            </motion.div>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Home;

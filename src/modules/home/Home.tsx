// src/modules/home/Home.tsx
import { Card, CardContent, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { Package, Tag, Truck, Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import "../../index.css";
import "@fontsource/poppins/400.css";   
import "@fontsource/poppins/600.css";   
import "@fontsource/poppins/700.css";   
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css"; 


const sections = [
  { name: "Productos", icon: <Package size={28} />, to: "/products" },
  { name: "Marcas", icon: <Tag size={28} />, to: "/brands" },
  { name: "Proveedores", icon: <Truck size={28} />, to: "/brand-suppliers" },
  { name: "Usuarios", icon: <Users size={28} />, to: "/users" },
  { name: "Logs", icon: <Activity size={28} />, to: "/action-logs" },
];

const Home = () => {
  return (
    <>
      {/* Header fijo y elegante */}
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          background: "#1E293B",
          color: "#fff",
          mb: 6,
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h4" sx={{ fontFamily: "'Poppins', serif", fontWeight: 700 }}>
            Tienda Tech - Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: { xs: 3, sm: 6 }, pb: 8 }}>
        {/* Título + subtítulo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 40 }}
        >
          <Typography
            variant="h2"
            fontWeight="700"
            sx={{ fontFamily: "'Poppins', serif", mb: 1, color: "#1E293B" }}
          >
            Panel de Control
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: 18 }}>
            Accede a las secciones de tu sistema de tienda tecnológica.
          </Typography>
        </motion.div>

        {/* Grid con tarjetas animadas */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.name}
              whileHover={{ scale: 1.07, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
            >
              <Link to={section.to} style={{ textDecoration: "none" }}>
                <Card
                  elevation={3}
                  sx={{
                    p: 3,
                    display: "flex",
                    gap: 3,
                    alignItems: "center",
                    borderRadius: 3,
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)",
                    },
                  }}
                >
                  <Box sx={{ color: "#4f46e5" }}>{section.icon}</Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#3730a3", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {section.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Gestionar {section.name.toLowerCase()}
                    </Typography>
                  </Box>
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

import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Button,
  Container,
} from '@mui/material';
import {
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  EmojiEvents as AchievementsIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import des composants des onglets
import ProfileTab from './ProfileTab';
import StatisticsTab from './StatisticsTab';
import AchievementsTab from './AchievementsTab';
import SettingsTab from './SettingsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const ProfileTabs: React.FC = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: 'Profil',
      icon: PersonIcon,
      component: ProfileTab,
    },
    {
      label: 'Statistiques',
      icon: AnalyticsIcon,
      component: StatisticsTab,
    },
    {
      label: 'Réussites',
      icon: AchievementsIcon,
      component: AchievementsTab,
    },
    {
      label: 'Paramètres',
      icon: SettingsIcon,
      component: SettingsTab,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header avec bouton retour */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 0.5 }} // Ajustement vertical pour aligner avec le titre
        ></Button>
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: 'primary.main',
              mb: 0.5,
              fontFamily: '"Chau Philomene One", cursive',
            }}
          >
            Profil
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gérez votre profil et vos paramètres
          </Typography>
        </Box>
      </Box>

      {/* Tabs Navigation */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          bgcolor: 'background.paper',
          border: 'none',
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="profile tabs"
          variant="scrollable" // Changé de fullWidth à scrollable
          scrollButtons="auto"
          allowScrollButtonsMobile // Permet les boutons de scroll sur mobile
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              py: 2.5,
              px: { xs: 1, sm: 2 }, // Padding adaptatif
              minHeight: 'auto',
              minWidth: { xs: 80, sm: 120 }, // Largeur minimale adaptative
              fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Taille de police adaptative
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              color: 'error.main',
            },
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={<tab.icon sx={{ fontSize: { xs: 20, sm: 24 } }} />} // Taille d'icône adaptative
              iconPosition="start"
              {...a11yProps(index)}
              sx={{
                gap: { xs: 0.5, sm: 1 }, // Espacement adaptatif
                flexDirection: { xs: 'column', sm: 'row' }, // Direction adaptative
                '& .MuiSvgIcon-root': {
                  mb: { xs: 0.5, sm: 0 }, // Marge bottom adaptative
                  color: 'error.main',
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          <tab.component />
        </TabPanel>
      ))}
    </Container>
  );
};

export default ProfileTabs;

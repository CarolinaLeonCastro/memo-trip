import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, IconButton, Paper } from '@mui/material';
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

  const handleBack = () => {
    navigate(-1);
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
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header avec bouton retour */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            mr: 2,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
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
            Mon Profil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos informations personnelles et préférences
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
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              py: 2.5,
              minHeight: 'auto',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              color: 'error.main',
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={<tab.icon sx={{ fontSize: 24 }} />}
              iconPosition="start"
              {...a11yProps(index)}
              sx={{
                gap: 1,
                '& .MuiSvgIcon-root': {
                  mb: 0,
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
    </Box>
  );
};

export default ProfileTabs;

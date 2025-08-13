import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Badge,
} from '@mui/material';
import {
  Book as BookIcon,
  Place as PlaceIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';

import {
  adminService,
  type PendingContent,
} from '../../services/admin.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface JournalItem {
  _id: string;
  title: string;
  description?: string;
  user_id: {
    name: string;
    email: string;
  };
  createdAt: string;
  moderation_status: string;
}

interface PlaceItem {
  _id: string;
  name: string;
  description?: string;
  user_id: {
    name: string;
    email: string;
  };
  journal_id: {
    title: string;
  };
  createdAt: string;
  moderation_status: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`moderation-tabpanel-${index}`}
      aria-labelledby={`moderation-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ContentModeration: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingContent, setPendingContent] = useState<PendingContent | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'journal' | 'place';
    item: JournalItem | PlaceItem | null;
    action: 'approve' | 'reject';
  }>({ open: false, type: 'journal', item: null, action: 'approve' });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadPendingContent();
  }, []);

  const loadPendingContent = async () => {
    try {
      setLoading(true);
      const content = await adminService.getPendingContent('all');
      setPendingContent(content);
      setError(null);
    } catch (err) {
      console.error('Error loading pending content:', err);
      setError('Erreur lors du chargement du contenu en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const openActionDialog = (
    type: 'journal' | 'place',
    item: JournalItem | PlaceItem,
    action: 'approve' | 'reject'
  ) => {
    setActionDialog({ open: true, type, item, action });
    setRejectionReason('');
  };

  const closeActionDialog = () => {
    setActionDialog({
      open: false,
      type: 'journal',
      item: null,
      action: 'approve',
    });
    setRejectionReason('');
  };

  const getItemName = (item: JournalItem | PlaceItem): string => {
    return 'title' in item ? item.title : item.name;
  };

  const handleModeration = async () => {
    try {
      const { type, item, action } = actionDialog;

      if (!item) return;

      if (type === 'journal') {
        await adminService.moderateJournal(
          item._id,
          action,
          action === 'reject' ? rejectionReason : undefined
        );
      } else {
        await adminService.moderatePlace(
          item._id,
          action,
          action === 'reject' ? rejectionReason : undefined
        );
      }

      await loadPendingContent();
      closeActionDialog();
    } catch (err) {
      console.error('Error moderating content:', err);
      setError('Erreur lors de la modération');
    }
  };

  const JournalCard = ({ journal }: { journal: JournalItem }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar>
            <BookIcon />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" noWrap>
              {journal.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              par {journal.user_id.name}
            </Typography>
          </Box>
          <Chip label="Journal" color="primary" size="small" />
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {journal.description?.substring(0, 100)}...
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TimeIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {new Date(journal.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {journal.user_id.email}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          startIcon={<ApproveIcon />}
          color="success"
          onClick={() => openActionDialog('journal', journal, 'approve')}
        >
          Approuver
        </Button>
        <Button
          startIcon={<RejectIcon />}
          color="error"
          onClick={() => openActionDialog('journal', journal, 'reject')}
        >
          Rejeter
        </Button>
      </CardActions>
    </Card>
  );

  const PlaceCard = ({ place }: { place: PlaceItem }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar>
            <PlaceIcon />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" noWrap>
              {place.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              par {place.user_id.name}
            </Typography>
          </Box>
          <Chip label="Lieu" color="secondary" size="small" />
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {place.description?.substring(0, 100)}...
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Journal: {place.journal_id.title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TimeIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {new Date(place.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {place.user_id.email}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          startIcon={<ApproveIcon />}
          color="success"
          onClick={() => openActionDialog('place', place, 'approve')}
        >
          Approuver
        </Button>
        <Button
          startIcon={<RejectIcon />}
          color="error"
          onClick={() => openActionDialog('place', place, 'reject')}
        >
          Rejeter
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const journalsCount = pendingContent?.journals?.length || 0;
  const placesCount = pendingContent?.places?.length || 0;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Modération du contenu
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={
              <Badge badgeContent={journalsCount} color="primary">
                Journaux
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={placesCount} color="primary">
                Lieux
              </Badge>
            }
          />
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      <TabPanel value={tabValue} index={0}>
        {journalsCount === 0 ? (
          <Alert severity="info">Aucun journal en attente de modération</Alert>
        ) : (
          <Grid container spacing={3}>
            {pendingContent?.journals.map((journal) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={journal._id}>
                <JournalCard journal={journal} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {placesCount === 0 ? (
          <Alert severity="info">Aucun lieu en attente de modération</Alert>
        ) : (
          <Grid container spacing={3}>
            {pendingContent?.places.map((place) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={place._id}>
                <PlaceCard place={place} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Dialog de confirmation */}
      <Dialog
        open={actionDialog.open}
        onClose={closeActionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionDialog.action === 'approve' ? 'Approuver' : 'Rejeter'} le{' '}
          {actionDialog.type === 'journal' ? 'journal' : 'lieu'}
        </DialogTitle>
        <DialogContent>
          {actionDialog.item && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {getItemName(actionDialog.item)}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                par {actionDialog.item.user_id.name} (
                {actionDialog.item.user_id.email})
              </Typography>

              {actionDialog.action === 'reject' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Raison du rejet (optionnel)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Expliquez pourquoi ce contenu est rejeté..."
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog}>Annuler</Button>
          <Button
            onClick={handleModeration}
            variant="contained"
            color={actionDialog.action === 'approve' ? 'success' : 'error'}
          >
            {actionDialog.action === 'approve' ? 'Approuver' : 'Rejeter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentModeration;

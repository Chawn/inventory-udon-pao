'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
});

interface Project {
  id: number;
  name: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  start_date?: string;
  end_date?: string;
  status: string;
}

const statusColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  PLANNING: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const statusLabels: Record<string, string> = {
  PLANNING: 'วางแผน',
  IN_PROGRESS: 'กำลังดำเนินการ',
  COMPLETED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก',
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    latitude: 17.4139,
    longitude: 102.7872,
    start_date: '',
    end_date: '',
    status: 'PLANNING',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || '',
        location: project.location || '',
        latitude: project.latitude || 17.4139,
        longitude: project.longitude || 102.7872,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        status: project.status,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        location: '',
        latitude: 17.4139,
        longitude: 102.7872,
        start_date: '',
        end_date: '',
        status: 'PLANNING',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData({ ...formData, latitude: lat, longitude: lng });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseDialog();
        fetchProjects();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบโครงการนี้หรือไม่?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            จัดการโครงการ
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มโครงการ
          </Button>
        </Box>

        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ชื่อโครงการ</strong></TableCell>
                    <TableCell><strong>สถานที่</strong></TableCell>
                    <TableCell><strong>วันที่เริ่ม</strong></TableCell>
                    <TableCell><strong>วันที่สิ้นสุด</strong></TableCell>
                    <TableCell><strong>สถานะ</strong></TableCell>
                    <TableCell align="center"><strong>จัดการ</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">ไม่มีโครงการ</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.location || '-'}</TableCell>
                        <TableCell>{project.start_date || '-'}</TableCell>
                        <TableCell>{project.end_date || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabels[project.status]}
                            color={statusColors[project.status]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(project)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(project.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingProject ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="ชื่อโครงการ"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="รายละเอียด"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="สถานที่"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  fullWidth
                  inputProps={{ step: 0.0001 }}
                />
                <TextField
                  label="Longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  fullWidth
                  inputProps={{ step: 0.0001 }}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<PlaceIcon />}
                onClick={() => setOpenMapDialog(true)}
              >
                เลือกตำแหน่งบนแผนที่
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="วันที่เริ่ม"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="วันที่สิ้นสุด"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <TextField
                label="สถานะ"
                select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="PLANNING">วางแผน</MenuItem>
                <MenuItem value="IN_PROGRESS">กำลังดำเนินการ</MenuItem>
                <MenuItem value="COMPLETED">เสร็จสิ้น</MenuItem>
                <MenuItem value="CANCELLED">ยกเลิก</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>ยกเลิก</Button>
            <Button onClick={handleSubmit} variant="contained">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>

        {/* Map Dialog */}
        <Dialog open={openMapDialog} onClose={() => setOpenMapDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>เลือกตำแหน่งโครงการ</DialogTitle>
          <DialogContent>
            <Box sx={{ height: 500, mt: 2 }}>
              <MapComponent
                center={[formData.latitude, formData.longitude]}
                markers={[{
                  position: [formData.latitude, formData.longitude],
                  popup: 'ตำแหน่งโครงการ',
                }]}
                onMapClick={handleMapClick}
                height="500px"
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              คลิกบนแผนที่เพื่อเลือกตำแหน่ง
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMapDialog(false)} variant="contained">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

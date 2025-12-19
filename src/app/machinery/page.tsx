'use client';

import { useEffect, useState } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignIcon,
} from '@mui/icons-material';
import Layout from '@/components/Layout';

interface Machinery {
  id: number;
  code: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  year?: number;
  status: string;
  notes?: string;
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  AVAILABLE: 'success',
  IN_USE: 'warning',
  MAINTENANCE: 'error',
  OUT_OF_SERVICE: 'default',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'พร้อมใช้งาน',
  IN_USE: 'กำลังใช้งาน',
  MAINTENANCE: 'ซ่อมบำรุง',
  OUT_OF_SERVICE: 'ไม่พร้อมใช้งาน',
};

export default function MachineryPage() {
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openDialog, setOpenDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [editingMachinery, setEditingMachinery] = useState<Machinery | null>(null);
  const [assigningMachinery, setAssigningMachinery] = useState<Machinery | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'AVAILABLE',
    notes: '',
  });
  const [assignData, setAssignData] = useState({
    project_id: '',
    assigned_date: new Date().toISOString().split('T')[0],
    return_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchMachinery();
    fetchProjects();
  }, [statusFilter]);

  const fetchMachinery = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = statusFilter === 'ALL'
        ? '/api/machinery'
        : `/api/machinery?status=${statusFilter}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMachinery(data.data || []);
    } catch (error) {
      console.error('Error fetching machinery:', error);
    }
  };

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

  const handleOpenDialog = (item?: Machinery) => {
    if (item) {
      setEditingMachinery(item);
      setFormData({
        code: item.code,
        name: item.name,
        type: item.type,
        brand: item.brand || '',
        model: item.model || '',
        year: item.year || new Date().getFullYear(),
        status: item.status,
        notes: item.notes || '',
      });
    } else {
      setEditingMachinery(null);
      setFormData({
        code: '',
        name: '',
        type: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        status: 'AVAILABLE',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMachinery(null);
  };

  const handleOpenAssignDialog = (item: Machinery) => {
    setAssigningMachinery(item);
    setAssignData({
      project_id: '',
      assigned_date: new Date().toISOString().split('T')[0],
      return_date: '',
      notes: '',
    });
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
    setAssigningMachinery(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingMachinery
        ? `/api/machinery/${editingMachinery.id}`
        : '/api/machinery';
      const method = editingMachinery ? 'PUT' : 'POST';

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
        fetchMachinery();
      }
    } catch (error) {
      console.error('Error saving machinery:', error);
    }
  };

  const handleAssign = async () => {
    if (!assigningMachinery) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/machinery/${assigningMachinery.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assignData),
      });

      if (response.ok) {
        handleCloseAssignDialog();
        fetchMachinery();
      }
    } catch (error) {
      console.error('Error assigning machinery:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบเครื่องจักรนี้หรือไม่?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/machinery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchMachinery();
      }
    } catch (error) {
      console.error('Error deleting machinery:', error);
    }
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            จัดการเครื่องจักร
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มเครื่องจักร
          </Button>
        </Box>

        <Card sx={{ boxShadow: 2, mb: 3 }}>
          <Tabs
            value={statusFilter}
            onChange={(_, value) => setStatusFilter(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="ทั้งหมด" value="ALL" />
            <Tab label="พร้อมใช้งาน" value="AVAILABLE" />
            <Tab label="กำลังใช้งาน" value="IN_USE" />
            <Tab label="ซ่อมบำรุง" value="MAINTENANCE" />
            <Tab label="ไม่พร้อมใช้งาน" value="OUT_OF_SERVICE" />
          </Tabs>
        </Card>

        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>รหัส</strong></TableCell>
                    <TableCell><strong>ชื่อ</strong></TableCell>
                    <TableCell><strong>ประเภท</strong></TableCell>
                    <TableCell><strong>ยี่ห้อ</strong></TableCell>
                    <TableCell><strong>รุ่น</strong></TableCell>
                    <TableCell><strong>สถานะ</strong></TableCell>
                    <TableCell align="center"><strong>จัดการ</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {machinery.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary">ไม่มีเครื่องจักร</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    machinery.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.brand || '-'}</TableCell>
                        <TableCell>{item.model || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabels[item.status]}
                            color={statusColors[item.status]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleOpenAssignDialog(item)}
                            disabled={item.status === 'IN_USE'}
                          >
                            <AssignIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(item.id)}
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
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingMachinery ? 'แก้ไขเครื่องจักร' : 'เพิ่มเครื่องจักรใหม่'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="รหัสเครื่องจักร"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="ชื่อเครื่องจักร"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="ประเภท"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                fullWidth
                placeholder="เช่น รถแบคโฮ, รถบด, รถทำถนน"
              />
              <TextField
                label="ยี่ห้อ"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                fullWidth
              />
              <TextField
                label="รุ่น"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                fullWidth
              />
              <TextField
                label="ปี"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="สถานะ"
                select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="AVAILABLE">พร้อมใช้งาน</MenuItem>
                <MenuItem value="IN_USE">กำลังใช้งาน</MenuItem>
                <MenuItem value="MAINTENANCE">ซ่อมบำรุง</MenuItem>
                <MenuItem value="OUT_OF_SERVICE">ไม่พร้อมใช้งาน</MenuItem>
              </TextField>
              <TextField
                label="หมายเหตุ"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>ยกเลิก</Button>
            <Button onClick={handleSubmit} variant="contained">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Dialog */}
        <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
          <DialogTitle>มอบหมายเครื่องจักรเข้าโครงการ</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                เครื่องจักร: <strong>{assigningMachinery?.name}</strong>
              </Typography>
              <TextField
                label="โครงการ"
                select
                value={assignData.project_id}
                onChange={(e) => setAssignData({ ...assignData, project_id: e.target.value })}
                required
                fullWidth
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="วันที่มอบหมาย"
                type="date"
                value={assignData.assigned_date}
                onChange={(e) => setAssignData({ ...assignData, assigned_date: e.target.value })}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="วันที่คืน (ถ้ามี)"
                type="date"
                value={assignData.return_date}
                onChange={(e) => setAssignData({ ...assignData, return_date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="หมายเหตุ"
                value={assignData.notes}
                onChange={(e) => setAssignData({ ...assignData, notes: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAssignDialog}>ยกเลิก</Button>
            <Button onClick={handleAssign} variant="contained">
              มอบหมาย
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

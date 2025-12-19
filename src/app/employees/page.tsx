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
} from '@mui/icons-material';
import Layout from '@/components/Layout';

interface Employee {
  id: number;
  code: string;
  first_name: string;
  last_name: string;
  position?: string;
  phone?: string;
  team_id?: number;
}

interface Team {
  id: number;
  name: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    first_name: '',
    last_name: '',
    position: '',
    phone: '',
    team_id: '',
  });

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/teams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTeams(data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        code: employee.code,
        first_name: employee.first_name,
        last_name: employee.last_name,
        position: employee.position || '',
        phone: employee.phone || '',
        team_id: employee.team_id?.toString() || '',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        code: '',
        first_name: '',
        last_name: '',
        position: '',
        phone: '',
        team_id: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingEmployee
        ? `/api/employees/${editingEmployee.id}`
        : '/api/employees';
      const method = editingEmployee ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        team_id: formData.team_id ? parseInt(formData.team_id) : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        handleCloseDialog();
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบพนักงานนี้หรือไม่?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const getTeamName = (teamId?: number) => {
    if (!teamId) return '-';
    const team = teams.find(t => t.id === teamId);
    return team?.name || '-';
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            จัดการพนักงาน
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มพนักงาน
          </Button>
        </Box>

        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>รหัส</strong></TableCell>
                    <TableCell><strong>ชื่อ-นามสกุล</strong></TableCell>
                    <TableCell><strong>ตำแหน่ง</strong></TableCell>
                    <TableCell><strong>ทีม</strong></TableCell>
                    <TableCell><strong>เบอร์โทร</strong></TableCell>
                    <TableCell align="center"><strong>จัดการ</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">ไม่มีพนักงาน</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.code}</TableCell>
                        <TableCell>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                        <TableCell>{employee.position || '-'}</TableCell>
                        <TableCell>{getTeamName(employee.team_id)}</TableCell>
                        <TableCell>{employee.phone || '-'}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(employee)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(employee.id)}
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
            {editingEmployee ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงานใหม่'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="รหัสพนักงาน"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="ชื่อ"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="นามสกุล"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  fullWidth
                />
              </Box>
              <TextField
                label="ตำแหน่ง"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                fullWidth
              />
              <TextField
                label="เบอร์โทร"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
              />
              <TextField
                label="ทีม"
                select
                value={formData.team_id}
                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                fullWidth
              >
                <MenuItem value="">ไม่ระบุ</MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
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
      </Box>
    </Layout>
  );
}

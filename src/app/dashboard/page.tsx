'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  FolderOpen,
  Construction,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';

// Dynamic import สำหรับ Map component (ป้องกัน SSR issues)
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => <Box sx={{ height: 400, bgcolor: 'grey.200', borderRadius: 2 }} />,
});

interface Stats {
  totalProjects: number;
  totalMachinery: number;
  inUseMachinery: number;
  availableMachinery: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalMachinery: 0,
    inUseMachinery: 0,
    availableMachinery: 0,
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [activeMachinery, setActiveMachinery] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Fetch projects
      const projectsRes = await fetch('/api/projects', { headers });
      const projectsData = await projectsRes.json();
      setProjects(projectsData.data || []);

      // Fetch machinery
      const machineryRes = await fetch('/api/machinery', { headers });
      const machineryData = await machineryRes.json();
      const machinery = machineryData.data || [];

      // Calculate stats
      setStats({
        totalProjects: projectsData.data?.length || 0,
        totalMachinery: machinery.length,
        inUseMachinery: machinery.filter((m: any) => m.status === 'IN_USE').length,
        availableMachinery: machinery.filter((m: any) => m.status === 'AVAILABLE').length,
      });

      // Get active machinery
      setActiveMachinery(machinery.filter((m: any) => m.status === 'IN_USE'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const statCards = [
    { title: 'โครงการทั้งหมด', value: stats.totalProjects, icon: <FolderOpen />, color: '#1976d2' },
    { title: 'เครื่องจักรทั้งหมด', value: stats.totalMachinery, icon: <Construction />, color: '#2e7d32' },
    { title: 'กำลังใช้งาน', value: stats.inUseMachinery, icon: <PlayArrow />, color: '#ed6c02' },
    { title: 'พร้อมใช้งาน', value: stats.availableMachinery, icon: <CheckCircle />, color: '#0288d1' },
  ];

  const projectMarkers = projects
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      position: [p.latitude, p.longitude] as [number, number],
      popup: `<strong>${p.name}</strong><br/>${p.location || ''}`,
    }));

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Dashboard
        </Typography>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {statCards.map((stat, index) => (
            <Card key={index} sx={{ boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: stat.color,
                      color: 'white',
                      p: 1,
                      borderRadius: 2,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Map */}
        <Card sx={{ mb: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              แผนที่โครงการ
            </Typography>
            <MapComponent markers={projectMarkers} height="500px" />
          </CardContent>
        </Card>

        {/* Active Machinery Table */}
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              เครื่องจักรที่กำลังใช้งาน
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>รหัส</strong></TableCell>
                    <TableCell><strong>ชื่อ</strong></TableCell>
                    <TableCell><strong>ประเภท</strong></TableCell>
                    <TableCell><strong>ยี่ห้อ</strong></TableCell>
                    <TableCell><strong>สถานะ</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeMachinery.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">ไม่มีเครื่องจักรที่กำลังใช้งาน</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeMachinery.map((machinery) => (
                      <TableRow key={machinery.id}>
                        <TableCell>{machinery.code}</TableCell>
                        <TableCell>{machinery.name}</TableCell>
                        <TableCell>{machinery.type}</TableCell>
                        <TableCell>{machinery.brand || '-'}</TableCell>
                        <TableCell>
                          <Chip label="กำลังใช้งาน" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}

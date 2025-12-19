'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  ExpandLess,
  ExpandMore,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  AccountCircle,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const drawerWidth = 260;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    href: '/app',
  },
  {
    text: 'Users',
    icon: <PeopleIcon />,
    href: '/app/users',
  },
  {
    text: 'Resources',
    icon: <FolderIcon />,
    href: '/app/resources',
    children: [
      {
        text: 'Documents',
        icon: <DescriptionIcon />,
        href: '/app/resources/documents',
      },
      {
        text: 'Images',
        icon: <ImageIcon />,
        href: '/app/resources/images',
      },
    ],
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    href: '/app/settings',
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<{
    [key: string]: boolean;
  }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Mock user data
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corporation',
    avatar: 'JD',
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleUserMenuClose();
    // Sign out logic will go here
    console.log('Sign out clicked');
  };

  const handleGoToSettings = () => {
    handleUserMenuClose();
    // Navigate to settings
    console.log('Go to settings clicked');
  };

  const handleCollapsibleClick = (text: string) => {
    setOpenCollapsible((prev) => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <Box key={item.text}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleCollapsibleClick(item.text)} sx={{ pl: 2 + depth * 2 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {openCollapsible[item.text] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openCollapsible[item.text]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={item.text} disablePadding>
        <ListItemButton component={Link} href={item.href} sx={{ pl: 2 + depth * 2 }}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          App Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>{navItems.map((item) => renderNavItem(item))}</List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard Header
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              sx={{
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {mockUser.name}
            </Typography>
            <IconButton size="large" edge="end" onClick={handleUserMenuOpen} color="inherit">
              <AccountCircle />
            </IconButton>
          </Box>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: { minWidth: 250 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{mockUser.avatar}</Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {mockUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mockUser.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mockUser.company}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ mt: 1 }}>
              <MenuItem onClick={handleGoToSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
              </MenuItem>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

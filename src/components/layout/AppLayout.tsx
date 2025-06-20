import React, { useState } from 'react';
import { Layout, Menu, Button, Input, Avatar, Dropdown, Space } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppSelector';
import { logout } from '@/store/slices/authSlice';
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  Search,
  Kanban,
  Calendar as GanttIcon
} from 'lucide-react';

const { Header, Sider, Content } = Layout;
const { Search: AntdSearch } = Input;

interface AppLayoutProps {
  children: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, searchValue = '', onSearchChange, searchPlaceholder = 'Search...' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    { name: 'Task List', href: '/task-list', icon: CheckSquare },
    { name: 'Kanban Board', href: '/kanban', icon: Kanban },
    { name: 'Gantt Chart', href: '/gantt', icon: GanttIcon },
    { name: 'Team', href: '/admin/team-management', icon: Users },
    { name: 'Settings', href: '/admin/system-settings', icon: Settings },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={256} style={{ backgroundColor: '#fff' }}>
        <div className="demo-logo-vertical" style={{ height: '64px', margin: '16px', color: '#fff', fontSize: '20px', textAlign: 'center' }}>
          {/* Replace with your logo */}
          <img src="/logo.png" alt="Logo" style={{ height: '100%', width: 'auto' }} />
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
          {sidebarItems.map((item) => (
            <Menu.Item key={item.name} icon={React.createElement(item.icon)} >
              <Link to={item.href}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggle}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {onSearchChange && (
            <div style={{ flex: 1, marginLeft: '24px', marginRight: '24px' }}>
              <AntdSearch
                placeholder={searchPlaceholder}
                allowClear
                enterButton="Search"
                size="large"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onSearch={onSearch}
              />
            </div>
          )}
          <Dropdown overlay={menu} trigger={['click']}>
            <Space direction="horizontal" size="middle" style={{ paddingRight: 24, cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.username}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

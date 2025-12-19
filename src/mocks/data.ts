import type { App, GraphData, NodeStatus, NodeType, TableSchema, TableRow } from '@/types';

export const mockApps: App[] = [
  {
    id: 'app-1',
    name: 'E-Commerce Platform',
    description: 'Main shopping application',
    nodeCount: 4,
  },
  {
    id: 'app-2',
    name: 'Payment Gateway',
    description: 'Payment processing service',
    nodeCount: 3,
  },
  {
    id: 'app-3',
    name: 'Analytics Dashboard',
    description: 'Data visualization app',
    nodeCount: 5,
  },
];

// Database tables with schemas
export const mockTables: TableSchema[] = [
  {
    id: 'table-1',
    name: 'users',
    columns: [
      { name: 'id', type: 'uuid', primaryKey: true, nullable: false },
      { name: 'email', type: 'varchar(255)', primaryKey: false, nullable: false },
      { name: 'name', type: 'varchar(100)', primaryKey: false, nullable: true },
      { name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false },
    ],
    rowCount: 1250,
    size: '2.3 MB',
  },
  {
    id: 'table-2',
    name: 'orders',
    columns: [
      { name: 'id', type: 'uuid', primaryKey: true, nullable: false },
      { name: 'user_id', type: 'uuid', primaryKey: false, nullable: false },
      { name: 'total', type: 'decimal(10,2)', primaryKey: false, nullable: false },
      { name: 'status', type: 'varchar(50)', primaryKey: false, nullable: false },
      { name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false },
    ],
    rowCount: 8420,
    size: '12.1 MB',
  },
  {
    id: 'table-3',
    name: 'products',
    columns: [
      { name: 'id', type: 'uuid', primaryKey: true, nullable: false },
      { name: 'name', type: 'varchar(200)', primaryKey: false, nullable: false },
      { name: 'price', type: 'decimal(10,2)', primaryKey: false, nullable: false },
      { name: 'stock', type: 'integer', primaryKey: false, nullable: false },
      { name: 'category', type: 'varchar(100)', primaryKey: false, nullable: true },
    ],
    rowCount: 340,
    size: '850 KB',
  },
  {
    id: 'table-4',
    name: 'sessions',
    columns: [
      { name: 'id', type: 'uuid', primaryKey: true, nullable: false },
      { name: 'user_id', type: 'uuid', primaryKey: false, nullable: false },
      { name: 'token', type: 'varchar(500)', primaryKey: false, nullable: false },
      { name: 'expires_at', type: 'timestamp', primaryKey: false, nullable: false },
    ],
    rowCount: 15000,
    size: '5.2 MB',
  },
];

// Mock table data
export const mockTableData: Record<string, TableRow[]> = {
  'table-1': [
    { id: 'u1', email: 'john@example.com', name: 'John Doe', created_at: '2024-01-15T10:30:00Z' },
    { id: 'u2', email: 'jane@example.com', name: 'Jane Smith', created_at: '2024-01-16T14:20:00Z' },
    { id: 'u3', email: 'bob@example.com', name: 'Bob Wilson', created_at: '2024-01-17T09:15:00Z' },
    { id: 'u4', email: 'alice@example.com', name: 'Alice Brown', created_at: '2024-01-18T16:45:00Z' },
  ],
  'table-2': [
    { id: 'o1', user_id: 'u1', total: 299.99, status: 'completed', created_at: '2024-01-20T11:00:00Z' },
    { id: 'o2', user_id: 'u2', total: 149.50, status: 'pending', created_at: '2024-01-21T13:30:00Z' },
    { id: 'o3', user_id: 'u1', total: 89.00, status: 'shipped', created_at: '2024-01-22T10:45:00Z' },
  ],
  'table-3': [
    { id: 'p1', name: 'Wireless Headphones', price: 79.99, stock: 150, category: 'Electronics' },
    { id: 'p2', name: 'USB-C Cable', price: 12.99, stock: 500, category: 'Accessories' },
    { id: 'p3', name: 'Laptop Stand', price: 49.99, stock: 75, category: 'Office' },
  ],
  'table-4': [
    { id: 's1', user_id: 'u1', token: 'tok_abc123...', expires_at: '2024-02-15T10:30:00Z' },
    { id: 's2', user_id: 'u2', token: 'tok_def456...', expires_at: '2024-02-16T14:20:00Z' },
  ],
};

export const mockGraphs: Record<string, GraphData> = {
  'app-1': {
    nodes: [
      {
        id: 'node-1',
        type: 'serviceNode',
        position: { x: 100, y: 100 },
        data: {
          label: 'API Gateway',
          description: 'Main entry point for all requests',
          status: 'healthy' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 75,
        },
      },
      {
        id: 'node-2',
        type: 'serviceNode',
        position: { x: 350, y: 50 },
        data: {
          label: 'Product Service',
          description: 'Handles product catalog',
          status: 'healthy' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 50,
        },
      },
      {
        id: 'node-3',
        type: 'serviceNode',
        position: { x: 350, y: 200 },
        data: {
          label: 'Order Service',
          description: 'Manages customer orders',
          status: 'degraded' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 30,
        },
      },
      {
        id: 'node-4',
        type: 'databaseNode',
        position: { x: 600, y: 125 },
        data: {
          label: 'PostgreSQL',
          description: 'Primary database',
          status: 'healthy' as NodeStatus,
          type: 'database' as NodeType,
          configValue: 85,
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
      { id: 'e1-3', source: 'node-1', target: 'node-3', animated: true },
      { id: 'e2-4', source: 'node-2', target: 'node-4' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  'app-2': {
    nodes: [
      {
        id: 'node-1',
        type: 'serviceNode',
        position: { x: 100, y: 150 },
        data: {
          label: 'Payment API',
          description: 'Payment processing endpoint',
          status: 'healthy' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 90,
        },
      },
      {
        id: 'node-2',
        type: 'serviceNode',
        position: { x: 350, y: 100 },
        data: {
          label: 'Stripe Integration',
          description: 'Stripe payment gateway',
          status: 'healthy' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 65,
        },
      },
      {
        id: 'node-3',
        type: 'databaseNode',
        position: { x: 350, y: 250 },
        data: {
          label: 'Transaction DB',
          description: 'Transaction records',
          status: 'down' as NodeStatus,
          type: 'database' as NodeType,
          configValue: 0,
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
      { id: 'e1-3', source: 'node-1', target: 'node-3' },
    ],
  },
  'app-3': {
    nodes: [
      {
        id: 'node-1',
        type: 'serviceNode',
        position: { x: 100, y: 150 },
        data: {
          label: 'Data Ingestion',
          description: 'Collects analytics data',
          status: 'healthy' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 80,
        },
      },
      {
        id: 'node-2',
        type: 'serviceNode',
        position: { x: 300, y: 50 },
        data: {
          label: 'Processing Engine',
          description: 'Transforms raw data',
          status: 'degraded' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 45,
        },
      },
      {
        id: 'node-3',
        type: 'serviceNode',
        position: { x: 300, y: 250 },
        data: {
          label: 'Aggregation Service',
          description: 'Aggregates metrics',
          status: 'healthy' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 70,
        },
      },
      {
        id: 'node-4',
        type: 'databaseNode',
        position: { x: 500, y: 150 },
        data: {
          label: 'TimescaleDB',
          description: 'Time-series database',
          status: 'healthy' as NodeStatus,
          type: 'database' as NodeType,
          configValue: 95,
        },
      },
      {
        id: 'node-5',
        type: 'serviceNode',
        position: { x: 700, y: 150 },
        data: {
          label: 'Visualization API',
          description: 'Chart generation service',
          status: 'healthy' as NodeStatus,
          type: 'service' as NodeType,
          configValue: 60,
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
      { id: 'e1-3', source: 'node-1', target: 'node-3', animated: true },
      { id: 'e2-4', source: 'node-2', target: 'node-4' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
      { id: 'e4-5', source: 'node-4', target: 'node-5', animated: true },
    ],
  },
};

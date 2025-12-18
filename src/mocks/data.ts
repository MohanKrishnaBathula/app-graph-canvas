import type { App, GraphData, NodeStatus, NodeType } from '@/types';

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

import type { Node, Edge } from '@xyflow/react';

export type NodeStatus = 'healthy' | 'degraded' | 'down';

export type NodeType = 'service' | 'database';

export interface ServiceNodeData {
  label: string;
  description?: string;
  status: NodeStatus;
  type: NodeType;
  configValue: number;
  [key: string]: unknown;
}

export type ServiceNode = Node<ServiceNodeData>;

export interface App {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
}

export interface GraphData {
  nodes: ServiceNode[];
  edges: Edge[];
}

export type InspectorTab = 'config' | 'runtime';

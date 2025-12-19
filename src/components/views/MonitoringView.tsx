import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const metrics = [
  { label: 'Uptime', value: '99.9%', icon: CheckCircle, color: 'text-green-400' },
  { label: 'Response Time', value: '45ms', icon: Clock, color: 'text-blue-400' },
  { label: 'Requests/min', value: '2.4k', icon: Activity, color: 'text-primary' },
  { label: 'Errors', value: '0.02%', icon: AlertTriangle, color: 'text-yellow-400' },
];

const logs = [
  { time: '12:45:32', level: 'info', message: 'User authentication successful', service: 'auth-service' },
  { time: '12:45:28', level: 'info', message: 'Database query completed in 12ms', service: 'db-service' },
  { time: '12:45:15', level: 'warn', message: 'High latency detected on /api/orders', service: 'api-gateway' },
  { time: '12:44:58', level: 'info', message: 'Cache hit ratio: 94%', service: 'cache-service' },
  { time: '12:44:42', level: 'error', message: 'Connection timeout to external API', service: 'payment-service' },
  { time: '12:44:30', level: 'info', message: 'Health check passed', service: 'all' },
];

export function MonitoringView() {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Monitoring</h1>
        <p className="text-muted-foreground">Real-time system health and logs</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                {metric.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>Live system activity feed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">{log.time}</span>
                <span className={`uppercase text-xs px-1.5 py-0.5 rounded ${
                  log.level === 'error' ? 'bg-red-500/20 text-red-400' :
                  log.level === 'warn' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {log.level}
                </span>
                <span className="text-muted-foreground">[{log.service}]</span>
                <span className="text-foreground flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

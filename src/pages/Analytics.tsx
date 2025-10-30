import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { ChartWidget } from '@/components/ChartWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const Analytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: mockApi.getAnalytics,
  });

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <Loader text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into trending topics and top-rated resources
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Topic Weights Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ChartWidget
            title="Topic Importance Heatmap"
            description="Topics ranked by importance score"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topic_weights}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="topic_name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="weight" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWidget>
        </motion.div>

        {/* Top Resources Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Resources</CardTitle>
              <CardDescription>Most helpful resources according to student ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.top_resources.map((resource, index) => (
                  <div
                    key={resource.resource_id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{resource.title}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      ⭐ {resource.rating_avg.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

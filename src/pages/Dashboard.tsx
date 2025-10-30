import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, TrendingUp, Users } from 'lucide-react';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceDetailModal } from '@/components/ResourceDetailModal';
import { TopicCard } from '@/components/TopicCard';
import { Loader } from '@/components/Loader';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Resource } from '@/lib/mockApi';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userRatedResources, setUserRatedResources] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['resources', 'recent'],
    queryFn: () => mockApi.getResources(undefined, 'recent'),
  });

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics', 'important'],
    queryFn: () => mockApi.getImportantTopics(),
  });

  const rateResourceMutation = useMutation({
    mutationFn: ({ resourceId, rating }: { resourceId: string; rating: number }) =>
      mockApi.rateResource(resourceId, rating, user?.user_id || 'u1'),
    onSuccess: (data, variables) => {
      setUserRatedResources((prev) => new Set(prev).add(variables.resourceId));
      
      // Update the selected resource with new rating
      if (selectedResource && selectedResource.resource_id === variables.resourceId) {
        setSelectedResource({
          ...selectedResource,
          rating_avg: data.new_avg_rating
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      
      if (data.is_new_rating) {
        toast.success(`Rating submitted! New average: ${data.new_avg_rating.toFixed(1)}/5`);
      } else {
        toast.success(`Rating updated! New average: ${data.new_avg_rating.toFixed(1)}/5`);
      }
    },
    onError: () => {
      toast.error('Failed to submit rating');
    },
  });

  const handleRate = (resourceId: string, rating: number) => {
    rateResourceMutation.mutate({ resourceId, rating });
  };

  const stats = [
    { label: 'Total Subjects', value: '6', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Resources', value: resources?.length.toString() || '0', icon: FileText, color: 'text-purple-600' },
    { label: 'Important Topics', value: topics?.length.toString() || '0', icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Contributors', value: '24', icon: Users, color: 'text-green-600' },
  ];

  return (
    <div className="container py-8 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your academic overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Resources */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Uploads</h2>
        {resourcesLoading ? (
          <Loader text="Loading resources..." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources?.slice(0, 3).map((resource) => (
              <ResourceCard 
                key={resource.resource_id} 
                resource={resource}
                onClick={() => setSelectedResource(resource)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Topics */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Topics</h2>
        {topicsLoading ? (
          <Loader text="Loading topics..." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics?.slice(0, 3).map((topic) => (
              <TopicCard key={`${topic.topic_name}-${topic.subject_code}`} topic={topic} />
            ))}
          </div>
        )}
      </div>

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        onRate={handleRate}
        hasRated={selectedResource ? userRatedResources.has(selectedResource.resource_id) : false}
      />
    </div>
  );
};

export default Dashboard;

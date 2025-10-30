import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceDetailModal } from '@/components/ResourceDetailModal';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Resource } from '@/lib/mockApi';
import { useAuth } from '@/contexts/AuthContext';

const Resources = () => {
  const [searchParams] = useSearchParams();
  const topicName = searchParams.get('topic');
  const subjectFilter = searchParams.get('subject');
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<'top' | 'recent'>('top');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userRatedResources, setUserRatedResources] = useState<Set<string>>(new Set());
  const [userMarkedTopics, setUserMarkedTopics] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources', topicName, subjectFilter, sortBy],
    queryFn: () => mockApi.getResources(topicName || undefined, sortBy, subjectFilter || undefined),
  });

  // Apply rating filter
  const filteredResources = resources?.filter((r) => {
    if (ratingFilter === 'high') return r.rating_avg >= 4;
    if (ratingFilter === 'medium') return r.rating_avg >= 3 && r.rating_avg < 4;
    if (ratingFilter === 'low') return r.rating_avg < 3;
    return true;
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

  const markTopicImportantMutation = useMutation({
    mutationFn: ({ topicName, subjectCode }: { topicName: string; subjectCode: string }) =>
      mockApi.markTopicImportant(topicName, subjectCode, user?.user_id || 'u1'),
    onSuccess: (data, variables) => {
      const key = `${variables.topicName}-${variables.subjectCode}`;
      if (data.already_marked) {
        toast.info('You have already marked this topic as important');
      } else {
        setUserMarkedTopics((prev) => new Set(prev).add(key));
        toast.success('Topic marked as important!');
      }
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    onError: () => {
      toast.error('Failed to mark topic as important');
    },
  });

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleCloseModal = () => {
    setSelectedResource(null);
  };

  const handleRate = (resourceId: string, rating: number) => {
    rateResourceMutation.mutate({ resourceId, rating });
  };

  const handleMarkImportant = (topicName: string, subjectCode: string) => {
    markTopicImportantMutation.mutate({ topicName, subjectCode });
  };

  const breadcrumbs = [
    { label: 'Subjects', href: '/subjects' },
    ...(topicName ? [{ label: topicName }] : []),
  ];

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <Loader text="Loading resources..." />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 space-y-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            {topicName ? `Resources: ${topicName}` : 'All Resources'}
          </h1>
          <p className="text-muted-foreground">
            {filteredResources?.length || 0} resource{filteredResources?.length !== 1 ? 's' : ''} available
          </p>
        </motion.div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: 'top' | 'recent') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top Rated</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="high">High Rating (≥4.0)</SelectItem>
              <SelectItem value="medium">Medium Rating (3.0-4.0)</SelectItem>
              <SelectItem value="low">Low Rating (&lt;3.0)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredResources && filteredResources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.resource_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ResourceCard
                resource={resource}
                onClick={() => handleResourceClick(resource)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No resources found"
          description={
            topicName
              ? 'No resources available for this topic yet. Be the first to contribute!'
              : 'Start browsing topics to find resources'
          }
        />
      )}

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={handleCloseModal}
        onRate={handleRate}
        onMarkImportant={handleMarkImportant}
        hasRated={selectedResource ? userRatedResources.has(selectedResource.resource_id) : false}
        hasMarkedImportant={selectedResource ? userMarkedTopics.has(`${selectedResource.topic_name}-${selectedResource.subject_code}`) : false}
      />
    </div>
  );
};

export default Resources;

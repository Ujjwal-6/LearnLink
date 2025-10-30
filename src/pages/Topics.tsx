import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { TopicCard } from '@/components/TopicCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const Topics = () => {
  const [searchParams] = useSearchParams();
  const subjectCode = searchParams.get('subject');
  const sortParam = searchParams.get('sort');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics', subjectCode],
    queryFn: () => mockApi.getTopics(subjectCode || undefined),
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: mockApi.getSubjects,
  });

  const markImportantMutation = useMutation({
    mutationFn: ({ topicName, subjectCode }: { topicName: string; subjectCode: string }) =>
      mockApi.markTopicImportant(topicName, subjectCode, user?.user_id || 'u1'),
    onSuccess: (data) => {
      if (data.already_marked) {
        toast.info('You have already marked this topic as important');
      } else {
        toast.success('Topic marked as important!');
      }
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    onError: () => {
      toast.error('Failed to mark topic as important');
    },
  });

  const currentSubject = subjects?.find((s) => s.subject_code === subjectCode);

  const breadcrumbs = [
    { label: 'Subjects', href: '/subjects' },
    ...(currentSubject ? [{ label: currentSubject.subject_name }] : []),
  ];

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <Loader text="Loading topics..." />
      </div>
    );
  }

  // Apply client-side sorting when requested (backend does not support topic sorting params)
  let displayedTopics = topics || [];
  if (sortParam === 'importance') {
    displayedTopics = [...displayedTopics].sort((a, b) => b.importance_score - a.importance_score);
  }

  // Apply importance filter
  if (importanceFilter === 'high') {
    displayedTopics = displayedTopics.filter((t) => t.importance_score >= 7);
  } else if (importanceFilter === 'medium') {
    displayedTopics = displayedTopics.filter((t) => t.importance_score >= 4 && t.importance_score < 7);
  } else if (importanceFilter === 'low') {
    displayedTopics = displayedTopics.filter((t) => t.importance_score < 4);
  }

  return (
    <div className="container py-8 px-4 space-y-6">
      <Breadcrumbs items={breadcrumbs} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">
          {currentSubject ? currentSubject.subject_name : 'All Topics'}
        </h1>
        <p className="text-muted-foreground">
          {currentSubject ? `Topics for ${currentSubject.subject_code}` : 'Browse all available topics'}
        </p>
      </motion.div>

      {/* Importance Filter */}
      <div className="flex gap-4 sm:items-center">
        <Select value={importanceFilter} onValueChange={setImportanceFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by importance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="high">High Importance (≥7)</SelectItem>
            <SelectItem value="medium">Medium Importance (4-7)</SelectItem>
            <SelectItem value="low">Low Importance (&lt;4)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {displayedTopics && displayedTopics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedTopics.map((topic, index) => (
            <motion.div
              key={`${topic.topic_name}-${topic.subject_code}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TopicCard
                topic={topic}
                onMarkImportant={(topicName, subjectCode) =>
                  markImportantMutation.mutate({ topicName, subjectCode })
                }
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No topics found"
          description={
            subjectCode
              ? 'No topics available for this subject yet'
              : 'Start by selecting a subject to view its topics'
          }
        />
      )}
    </div>
  );
};

export default Topics;

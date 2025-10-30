import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { TopicCard } from '@/components/TopicCard';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ImportantTopics = () => {
  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics', 'important'],
    queryFn: mockApi.getImportantTopics,
  });

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <Loader text="Loading important topics..." />
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
        <h1 className="text-3xl font-bold mb-2">Important Topics</h1>
        <p className="text-muted-foreground">
          High-priority topics flagged by students and instructors for exam preparation
        </p>
      </motion.div>

      {topics && topics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, index) => (
            <motion.div
              key={`${topic.topic_name}-${topic.subject_code}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TopicCard topic={topic} showImportanceScore />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No important topics yet"
          description="Topics flagged as important by the community will appear here"
        />
      )}
    </div>
  );
};

export default ImportantTopics;

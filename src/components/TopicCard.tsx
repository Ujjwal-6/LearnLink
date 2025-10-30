import { Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Topic } from '@/lib/mockApi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface TopicCardProps {
  topic: Topic;
  onMarkImportant?: (topicName: string, subjectCode: string) => void;
  showImportanceScore?: boolean;
}

export const TopicCard = ({ topic, onMarkImportant, showImportanceScore = true }: TopicCardProps) => {
  const isHighImportance = topic.importance_score >= 8.5;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg">{topic.topic_name}</CardTitle>
              <CardDescription>{topic.subject_code}</CardDescription>
            </div>
            {isHighImportance && (
              <Badge variant="default" className="bg-warning text-warning-foreground">
                <Star className="mr-1 h-3 w-3" />
                Hot
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showImportanceScore && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Importance: <span className="font-semibold text-foreground">{topic.importance_score.toFixed(1)}/10</span>
              </span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <Link to={`/resources?topic=${encodeURIComponent(topic.topic_name)}`}>
                View Resources
              </Link>
            </Button>
            {onMarkImportant && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onMarkImportant(topic.topic_name, topic.subject_code)}
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

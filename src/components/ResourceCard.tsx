import { FileText, Video, FileQuestion, BookOpen, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RatingStars } from './RatingStars';
import { Resource } from '@/lib/mockApi';
import { motion } from 'framer-motion';

interface ResourceCardProps {
  resource: Resource;
  onRate?: (resourceId: string, rating: number) => void;
  onClick?: () => void;
}

const resourceIcons = {
  note: FileText,
  video: Video,
  past_paper: FileQuestion,
  tutorial: BookOpen,
};

const resourceColors = {
  note: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  video: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  past_paper: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  tutorial: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
};

export const ResourceCard = ({ resource, onRate, onClick }: ResourceCardProps) => {
  const Icon = resourceIcons[resource.resource_type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className={`rounded-lg p-2 ${resourceColors[resource.resource_type]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {resource.resource_type.replace('_', ' ')}
            </Badge>
          </div>
          <CardTitle className="line-clamp-1">{resource.title}</CardTitle>
          <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Topic: {resource.topic_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>By: {resource.uploaded_by.username}</span>
            </div>
            <RatingStars
              rating={resource.rating_avg}
              onRate={onRate ? (rating) => onRate(resource.resource_id, rating) : undefined}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {resource.file_path && (
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './RatingStars';
import { Resource } from '@/lib/mockApi';
import { FileText, Video, FileQuestion, BookOpen, Download, Eye, Star, X } from 'lucide-react';
import { toast } from 'sonner';

interface ResourceDetailModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onRate?: (resourceId: string, rating: number) => void;
  onMarkImportant?: (topicName: string, subjectCode: string) => void;
  hasRated?: boolean;
  hasMarkedImportant?: boolean;
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

export const ResourceDetailModal = ({
  resource,
  isOpen,
  onClose,
  onRate,
  onMarkImportant,
  hasRated = false,
  hasMarkedImportant = false,
}: ResourceDetailModalProps) => {
  if (!resource) return null;

  const Icon = resourceIcons[resource.resource_type];

  const handleRate = (rating: number) => {
    // Allow users to rate or update their rating anytime
    onRate?.(resource.resource_id, rating);
    // Toast is now handled by the parent mutation's onSuccess
  };

  const handleMarkImportant = () => {
    if (!hasMarkedImportant) {
      onMarkImportant?.(resource.topic_name, resource.subject_code);
      // Toast is now handled by the parent mutation's onSuccess
    } else {
      toast.info('You have already marked this topic as important');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={`rounded-lg p-2 ${resourceColors[resource.resource_type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl mb-1">{resource.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {resource.description}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resource Metadata */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <Badge variant="secondary">
                {resource.resource_type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Subject</p>
              <p className="font-medium">{resource.subject_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Topic</p>
              <p className="font-medium">{resource.topic_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Uploaded by</p>
              <p className="font-medium">{resource.uploaded_by.username}</p>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-2">Rate This Resource</p>
              <p className="text-sm text-muted-foreground mb-3">
                {hasRated 
                  ? 'Click stars to update your rating' 
                  : 'Click stars to rate (you can change it anytime)'}
              </p>
            </div>
            <RatingStars
              rating={resource.rating_avg}
              onRate={handleRate}
            />
            <div className="text-xs text-muted-foreground">
              Average rating: {resource.rating_avg.toFixed(1)}/5
            </div>
          </div>

          {/* Important Topic Section */}
          <div className="space-y-3 pt-4 border-t">
            <div>
              <p className="font-semibold mb-2">Mark Topic as Important</p>
              <p className="text-sm text-muted-foreground mb-3">
                {hasMarkedImportant 
                  ? '✓ You have marked this topic as important' 
                  : 'Flag this topic as important for exam preparation (one flag per user per topic)'}
              </p>
            </div>
            <Button
              onClick={handleMarkImportant}
              disabled={hasMarkedImportant}
              variant={hasMarkedImportant ? 'secondary' : 'default'}
              className="w-full"
            >
              <Star className={`mr-2 h-4 w-4 ${hasMarkedImportant ? 'fill-current' : ''}`} />
              {hasMarkedImportant ? 'Already Marked as Important' : 'Mark as Important'}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {resource.file_path && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  window.open(`http://localhost:5001${resource.file_path}`, '_blank');
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            )}
            {resource.video_url && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  window.open(resource.video_url || '', '_blank');
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Watch Video
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceDetailModal } from '@/components/ResourceDetailModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { User, Upload, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Resource } from '@/lib/mockApi';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userRatedResources, setUserRatedResources] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => mockApi.getProfile(userId || currentUser?.user_id || 'u1'),
  });

  const rateResourceMutation = useMutation({
    mutationFn: ({ resourceId, rating }: { resourceId: string; rating: number }) =>
      mockApi.rateResource(resourceId, rating, currentUser?.user_id || 'u1'),
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
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
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

  console.log('Profile component:', { userId, profile, isLoading, error });

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <Loader text="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 px-4">
        <EmptyState 
          icon={User} 
          title="Error loading profile" 
          description={`Error: ${error instanceof Error ? error.message : 'Unknown error'}`} 
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8 px-4">
        <EmptyState icon={User} title="User not found" description="This user profile does not exist" />
      </div>
    );
  }

  const averageRating = profile.uploads_count > 0
    ? (profile.total_ratings / profile.uploads_count).toFixed(1)
    : '0.0';

  return (
    <div className="container py-8 px-4 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-1">{profile.username}</CardTitle>
                <CardDescription className="mb-2">
                  {/* User role and additional info */}
                  {profile.role === 'student' && profile.semester ? (
                    <span>Student • Year {Math.ceil(profile.semester / 2)} Sem {profile.semester % 2 === 0 ? 2 : 1}</span>
                  ) : profile.role === 'professor' && profile.specialization ? (
                    <span>Professor • {profile.specialization}</span>
                  ) : (
                    <span>Member since 2024</span>
                  )}
                </CardDescription>
                {profile.bio && (
                  <CardDescription className="mb-2 text-xs italic">
                    {profile.bio}
                  </CardDescription>
                )}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary">
                    <Upload className="mr-1 h-3 w-3" />
                    {profile.uploads_count} uploads
                  </Badge>
                  <Badge variant="secondary">
                    <Star className="mr-1 h-3 w-3" />
                    {averageRating} avg rating
                  </Badge>
                  {profile.department && (
                    <Badge variant="outline">
                      {profile.department}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Recent Uploads */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Uploads</h2>
        {profile.recent_uploads && profile.recent_uploads.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profile.recent_uploads.map((resource, index) => (
              <motion.div
                key={resource.resource_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ResourceCard 
                  resource={resource}
                  onClick={() => setSelectedResource(resource)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Upload}
            title="No uploads yet"
            description="This user hasn't uploaded any resources yet"
          />
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

export default Profile;

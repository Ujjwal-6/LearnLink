import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { UploadForm } from '@/components/UploadForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Upload = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: mockApi.getSubjects,
  });

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: () => mockApi.getTopics(),
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      // Only add fields the backend expects
      formData.append('subject_code', data.subject_code);
      formData.append('topic_name', data.topic_name);
      formData.append('resource_type', data.resource_type);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('uploaded_by', user?.user_id || 'u1');
      
      // Add optional fields
      if (data.file) {
        formData.append('file', data.file);
      }
      if (data.video_url) {
        formData.append('video_url', data.video_url);
      }
      if (data.mark_important) {
        formData.append('mark_important', 'true');
      }
      
      return mockApi.uploadResource(formData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Resource uploaded successfully!');
      navigate(`/resources?topic=${encodeURIComponent(response.topic_name)}`);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload resource');
    },
  });

  if (subjectsLoading || topicsLoading) {
    return (
      <div className="container py-8 px-4">
        <Loader text="Loading form..." />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Upload Resource</h1>
        <p className="text-muted-foreground mb-8">
          Share your study materials to help fellow students
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>
              Fill in the information about your resource. All fields are required unless marked optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadForm
              onSubmit={async (data) => {
                await uploadMutation.mutateAsync(data);
              }}
              subjects={subjects || []}
              topics={topics || []}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Upload;

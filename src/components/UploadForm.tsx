import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link2, Plus } from 'lucide-react';
import { useState } from 'react';

const uploadSchema = z.object({
  subject_code: z.string().min(1, 'Subject is required'),
  subject_name: z.string().optional(),
  subject_semester: z.string().optional(),
  topic_name: z.string().min(1, 'Topic is required').max(100),
  resource_type: z.enum(['note', 'video', 'past_paper', 'tutorial']),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  file: z.any().optional(),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  mark_important: z.boolean().default(false),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadFormProps {
  onSubmit: (data: UploadFormData) => Promise<void>;
  subjects: Array<{ subject_code: string; subject_name: string; semester: number }>;
  topics: Array<{ topic_name: string }>;
}

export const UploadForm = ({ onSubmit, subjects, topics }: UploadFormProps) => {
  const [subjectMode, setSubjectMode] = useState<'existing' | 'new'>('existing');
  const [topicMode, setTopicMode] = useState<'existing' | 'new'>('existing');
  
  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      subject_code: '',
      subject_name: '',
      subject_semester: '',
      topic_name: '',
      resource_type: 'note',
      title: '',
      description: '',
      video_url: '',
      mark_important: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Subject Selection */}
        <div className="space-y-3">
          <FormLabel className="text-base">Subject</FormLabel>
          <Tabs value={subjectMode} onValueChange={(v) => setSubjectMode(v as 'existing' | 'new')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Existing Subject</TabsTrigger>
              <TabsTrigger value="new">Add New Subject</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="mt-4">
              <FormField
                control={form.control}
                name="subject_code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.subject_code} value={subject.subject_code}>
                              {subject.subject_code} - {subject.subject_name} (Sem {subject.semester})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="new" className="mt-4 space-y-3">
              <FormField
                control={form.control}
                name="subject_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CS301" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Unique code for the subject</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Advanced Algorithms" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Full name of the subject</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject_semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Semester</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="8" 
                        placeholder="e.g., 5" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Which semester is this offered?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Topic Selection */}
        <div className="space-y-3">
          <FormLabel className="text-base">Topic</FormLabel>
          <Tabs value={topicMode} onValueChange={(v) => setTopicMode(v as 'existing' | 'new')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Existing Topic</TabsTrigger>
              <TabsTrigger value="new">Create New Topic</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="mt-4">
              <FormField
                control={form.control}
                name="topic_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic.topic_name} value={topic.topic_name}>
                              {topic.topic_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="new" className="mt-4">
              <FormField
                control={form.control}
                name="topic_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Dynamic Programming" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Enter a new topic name for this subject</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>

        <FormField
          control={form.control}
          name="resource_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="note">Notes</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="past_paper">Past Paper</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Complete Guide to Binary Trees" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this resource covers..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Upload File</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...field}
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>PDF, DOC, or PPT files</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL (Optional)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>YouTube or other video link</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mark_important"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Mark as Important</FormLabel>
                <FormDescription>
                  Flag this topic as important for exams
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg">
          <Upload className="mr-2 h-4 w-4" />
          Upload Resource
        </Button>
      </form>
    </Form>
  );
};

import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { BookOpen, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Subjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const initialSemester = searchParams.get('semester') || 'all';
  const [semesterFilter, setSemesterFilter] = useState<string>(initialSemester);

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: mockApi.getSubjects,
  });

  const filteredSubjects = subjects?.filter((subject) => {
    const matchesSearch =
      searchQuery === '' ||
      subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.subject_code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSemester =
      semesterFilter === 'all' || subject.semester.toString() === semesterFilter;

    return matchesSearch && matchesSemester;
  });

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <Loader text="Loading subjects..." />
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
        <h1 className="text-3xl font-bold mb-2">Subjects</h1>
        <p className="text-muted-foreground">Browse subjects and explore topics</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search subjects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={semesterFilter}
          onValueChange={(v) => {
            setSemesterFilter(v);
            const params: any = {};
            if (searchQuery) params.search = searchQuery;
            if (v && v !== 'all') params.semester = v;
            setSearchParams(params);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="1">Semester 1</SelectItem>
            <SelectItem value="2">Semester 2</SelectItem>
            <SelectItem value="3">Semester 3</SelectItem>
            <SelectItem value="4">Semester 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects && filteredSubjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.subject_code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/topics?subject=${subject.subject_code}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{subject.subject_code}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {subject.subject_name}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Sem {subject.semester}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Topics
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No subjects found"
          description="Try adjusting your search or filter criteria"
        />
      )}
    </div>
  );
};

export default Subjects;

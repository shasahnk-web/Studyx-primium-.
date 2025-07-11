
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filters: FilterOptions) => void;
  batches: any[];
  contentType: 'lectures' | 'notes' | 'dpps' | 'live';
}

export interface FilterOptions {
  batch: string;
  subject: string;
  dateFrom: string;
  dateTo: string;
  teacher?: string;
}

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];

export function SearchFilters({ onSearch, onFilter, batches, contentType }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    batch: '',
    subject: '',
    dateFrom: '',
    dateTo: '',
    teacher: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      batch: '',
      subject: '',
      dateFrom: '',
      dateTo: '',
      teacher: ''
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    onFilter(emptyFilters);
    onSearch('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">
            Search by Title{contentType === 'lectures' ? ' / Teacher' : ''} / Description
          </Label>
          <Input
            id="search"
            placeholder={`Search ${contentType}...`}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <Label htmlFor="batch-filter">Batch</Label>
              <Select value={filters.batch} onValueChange={(value) => handleFilterChange('batch', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Batches</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject-filter">Subject</Label>
              <Select value={filters.subject} onValueChange={(value) => handleFilterChange('subject', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {contentType === 'lectures' && (
              <div>
                <Label htmlFor="teacher-filter">Teacher</Label>
                <Input
                  id="teacher-filter"
                  placeholder="Filter by teacher"
                  value={filters.teacher}
                  onChange={(e) => handleFilterChange('teacher', e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="date-from">Date From</Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date-to">Date To</Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

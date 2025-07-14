
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types matching our Supabase schema
export interface Batch {
  id: string;
  name: string;
  description: string | null;
  subjects: string[] | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  fee: number | null;
  course_id: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lecture {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  subject: string | null;
  topic: string | null;
  batch_id: string | null;
  course_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Note {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  subject: string | null;
  batch_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DPP {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  subject: string | null;
  batch_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LiveLecture {
  id: string;
  title: string;
  description: string | null;
  meeting_url: string;
  live_date: string;
  live_time: string;
  subject: string | null;
  topic: string | null;
  batch_id: string | null;
  platform: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Validation functions
const validateLecture = (lecture: Partial<Lecture>): string[] => {
  const errors: string[] = [];
  
  if (!lecture.title?.trim()) errors.push('Title is required');
  if (!lecture.video_url?.trim()) errors.push('Video URL is required');
  if (!lecture.batch_id?.trim()) errors.push('Batch ID is required');
  if (!lecture.subject?.trim()) errors.push('Subject is required');
  
  // URL validation
  if (lecture.video_url) {
    try {
      new URL(lecture.video_url);
    } catch {
      errors.push('Valid video URL is required');
    }
  }
  
  return errors;
};

const validateBatch = (batch: Partial<Batch>): string[] => {
  const errors: string[] = [];
  
  if (!batch.name?.trim()) errors.push('Batch name is required');
  if (!batch.description?.trim()) errors.push('Description is required');
  if (!batch.subjects?.length) errors.push('At least one subject is required');
  
  if (batch.start_date && batch.end_date) {
    if (new Date(batch.end_date) <= new Date(batch.start_date)) {
      errors.push('End date must be after start date');
    }
  }
  
  return errors;
};

// Batch operations
export const fetchBatches = async (): Promise<Batch[]> => {
  console.log('🔄 Fetching batches from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching batches:', error);
      toast.error('Failed to fetch batches');
      return [];
    }

    console.log('✅ Successfully fetched batches:', data?.length || 0);
    console.log('📊 Batch data:', data?.map(b => ({ name: b.name, course_id: b.course_id })));
    return data || [];
  } catch (error) {
    console.error('❌ Exception fetching batches:', error);
    toast.error('Failed to fetch batches');
    return [];
  }
};

export const createBatch = async (batchData: Omit<Batch, 'id' | 'created_at' | 'updated_at'>): Promise<Batch | null> => {
  console.log('🔄 Creating batch:', batchData);
  
  const errors = validateBatch(batchData);
  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return null;
  }

  try {
    // Ensure course_id is set, default to 'pw-courses' if not provided
    const batchWithDefaults = {
      ...batchData,
      course_id: batchData.course_id || 'pw-courses',
      status: batchData.status || 'active'
    };

    const { data, error } = await supabase
      .from('batches')
      .insert([batchWithDefaults])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating batch:', error);
      toast.error('Failed to create batch');
      return null;
    }

    console.log('✅ Successfully created batch:', data);
    toast.success('Batch created successfully');
    return data;
  } catch (error) {
    console.error('❌ Exception creating batch:', error);
    toast.error('Failed to create batch');
    return null;
  }
};

export const updateBatch = async (id: string, updates: Partial<Batch>): Promise<Batch | null> => {
  console.log('🔄 Updating batch:', id, updates);
  
  const errors = validateBatch(updates);
  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('batches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating batch:', error);
      toast.error('Failed to update batch');
      return null;
    }

    console.log('✅ Successfully updated batch:', data);
    toast.success('Batch updated successfully');
    return data;
  } catch (error) {
    console.error('❌ Exception updating batch:', error);
    toast.error('Failed to update batch');
    return null;
  }
};

export const deleteBatch = async (id: string): Promise<boolean> => {
  console.log('🔄 Deleting batch:', id);
  
  try {
    // First delete associated content
    await Promise.all([
      supabase.from('lectures').delete().eq('batch_id', id),
      supabase.from('notes').delete().eq('batch_id', id),
      supabase.from('dpps').delete().eq('batch_id', id)
    ]);

    const { error } = await supabase
      .from('batches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting batch:', error);
      toast.error('Failed to delete batch');
      return false;
    }

    console.log('✅ Successfully deleted batch and associated content');
    toast.success('Batch deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Exception deleting batch:', error);
    toast.error('Failed to delete batch');
    return false;
  }
};

// Lecture operations
export const fetchLectures = async (batchId?: string): Promise<Lecture[]> => {
  console.log('🔄 Fetching lectures from Supabase...', batchId ? `for batch: ${batchId}` : 'all');
  
  try {
    let query = supabase
      .from('lectures')
      .select('*')
      .order('created_at', { ascending: false });

    if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching lectures:', error);
      toast.error('Failed to fetch lectures');
      return [];
    }

    console.log('✅ Successfully fetched lectures:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Exception fetching lectures:', error);
    toast.error('Failed to fetch lectures');
    return [];
  }
};

export const createLecture = async (lectureData: Omit<Lecture, 'id' | 'created_at' | 'updated_at'>): Promise<Lecture | null> => {
  console.log('🔄 Creating lecture:', lectureData);
  
  const errors = validateLecture(lectureData);
  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('lectures')
      .insert([lectureData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating lecture:', error);
      toast.error('Failed to create lecture');
      return null;
    }

    console.log('✅ Successfully created lecture:', data);
    toast.success('Lecture created successfully');
    return data;
  } catch (error) {
    console.error('❌ Exception creating lecture:', error);
    toast.error('Failed to create lecture');
    return null;
  }
};

export const updateLecture = async (id: string, updates: Partial<Lecture>): Promise<Lecture | null> => {
  console.log('🔄 Updating lecture:', id, updates);
  
  const errors = validateLecture({ ...updates, id });
  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('lectures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating lecture:', error);
      toast.error('Failed to update lecture');
      return null;
    }

    console.log('✅ Successfully updated lecture:', data);
    toast.success('Lecture updated successfully');
    return data;
  } catch (error) {
    console.error('❌ Exception updating lecture:', error);
    toast.error('Failed to update lecture');
    return null;
  }
};

export const deleteLecture = async (id: string): Promise<boolean> => {
  console.log('🔄 Deleting lecture:', id);
  
  try {
    const { error } = await supabase
      .from('lectures')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting lecture:', error);
      toast.error('Failed to delete lecture');
      return false;
    }

    console.log('✅ Successfully deleted lecture');
    toast.success('Lecture deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Exception deleting lecture:', error);
    toast.error('Failed to delete lecture');
    return false;
  }
};

// Notes operations
export const fetchNotes = async (batchId?: string): Promise<Note[]> => {
  console.log('🔄 Fetching notes from Supabase...', batchId ? `for batch: ${batchId}` : 'all');
  
  try {
    let query = supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching notes:', error);
      return [];
    }

    console.log('✅ Successfully fetched notes:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Exception fetching notes:', error);
    return [];
  }
};

// DPP operations
export const fetchDPPs = async (batchId?: string): Promise<DPP[]> => {
  console.log('🔄 Fetching DPPs from Supabase...', batchId ? `for batch: ${batchId}` : 'all');
  
  try {
    let query = supabase
      .from('dpps')
      .select('*')
      .order('created_at', { ascending: false });

    if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching DPPs:', error);
      return [];
    }

    console.log('✅ Successfully fetched DPPs:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Exception fetching DPPs:', error);
    return [];
  }
};

// Real-time subscription helper
export const subscribeToLectures = (callback: (lectures: Lecture[]) => void) => {
  console.log('🔄 Setting up real-time subscription for lectures...');
  
  const channel = supabase
    .channel('lectures-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'lectures'
      },
      async () => {
        console.log('📡 Lectures changed, refetching...');
        const lectures = await fetchLectures();
        callback(lectures);
      }
    )
    .subscribe();

  return () => {
    console.log('🔄 Unsubscribing from lectures changes...');
    supabase.removeChannel(channel);
  };
};

export const subscribeToBatches = (callback: (batches: Batch[]) => void) => {
  console.log('🔄 Setting up real-time subscription for batches...');
  
  const channel = supabase
    .channel('batches-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'batches'
      },
      async () => {
        console.log('📡 Batches changed, refetching...');
        const batches = await fetchBatches();
        callback(batches);
      }
    )
    .subscribe();

  return () => {
    console.log('🔄 Unsubscribing from batches changes...');
    supabase.removeChannel(channel);
  };
};

// Live Lectures operations
export const fetchLiveLectures = async (batchId?: string): Promise<LiveLecture[]> => {
  console.log('🔄 Fetching live lectures from Supabase...', batchId ? `for batch: ${batchId}` : 'all');
  
  try {
    let query = supabase
      .from('live_lectures')
      .select('*')
      .order('live_date', { ascending: true })
      .order('live_time', { ascending: true });

    if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching live lectures:', error);
      return [];
    }

    console.log('✅ Successfully fetched live lectures:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Exception fetching live lectures:', error);
    return [];
  }
};

export const createLiveLecture = async (lectureData: Omit<LiveLecture, 'id' | 'created_at' | 'updated_at'>): Promise<LiveLecture | null> => {
  console.log('🔄 Creating live lecture:', lectureData);
  
  try {
    const { data, error } = await supabase
      .from('live_lectures')
      .insert([lectureData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating live lecture:', error);
      toast.error('Failed to create live lecture');
      return null;
    }

    console.log('✅ Successfully created live lecture:', data);
    toast.success('Live lecture created successfully');
    return data;
  } catch (error) {
    console.error('❌ Exception creating live lecture:', error);
    toast.error('Failed to create live lecture');
    return null;
  }
};

export const updateLiveLecture = async (id: string, updates: Partial<LiveLecture>): Promise<LiveLecture | null> => {
  console.log('🔄 Updating live lecture:', id, updates);
  
  try {
    const { data, error } = await supabase
      .from('live_lectures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating live lecture:', error);
      toast.error('Failed to update live lecture');
      return null;
    }

    console.log('✅ Successfully updated live lecture:', data);
    toast.success('Live lecture updated successfully');
    return data;
  } catch (error) {
    console.error('❌ Exception updating live lecture:', error);
    toast.error('Failed to update live lecture');
    return null;
  }
};

export const deleteLiveLecture = async (id: string): Promise<boolean> => {
  console.log('🔄 Deleting live lecture:', id);
  
  try {
    const { error } = await supabase
      .from('live_lectures')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting live lecture:', error);
      toast.error('Failed to delete live lecture');
      return false;
    }

    console.log('✅ Successfully deleted live lecture');
    toast.success('Live lecture deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Exception deleting live lecture:', error);
    toast.error('Failed to delete live lecture');
    return false;
  }
};

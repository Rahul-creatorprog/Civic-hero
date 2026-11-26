import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Views
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reporterFilter, setReporterFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // 'newest' | 'most_upvoted' | 'oldest'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'map'
  
  // Roles: 'citizen' or 'authority' (Municipal officer)
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('civic_user_role') || 'citizen';
  });

  // Gamification for kids / community engagement
  const [kidStars, setKidStars] = useState(() => {
    return parseInt(localStorage.getItem('civic_kid_stars') || '3', 10);
  });

  // Modals
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sync role to localStorage
  useEffect(() => {
    localStorage.setItem('civic_user_role', userRole);
  }, [userRole]);

  // Sync stars to localStorage
  useEffect(() => {
    localStorage.setItem('civic_kid_stars', kidStars.toString());
  }, [kidStars]);

  // Fetch issues
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (reporterFilter !== 'All') params.append('reporterType', reporterFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (sortOption) params.append('sort', sortOption);

      const res = await fetch(`/api/issues?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setIssues(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch issues:', err);
      setError('Could not connect to the civic server. Retrying...');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, reporterFilter, searchQuery, sortOption]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [fetchIssues, fetchStats]);

  // Upvote an issue
  const upvoteIssue = async (id) => {
    try {
      const res = await fetch(`/api/issues/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIssues(prev =>
          prev.map(item =>
            item.id.toLowerCase() === id.toLowerCase()
              ? { ...item, upvotes: data.upvotes }
              : item
          )
        );
        if (selectedIssue && selectedIssue.id.toLowerCase() === id.toLowerCase()) {
          setSelectedIssue(prev => ({ ...prev, upvotes: data.upvotes }));
        }
        fetchStats();
        return true;
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
      return false;
    }
  };

  // Add comment
  const addComment = async (issueId, commentData) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      const data = await res.json();
      if (data.success) {
        setIssues(prev =>
          prev.map(item => {
            if (item.id.toLowerCase() === issueId.toLowerCase()) {
              const updatedComments = [...(item.comments || []), data.comment];
              return { ...item, comments: updatedComments };
            }
            return item;
          })
        );
        if (selectedIssue && selectedIssue.id.toLowerCase() === issueId.toLowerCase()) {
          setSelectedIssue(prev => ({
            ...prev,
            comments: [...(prev.comments || []), data.comment]
          }));
        }
        return true;
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      return false;
    }
  };

  // Create new issue
  const createIssue = async (formData) => {
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        // Award kid star if reported
        setKidStars(prev => prev + 1);

        await fetchIssues();
        await fetchStats();
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to create issue:', err);
      return null;
    }
  };

  // Authority Action: Update Status & assign
  const updateIssueStatus = async (issueId, updatePayload) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const data = await res.json();
      if (data.success) {
        setIssues(prev =>
          prev.map(item =>
            item.id.toLowerCase() === issueId.toLowerCase() ? data.data : item
          )
        );
        if (selectedIssue && selectedIssue.id.toLowerCase() === issueId.toLowerCase()) {
          setSelectedIssue(data.data);
        }
        await fetchStats();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update status:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        issues,
        stats,
        loading,
        error,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        reporterFilter,
        setReporterFilter,
        searchQuery,
        setSearchQuery,
        sortOption,
        setSortOption,
        viewMode,
        setViewMode,
        userRole,
        setUserRole,
        kidStars,
        setKidStars,
        selectedIssue,
        setSelectedIssue,
        isReportModalOpen,
        setIsReportModalOpen,
        fetchIssues,
        fetchStats,
        upvoteIssue,
        addComment,
        createIssue,
        updateIssueStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

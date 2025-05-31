import { Component, OnInit } from '@angular/core';
import { MarksEntry } from '../../../Models/marks-entry';
import { MarkEntryService } from '../../../Services/marks-entry.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-marksnew-entry-list',
    templateUrl: './marksnew-entry-list.component.html',
    styleUrl: './marksnew-entry-list.component.css'
})
export class MarksnewEntryListComponent implements OnInit {

    markEntries: MarksEntry[] = [];
    filteredMarkEntries: MarksEntry[] = [];
    paginatedMarkEntries: MarksEntry[] = [];
    errorMessage = '';

    // Search and filter properties
    searchTerm = '';
    selectedSubject = '';
    selectedExamType = '';
    selectedStandard = '';
    selectedStaff = '';
    selectedDateRange = '';
    selectedMarksRange = '';
    selectedSort = '';
    showAdvancedFilters = false;

    // UI state properties
    isLoading = false;
    viewMode: 'table' | 'card' | 'compact' = 'table';
    chartType: 'pie' | 'bar' = 'pie';

    // Pagination properties
    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    // Bulk actions
    selectedEntries: MarksEntry[] = [];
    selectAll = false;

    constructor(private markEntryService: MarkEntryService, private router: Router) { }

    ngOnInit(): void {
        this.loadMarkEntries();
    }

    loadMarkEntries(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.markEntryService.getAllMarkEntries().subscribe({
            next: (markEntries) => {
                this.markEntries = markEntries;
                this.applyFilters();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching mark entries:', error);
                this.errorMessage = 'An error occurred while fetching the mark entries. Please try again later.';
                this.isLoading = false;
            }
        });
    }

    // Search functionality
    onSearch(searchTerm: string): void {
        this.searchTerm = searchTerm.toLowerCase().trim();
        this.currentPage = 1;
        this.applyFilters();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.applyFilters();
    }

    // Filter functionality
    onSubjectFilter(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedSubject = target.value;
        this.currentPage = 1;
        this.applyFilters();
    }

    onExamTypeFilter(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedExamType = target.value;
        this.currentPage = 1;
        this.applyFilters();
    }

    onStandardFilter(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedStandard = target.value;
        this.currentPage = 1;
        this.applyFilters();
    }

    onStaffFilter(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedStaff = target.value;
        this.currentPage = 1;
        this.applyFilters();
    }

    onDateRangeFilter(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedDateRange = target.value;
        this.currentPage = 1;
        this.applyFilters();
    }

    onMarksRangeFilter(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedMarksRange = target.value;
        this.currentPage = 1;
        this.applyFilters();
    }

    onSortFilter(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedSort = target.value;
        this.currentPage = 1;
        this.applyFilters();
    }

    onPageSizeChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.pageSize = parseInt(target.value);
        this.currentPage = 1;
        this.updatePagination();
    }

    toggleAdvancedFilters(): void {
        this.showAdvancedFilters = !this.showAdvancedFilters;
    }

    hasActiveFilters(): boolean {
        return !!(this.searchTerm || this.selectedSubject || this.selectedExamType ||
            this.selectedStandard || this.selectedStaff || this.selectedDateRange ||
            this.selectedMarksRange || this.selectedSort);
    }

    // Apply all filters
    applyFilters(): void {
        if (!this.markEntries || this.markEntries.length === 0) {
            this.filteredMarkEntries = [];
            this.updatePagination();
            return;
        }

        this.filteredMarkEntries = this.markEntries.filter(entry => {
            // Search filter
            const matchesSearch = !this.searchTerm ||
                (entry.staff?.staffName && entry.staff.staffName.toLowerCase().includes(this.searchTerm)) ||
                (entry.subject?.subjectName && entry.subject.subjectName.toLowerCase().includes(this.searchTerm)) ||
                (entry.examType?.examTypeName && entry.examType.examTypeName.toLowerCase().includes(this.searchTerm)) ||
                (entry.standard?.standardName && entry.standard.standardName.toLowerCase().includes(this.searchTerm));

            // Subject filter
            const matchesSubject = !this.selectedSubject ||
                (entry.subject?.subjectName && entry.subject.subjectName === this.selectedSubject);

            // Exam type filter
            const matchesExamType = !this.selectedExamType ||
                (entry.examType?.examTypeName && entry.examType.examTypeName === this.selectedExamType);

            // Standard filter
            const matchesStandard = !this.selectedStandard ||
                (entry.standard?.standardName && entry.standard.standardName === this.selectedStandard);

            // Staff filter
            const matchesStaff = !this.selectedStaff ||
                (entry.staff?.staffName && entry.staff.staffName === this.selectedStaff);

            // Date range filter
            const matchesDateRange = !this.selectedDateRange || this.checkDateRange(entry, this.selectedDateRange);

            // Marks range filter
            const matchesMarksRange = !this.selectedMarksRange || this.checkMarksRange(entry, this.selectedMarksRange);

            return matchesSearch && matchesSubject && matchesExamType && matchesStandard &&
                matchesStaff && matchesDateRange && matchesMarksRange;
        });

        // Apply sorting
        if (this.selectedSort) {
            this.applySorting();
        }

        this.updatePagination();
    }

    private checkDateRange(entry: MarksEntry, range: string): boolean {
        if (!entry.markEntryDate) {
            return false;
        }

        const entryDate = new Date(entry.markEntryDate);
        if (isNaN(entryDate.getTime())) {
            return false;
        }

        const now = new Date();

        switch (range) {
            case 'today':
                return entryDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return entryDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                return entryDate >= monthAgo;
            case 'quarter':
                const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                return entryDate >= quarterAgo;
            case 'year':
                const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                return entryDate >= yearAgo;
            default:
                return true;
        }
    }

    private checkMarksRange(entry: MarksEntry, range: string): boolean {
        const totalMarks = entry.totalMarks || 0;
        switch (range) {
            case '0-50': return totalMarks >= 0 && totalMarks <= 50;
            case '51-100': return totalMarks >= 51 && totalMarks <= 100;
            case '101-200': return totalMarks >= 101 && totalMarks <= 200;
            case '201+': return totalMarks > 200;
            default: return true;
        }
    }

    private applySorting(): void {
        switch (this.selectedSort) {
            case 'date-desc':
                this.filteredMarkEntries.sort((a, b) => {
                    const dateA = a.markEntryDate ? new Date(a.markEntryDate).getTime() : 0;
                    const dateB = b.markEntryDate ? new Date(b.markEntryDate).getTime() : 0;
                    return dateB - dateA;
                });
                break;
            case 'date-asc':
                this.filteredMarkEntries.sort((a, b) => {
                    const dateA = a.markEntryDate ? new Date(a.markEntryDate).getTime() : 0;
                    const dateB = b.markEntryDate ? new Date(b.markEntryDate).getTime() : 0;
                    return dateA - dateB;
                });
                break;
            case 'subject-asc':
                this.filteredMarkEntries.sort((a, b) => (a.subject?.subjectName || '').localeCompare(b.subject?.subjectName || ''));
                break;
            case 'staff-asc':
                this.filteredMarkEntries.sort((a, b) => (a.staff?.staffName || '').localeCompare(b.staff?.staffName || ''));
                break;
            case 'marks-desc':
                this.filteredMarkEntries.sort((a, b) => (b.totalMarks || 0) - (a.totalMarks || 0));
                break;
            case 'marks-asc':
                this.filteredMarkEntries.sort((a, b) => (a.totalMarks || 0) - (b.totalMarks || 0));
                break;
        }
    }

    // Clear all filters
    clearAllFilters(): void {
        this.searchTerm = '';
        this.selectedSubject = '';
        this.selectedExamType = '';
        this.selectedStandard = '';
        this.selectedStaff = '';
        this.selectedDateRange = '';
        this.selectedMarksRange = '';
        this.selectedSort = '';
        this.currentPage = 1;
        this.applyFilters();
    }

    // Pagination functionality
    updatePagination(): void {
        this.totalPages = Math.ceil(this.filteredMarkEntries.length / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedMarkEntries = this.filteredMarkEntries.slice(startIndex, endIndex);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    // View mode functionality
    setViewMode(mode: 'table' | 'card' | 'compact'): void {
        this.viewMode = mode;
    }

    toggleChartType(): void {
        this.chartType = this.chartType === 'pie' ? 'bar' : 'pie';
    }

    // Enhanced Statistics methods
    getTotalChangePercent(): number {
        // Mock implementation - would need historical data
        return Math.floor(Math.random() * 15) + 1;
    }

    getCompletedEntriesCount(): number {
        if (!this.filteredMarkEntries || this.filteredMarkEntries.length === 0) return 0;
        return this.filteredMarkEntries.filter(entry => entry.studentMarksDetails && entry.studentMarksDetails.length > 0).length;
    }

    getCompletedPercentage(): number {
        if (!this.filteredMarkEntries || this.filteredMarkEntries.length === 0) return 0;
        return Math.round((this.getCompletedEntriesCount() / this.filteredMarkEntries.length) * 100);
    }

    getTotalStudentsCount(): number {
        if (!this.filteredMarkEntries || this.filteredMarkEntries.length === 0) return 0;
        return this.filteredMarkEntries.reduce((total, entry) => total + (entry.studentMarksDetails?.length || 0), 0);
    }

    getAverageStudentsPerEntry(): number {
        if (!this.filteredMarkEntries || this.filteredMarkEntries.length === 0) return 0;
        return Math.round(this.getTotalStudentsCount() / this.filteredMarkEntries.length);
    }

    getAverageMarks(): number {
        if (!this.filteredMarkEntries || this.filteredMarkEntries.length === 0) return 0;
        const totalMarks = this.filteredMarkEntries.reduce((sum, entry) => sum + (entry.totalMarks || 0), 0);
        return Math.round(totalMarks / this.filteredMarkEntries.length);
    }

    getAverageEntriesPerStaff(): number {
        const uniqueStaff = this.getUniqueStaff();
        if (uniqueStaff.length === 0) return 0;
        return Math.round(this.filteredMarkEntries.length / uniqueStaff.length);
    }

    getSubjectDistribution(): any[] {
        if (!this.filteredMarkEntries || this.filteredMarkEntries.length === 0) return [];

        const distribution: { [key: string]: number } = {};

        this.filteredMarkEntries.forEach(entry => {
            const subject = entry.subject?.subjectName || 'Unknown';
            distribution[subject] = (distribution[subject] || 0) + 1;
        });

        return Object.entries(distribution).map(([subject, count]) => ({
            subject,
            count,
            percentage: Math.round((count / this.filteredMarkEntries.length) * 100)
        }));
    }

    // Helper methods to get unique values
    getUniqueSubjects(): string[] {
        if (!this.markEntries || this.markEntries.length === 0) return [];

        const subjects = this.markEntries
            .map(entry => entry.subject?.subjectName)
            .filter((subject, index, array) => subject && array.indexOf(subject) === index)
            .sort();

        return subjects as string[];
    }

    getUniqueExamTypes(): string[] {
        if (!this.markEntries || this.markEntries.length === 0) return [];

        const examTypes = this.markEntries
            .map(entry => entry.examType?.examTypeName)
            .filter((examType, index, array) => examType && array.indexOf(examType) === index)
            .sort();

        return examTypes as string[];
    }

    getUniqueStandards(): string[] {
        if (!this.markEntries || this.markEntries.length === 0) return [];

        const standards = this.markEntries
            .map(entry => entry.standard?.standardName)
            .filter((standard, index, array) => standard && array.indexOf(standard) === index)
            .sort();

        return standards as string[];
    }

    getUniqueStaff(): string[] {
        if (!this.markEntries || this.markEntries.length === 0) return [];

        const staff = this.markEntries
            .map(entry => entry.staff?.staffName)
            .filter((staff, index, array) => staff && array.indexOf(staff) === index)
            .sort();

        return staff as string[];
    }

    // Bulk Actions
    toggleSelectAll(): void {
        this.selectAll = !this.selectAll;
        if (this.selectAll) {
            this.selectedEntries = [...this.paginatedMarkEntries];
        } else {
            this.selectedEntries = [];
        }
    }

    toggleSelectEntry(entry: MarksEntry): void {
        const index = this.selectedEntries.findIndex(e => e.markEntryId === entry.markEntryId);
        if (index > -1) {
            this.selectedEntries.splice(index, 1);
        } else {
            this.selectedEntries.push(entry);
        }
        this.selectAll = this.selectedEntries.length === this.paginatedMarkEntries.length;
    }

    isEntrySelected(entry: MarksEntry): boolean {
        return this.selectedEntries.some(e => e.markEntryId === entry.markEntryId);
    }

    clearSelection(): void {
        this.selectedEntries = [];
        this.selectAll = false;
    }

    bulkExport(): void {
        console.log('Bulk export:', this.selectedEntries);
        // Implement bulk export functionality
    }

    bulkEdit(): void {
        console.log('Bulk edit:', this.selectedEntries);
        // Implement bulk edit functionality
    }

    bulkDelete(): void {
        if (confirm(`Are you sure you want to delete ${this.selectedEntries.length} selected entries?`)) {
            console.log('Bulk delete:', this.selectedEntries);
            // Implement bulk delete functionality
            this.clearSelection();
        }
    }

    // Action methods
    viewStudents(entry: MarksEntry): void {
        this.getStudentsDetails(entry);
    }

    deleteEntry(entryId: number): void {
        if (confirm('Are you sure you want to delete this mark entry?')) {
            // Implement delete functionality
            this.markEntries = this.markEntries.filter(entry => entry.markEntryId !== entryId);
            this.applyFilters();
            console.log('Entry deleted successfully');
        }
    }

    // Utility methods
    refreshData(): void {
        this.loadMarkEntries();
    }

    exportData(): void {
        console.log('Export functionality to be implemented');
        // Implement export functionality
    }

    generateReport(): void {
        console.log('Generate report functionality to be implemented');
        // Implement report generation
    }

    getStudentsDetails(markEntry: MarksEntry): void {
        markEntry.studentMarksDetails = [];
        this.markEntryService.GetStudents(markEntry).subscribe({
            next: (students) => {
                markEntry.studentMarksDetails = students;
                console.log('Students details loaded:', students);
            },
            error: (error) => {
                console.error('Error fetching student details:', error);
            }
        });
    }

    // Math helper for template
    Math = Math;

    // Helper method for generating CSS classes
    getSubjectCssClass(subject: string): string {
        return 'subject-' + subject.toLowerCase().replace(/\s+/g, '-');
    }
} 
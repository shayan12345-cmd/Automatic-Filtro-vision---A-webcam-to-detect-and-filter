class FilterHistory {
    constructor() {
        console.log('Initializing FilterHistory');
        this.filterList = document.getElementById('filterList');
        console.log('Filter list element:', this.filterList);
        this.filters = JSON.parse(localStorage.getItem('filterHistory')) || [];
        this.loadFilterHistory();
    }

    saveFilter(filter) {
        console.log('Saving filter:', filter);
        const timestamp = new Date().toLocaleString();
        this.filters.unshift({ filter, timestamp });
        this.filters = this.filters.slice(0, 5); // Keep only last 5 filters
        localStorage.setItem('filterHistory', JSON.stringify(this.filters));
        this.loadFilterHistory();
    }

    loadFilterHistory() {
        console.log('Loading filter history');
        if (!this.filterList) {
            console.error('Filter list element not found');
            return;
        }
        
        this.filterList.innerHTML = '';
        
        if (this.filters.length === 0) {
            this.filterList.innerHTML = '<li class="no-filters">No filters used yet</li>';
            return;
        }

        this.filters.forEach(item => {
            const li = document.createElement('li');
            li.className = 'filter-item';
            
            const filterName = document.createElement('span');
            filterName.className = 'filter-name';
            filterName.textContent = item.filter;
            
            const timestamp = document.createElement('span');
            timestamp.className = 'filter-timestamp';
            timestamp.textContent = item.timestamp;
            
            li.appendChild(filterName);
            li.appendChild(timestamp);
            this.filterList.appendChild(li);
        });
        
        console.log('Filter history loaded:', this.filters);
    }

    displayFilterHistory(filters) {
        console.log('Displaying filter history');
        if (!this.historyContainer) {
            console.error('History container not found');
            return;
        }

        // Clear previous content
        this.historyContainer.innerHTML = '';

        // Create header
        const header = document.createElement('h3');
        header.textContent = 'Last 5 Used Filters';
        header.className = 'history-header';
        this.historyContainer.appendChild(header);

        if (filters.length === 0) {
            const noFilters = document.createElement('p');
            noFilters.textContent = 'No filters used yet';
            noFilters.className = 'no-filters';
            this.historyContainer.appendChild(noFilters);
            return;
        }

        // Create filter list
        const filterList = document.createElement('ul');
        filterList.className = 'filter-list';
        
        filters.forEach(filter => {
            const listItem = document.createElement('li');
            listItem.className = 'filter-item';
            
            // Create filter name span
            const filterName = document.createElement('span');
            filterName.className = 'filter-name';
            filterName.textContent = filter.filter;
            
            // Create timestamp span
            const timestamp = document.createElement('span');
            timestamp.className = 'filter-timestamp';
            timestamp.textContent = new Date(filter.timestamp).toLocaleString();
            
            // Add both spans to list item
            listItem.appendChild(filterName);
            listItem.appendChild(timestamp);
            
            filterList.appendChild(listItem);
        });

        this.historyContainer.appendChild(filterList);
        console.log('Filter history displayed');
    }
}

// Initialize filter history when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.filterHistory = new FilterHistory();
}); 
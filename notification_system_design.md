# Campus Notifications Microservice Design

## Stage 1: Priority Inbox Algorithm

### 1. Weight-based Scoring System
The notifications are fetched from the API and must be sorted efficiently so that students see the most critical updates first. We assign a static weight to each notification type:
- **Placement**: Weight = 3
- **Result**: Weight = 2
- **Event**: Weight = 1

The static weight represents the base priority level of the notification.

### 2. Recency Tiebreaker using Timestamp
Within the same category (e.g., multiple Placement notifications), newer notifications should appear before older ones. We utilize the timestamp to calculate a recency score.
The combined score is calculated using the formula:
`Combined Score = (Type Weight * 1000) + Recency Score`

Since timestamps are typically UNIX epoch values (milliseconds or seconds), simply using the epoch might cause the recency score to overwhelm the type weight if not scaled properly. 
To safely combine them, we can use a direct sorting comparator rather than a single arithmetic score.
The algorithm performs a stable sort:
1. Compare the Type Weight. Higher weight wins.
2. If weights are equal, compare the Timestamp. Higher timestamp (newer) wins.

### 3. Efficient Selection of Top N
After fetching the notifications from the upstream API:
- The backend/frontend algorithm parses all items.
- It applies the sorting comparator (O(M log M) time complexity, where M is the total number of notifications).
- Once sorted, we simply slice the array to select the first `N` elements (e.g., Top 10, 15, or 20).
For highly optimized scaling when M is very large, a Min-Heap (Priority Queue) of size N can be used. Inserting M elements into a size N heap takes O(M log N) time, which is much faster than full sorting when N is small.

### 4. Handling New Incoming Notifications (System Efficiency)
As new notifications continuously enter the system:
- We can maintain a cached sorted array or heap in state.
- When new notifications arrive via WebSocket or polling, they are inserted into the current list.
- Since the list is already sorted, inserting a new element takes O(log N) using binary search insertion. 
- If the new list exceeds the required `N` size, the lowest priority item is evicted, ensuring memory and computational overhead remain strictly bounded regardless of how many notifications exist upstream.

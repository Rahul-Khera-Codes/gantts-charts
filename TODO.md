# ResourceVue V2 - DHTMLX Gantt Implementation Checklist

## Overview
Implementation plan for integrating DHTMLX Gantt into ResourceVue V2 platform with Critical Path Analysis (CPA) support.

**Timeline Estimate:** 4-6 weeks  
**License Required:** Enterprise ($2,999) or Ultimate ($5,999)

---

## Phase 1: Data Structure & Hierarchy Setup
> Map ResourceVue hierarchy to DHTMLX Gantt format

- [ ] Define custom task types for ResourceVue hierarchy:
  - [ ] `project` type — Top-level Project nodes
  - [ ] `workpackage` type — Work Requests (WRs) under Projects
  - [ ] `task` type — Tasks under WRs or directly under Projects
  - [ ] `milestone` type — Milestones (connected or standalone)

- [ ] Create JSON data transformation layer:
  - [ ] Map Project → parent: 0 (root level)
  - [ ] Map WR → parent: Project ID
  - [ ] Map Task → parent: WR ID or Project ID (direct connection)
  - [ ] Map Milestone → parent: Project ID or WR ID

- [ ] Define required fields for each entity:
  - [ ] `id` — Unique identifier
  - [ ] `text` — Display name
  - [ ] `start_date` — Start date (format: YYYY-MM-DD)
  - [ ] `end_date` — End date (optional, calculated from duration)
  - [ ] `duration` — Duration in days
  - [ ] `progress` — Completion percentage (0 to 1)
  - [ ] `parent` — Parent entity ID
  - [ ] `type` — Entity type (project/workpackage/task/milestone)
  - [ ] `open` — Whether node is expanded (boolean)

---

## Phase 2: Dependency Links (Critical for CPA)
> Dependencies drive Critical Path calculation — this is essential

- [ ] Create dependency/links data structure:
  - [ ] `id` — Unique link identifier
  - [ ] `source` — Source task ID
  - [ ] `target` — Target task ID
  - [ ] `type` — Link type (0=finish-to-start, 1=start-to-start, 2=finish-to-finish, 3=start-to-finish)

- [ ] Map existing ResourceVue dependencies to DHTMLX links format

- [ ] Handle different dependency scenarios:
  - [ ] Task-to-Task dependencies
  - [ ] Task-to-Milestone dependencies
  - [ ] WR-to-WR dependencies (if applicable)
  - [ ] Cross-project dependencies (if applicable)

- [ ] Implement lag/lead time support (optional):
  - [ ] Add `lag` field to links for delays between tasks

---

## Phase 3: Critical Path Implementation
> Highlight the minimum duration path through the project

- [ ] Enable Critical Path plugin:
  ```javascript
  gantt.plugins({ critical_path: true });
  ```

- [ ] Configure Critical Path settings:
  - [ ] Set highlight color for critical tasks (e.g., red)
  - [ ] Configure slack/float time display
  - [ ] Enable multiple critical paths if needed

- [ ] Add Critical Path toggle UI:
  - [ ] Button to show/hide critical path highlighting
  - [ ] Legend explaining critical vs non-critical tasks

- [ ] Implement Critical Path recalculation:
  - [ ] Auto-recalculate on task edit
  - [ ] Auto-recalculate on dependency change
  - [ ] Auto-recalculate on drag-and-drop

---

## Phase 4: Visual Styling Per Entity Type
> Different colors/styles for Projects, WRs, Tasks, Milestones

- [ ] Create custom CSS classes for each type:
  - [ ] `.gantt-project` — Project bars (e.g., blue)
  - [ ] `.gantt-workpackage` — WR bars (e.g., green)
  - [ ] `.gantt-task` — Task bars (e.g., orange)
  - [ ] `.gantt-milestone` — Milestone diamonds (e.g., purple)
  - [ ] `.gantt-critical` — Critical path items (e.g., red)

- [ ] Configure task templates:
  - [ ] Custom bar rendering per type
  - [ ] Progress bar styling
  - [ ] Milestone icon/shape

- [ ] Add visual indicators:
  - [ ] Overdue tasks highlighting
  - [ ] Completed tasks styling
  - [ ] Dependency arrows styling

---

## Phase 5: Inline Editing & User Interaction
> Allow users to edit directly in the Gantt chart

- [ ] Enable inline editing features:
  - [ ] Click-to-edit task name
  - [ ] Click-to-edit start date
  - [ ] Click-to-edit end date
  - [ ] Click-to-edit duration
  - [ ] Click-to-edit progress percentage

- [ ] Enable drag-and-drop:
  - [ ] Drag task bar to reschedule
  - [ ] Drag task edges to change duration
  - [ ] Drag to create dependencies (link tasks)

- [ ] Configure lightbox (popup editor):
  - [ ] Add custom fields for ResourceVue-specific data
  - [ ] Add dropdown for task type selection
  - [ ] Add resource assignment field (if needed)

- [ ] Implement undo/redo functionality

---

## Phase 6: Backend Integration (REST API)
> Two-way sync between Gantt and ResourceVue backend

- [ ] Create BFF (Backend-for-Frontend) API layer:
  - [ ] `GET /api/gantt/tasks` — Load all tasks in DHTMLX format
  - [ ] `GET /api/gantt/links` — Load all dependencies
  - [ ] `POST /api/gantt/tasks` — Create new task
  - [ ] `PUT /api/gantt/tasks/:id` — Update task
  - [ ] `DELETE /api/gantt/tasks/:id` — Delete task
  - [ ] `POST /api/gantt/links` — Create dependency
  - [ ] `PUT /api/gantt/links/:id` — Update dependency
  - [ ] `DELETE /api/gantt/links/:id` — Delete dependency

- [ ] Implement event handlers for sync:
  - [ ] `onAfterTaskAdd` → POST to backend
  - [ ] `onAfterTaskUpdate` → PUT to backend
  - [ ] `onAfterTaskDelete` → DELETE to backend
  - [ ] `onAfterLinkAdd` → POST link to backend
  - [ ] `onAfterLinkUpdate` → PUT link to backend
  - [ ] `onAfterLinkDelete` → DELETE link to backend

- [ ] Add optimistic updates:
  - [ ] Update UI immediately
  - [ ] Rollback on API failure
  - [ ] Show error notification on failure

- [ ] Implement data loading:
  - [ ] Initial load from API
  - [ ] Lazy loading for large projects (if needed)
  - [ ] Refresh/reload functionality

---

## Phase 7: Role-Based Access Control
> Different permissions for different users

- [ ] Define permission levels:
  - [ ] `admin` — Full edit access
  - [ ] `manager` — Edit own projects/WRs
  - [ ] `member` — Edit assigned tasks only
  - [ ] `viewer` — Read-only access

- [ ] Implement per-task readonly control:
  - [ ] Set `readonly: true` on tasks user cannot edit
  - [ ] Disable drag-and-drop for readonly tasks
  - [ ] Hide edit buttons for readonly tasks

- [ ] Implement per-column readonly control:
  - [ ] Some columns editable, others view-only

---

## Phase 8: Zoom & Timeline Controls
> Day, week, month views

- [ ] Implement zoom levels:
  - [ ] Hour view (for short tasks)
  - [ ] Day view
  - [ ] Week view
  - [ ] Month view
  - [ ] Quarter view
  - [ ] Year view

- [ ] Add zoom controls UI:
  - [ ] Zoom in/out buttons
  - [ ] Zoom level dropdown
  - [ ] Fit-to-screen button

- [ ] Configure timeline header:
  - [ ] Show dates in preferred format
  - [ ] Show week numbers (optional)
  - [ ] Highlight weekends/non-working days

---

## Phase 9: Filtering & Search
> Find and filter tasks quickly

- [ ] Implement task filtering:
  - [ ] Filter by type (Project/WR/Task/Milestone)
  - [ ] Filter by status (Not started/In progress/Completed)
  - [ ] Filter by assignee
  - [ ] Filter by date range
  - [ ] Filter critical path only

- [ ] Implement search:
  - [ ] Search by task name
  - [ ] Highlight matching tasks
  - [ ] Scroll to found task

- [ ] Add filter UI:
  - [ ] Filter dropdowns/checkboxes
  - [ ] Clear filters button
  - [ ] Active filter indicators

---

## Phase 10: Export Functionality
> Export Gantt to various formats

- [ ] Enable export modules:
  - [ ] PDF export
  - [ ] PNG export
  - [ ] Excel export
  - [ ] MS Project export (optional)

- [ ] Configure export settings:
  - [ ] Page size and orientation
  - [ ] Date range to export
  - [ ] Include/exclude columns
  - [ ] Header/footer customization

- [ ] Add export UI:
  - [ ] Export button with format dropdown
  - [ ] Export settings modal

---

## Phase 11: Auto-Scheduling
> Automatically adjust dates based on dependencies

- [ ] Enable auto-scheduling plugin:
  ```javascript
  gantt.plugins({ auto_scheduling: true });
  ```

- [ ] Configure auto-scheduling behavior:
  - [ ] Forward scheduling (default)
  - [ ] Backward scheduling (from deadline)
  - [ ] Respect constraints

- [ ] Add scheduling controls:
  - [ ] Toggle auto-scheduling on/off
  - [ ] Manual recalculate button
  - [ ] Constraint type selector per task

---

## Phase 12: Multi-Tenant SaaS Considerations
> Support multiple customers/organizations

- [ ] Implement tenant isolation:
  - [ ] Filter data by tenant/organization ID
  - [ ] Ensure API endpoints are tenant-aware

- [ ] Add tenant-specific theming:
  - [ ] Custom colors per tenant (optional)
  - [ ] Logo/branding (optional)

---

## Phase 13: Testing & QA

- [ ] Unit tests:
  - [ ] Data transformation functions
  - [ ] API integration functions

- [ ] Integration tests:
  - [ ] Load data from API
  - [ ] Save changes to API
  - [ ] Critical path calculation

- [ ] E2E tests:
  - [ ] Create task flow
  - [ ] Edit task flow
  - [ ] Drag-and-drop flow
  - [ ] Export flow

- [ ] Performance testing:
  - [ ] Test with 100+ tasks
  - [ ] Test with 500+ tasks
  - [ ] Test with 1000+ tasks

---

## Phase 14: Documentation & Handover

- [ ] Technical documentation:
  - [ ] API endpoints documentation
  - [ ] Data structure documentation
  - [ ] Configuration options

- [ ] User documentation:
  - [ ] How to create tasks
  - [ ] How to create dependencies
  - [ ] How to use critical path
  - [ ] How to export

- [ ] Admin documentation:
  - [ ] How to configure permissions
  - [ ] How to customize styling

---

## Quick Reference: Data Format Example

```json
{
  "data": [
    {
      "id": 1,
      "text": "Project Alpha",
      "type": "project",
      "start_date": "2025-07-01",
      "duration": 60,
      "progress": 0.2,
      "parent": 0,
      "open": true
    },
    {
      "id": 2,
      "text": "WR-001: Backend Development",
      "type": "workpackage",
      "start_date": "2025-07-01",
      "duration": 30,
      "progress": 0.3,
      "parent": 1,
      "open": true
    },
    {
      "id": 3,
      "text": "Design Database Schema",
      "type": "task",
      "start_date": "2025-07-01",
      "duration": 5,
      "progress": 1.0,
      "parent": 2
    },
    {
      "id": 4,
      "text": "Implement API Endpoints",
      "type": "task",
      "start_date": "2025-07-08",
      "duration": 10,
      "progress": 0.5,
      "parent": 2
    },
    {
      "id": 5,
      "text": "Backend Complete",
      "type": "milestone",
      "start_date": "2025-07-31",
      "duration": 0,
      "parent": 1
    }
  ],
  "links": [
    { "id": 1, "source": 3, "target": 4, "type": "0" },
    { "id": 2, "source": 4, "target": 5, "type": "0" }
  ]
}
```

---

## Priority Order

| Priority | Phase | Reason |
|----------|-------|--------|
| 🔴 P0 | Phase 1: Data Structure | Foundation — nothing works without this |
| 🔴 P0 | Phase 2: Dependencies | Required for Critical Path |
| 🔴 P0 | Phase 3: Critical Path | Core client requirement |
| 🟠 P1 | Phase 4: Visual Styling | Essential UX |
| 🟠 P1 | Phase 5: Inline Editing | Core functionality |
| 🟠 P1 | Phase 6: Backend Integration | Required for real data |
| 🟡 P2 | Phase 7: Role-Based Access | Security requirement |
| 🟡 P2 | Phase 8: Zoom Controls | Usability |
| 🟢 P3 | Phase 9: Filtering | Nice to have |
| 🟢 P3 | Phase 10: Export | Nice to have |
| 🟢 P3 | Phase 11: Auto-Scheduling | Enhancement |
| 🟢 P3 | Phase 12: Multi-Tenant | SaaS requirement |
| 🟢 P3 | Phase 13-14: Testing/Docs | Quality assurance |

---

*Created: 2025-06-25*  
*Based on: DHTMLX Gantt Evaluation & CPA Opensource Option documents*
